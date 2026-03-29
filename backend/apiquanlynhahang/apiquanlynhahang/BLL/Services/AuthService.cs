using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using apiquanlynhahang.DTOs.Responses;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace apiquanlynhahang.BLL.Services;

public class AuthService
{
    private readonly UngDungDbContext _dbContext;
    private readonly JwtService _jwtService;

    public AuthService(UngDungDbContext dbContext, JwtService jwtService)
    {
        _dbContext = dbContext;
        _jwtService = jwtService;
    }

    public Task<NguoiDung?> LayTheoMaNDAsync(string maNd, CancellationToken cancellationToken = default)
        => _dbContext.NguoiDung.AsNoTracking().FirstOrDefaultAsync(x => x.MaND == maNd, cancellationToken);

    public async Task<DuLieuDangNhapDto?> LayThongTinNguoiDungHienTaiAsync(string maNd, CancellationToken cancellationToken = default)
    {
        var nguoiDung = await _dbContext.NguoiDung
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.MaND == maNd, cancellationToken);

        if (nguoiDung is null)
        {
            return null;
        }

        var maKh = string.Empty;

        if (nguoiDung.VaiTro == "KhachHang")
        {
            maKh = await _dbContext.KhachHang
                .AsNoTracking()
                .Where(x => x.MaND == nguoiDung.MaND)
                .Select(x => x.MaKH)
                .FirstOrDefaultAsync(cancellationToken)
                ?? string.Empty;
        }

        return new DuLieuDangNhapDto
        {
            MaND = nguoiDung.MaND,
            MaKH = maKh,
            TenND = nguoiDung.TenND,
            Email = nguoiDung.Email,
            VaiTro = nguoiDung.VaiTro,
        };
    }

    public Task<NguoiDung?> LayTheoEmailAsync(string email, CancellationToken cancellationToken = default)
        => _dbContext.NguoiDung.AsNoTracking().FirstOrDefaultAsync(x => x.Email == email, cancellationToken);

    public Task<KhachHang?> LayKhachHangTheoMaNDAsync(string maNd, CancellationToken cancellationToken = default)
        => _dbContext.KhachHang.AsNoTracking().FirstOrDefaultAsync(x => x.MaND == maNd, cancellationToken);

    private static string SinhMaNgauNhien(string tienTo) => $"{tienTo}{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";

    public async Task<(DuLieuDangNhapDto? DuLieu, string? Loi)> DangNhapKhachAsync(DangNhapDto dto, CancellationToken cancellationToken = default)
    {
        return await DangNhapTheoVaiTroAsync(dto, ["KhachHang"], cancellationToken);
    }

    public async Task<(DuLieuDangNhapDto? DuLieu, string? Loi)> DangNhapNoiBoAsync(DangNhapDto dto, CancellationToken cancellationToken = default)
    {
        return await DangNhapTheoVaiTroAsync(dto, ["Admin", "NhanVien"], cancellationToken);
    }

    private async Task<(DuLieuDangNhapDto? DuLieu, string? Loi)> DangNhapTheoVaiTroAsync(DangNhapDto dto, string[] vaiTroHopLe, CancellationToken cancellationToken)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        var nguoiDung = await _dbContext.NguoiDung.FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
        if (nguoiDung is null)
        {
            return (null, "Thong tin dang nhap khong dung");
        }

        if (nguoiDung.TrangThai != "Active")
        {
            return (null, "Tai khoan khong hoat dong");
        }

        if (!vaiTroHopLe.Contains(nguoiDung.VaiTro))
        {
            return (null, "Tai khoan khong dung nhom dang nhap");
        }

        if (!BCrypt.Net.BCrypt.Verify(dto.MatKhau, nguoiDung.MatKhau))
        {
            return (null, "Thong tin dang nhap khong dung");
        }

        var maKh = string.Empty;

        if (nguoiDung.VaiTro == "KhachHang")
        {
            maKh = await _dbContext.KhachHang
                .AsNoTracking()
                .Where(x => x.MaND == nguoiDung.MaND)
                .Select(x => x.MaKH)
                .FirstOrDefaultAsync(cancellationToken)
                ?? string.Empty;
        }

        return (new DuLieuDangNhapDto
        {
            AccessToken = _jwtService.TaoAccessToken(nguoiDung),
            MaND = nguoiDung.MaND,
            MaKH = maKh,
            TenND = nguoiDung.TenND,
            Email = nguoiDung.Email,
            VaiTro = nguoiDung.VaiTro,
        }, null);
    }

    public async Task<(DuLieuDangNhapDto? DuLieu, string? Loi)> DangKyKhachHangAsync(DangKyKhachHangDto dto, CancellationToken cancellationToken = default)
    {
        var hoTen = dto.HoTen.Trim();
        var email = dto.Email.Trim().ToLowerInvariant();
        var soDienThoai = dto.SoDienThoai.Trim();

        if (hoTen.Length < 2)
        {
            return (null, "Họ tên phải có ít nhất 2 ký tự.");
        }

        if (string.IsNullOrWhiteSpace(email) || !new EmailAddressAttribute().IsValid(email))
        {
            return (null, "Email không hợp lệ.");
        }

        if (string.IsNullOrWhiteSpace(soDienThoai) || !System.Text.RegularExpressions.Regex.IsMatch(soDienThoai, "^\\d{10}$"))
        {
            return (null, "Số điện thoại phải gồm đúng 10 chữ số.");
        }

        if (string.IsNullOrWhiteSpace(dto.MatKhau) || dto.MatKhau.Length < 8)
        {
            return (null, "Mật khẩu phải có ít nhất 8 ký tự.");
        }

        if (dto.MatKhau != dto.XacNhanMatKhau)
        {
            return (null, "Xác nhận mật khẩu không khớp.");
        }

        if (await _dbContext.NguoiDung.AnyAsync(x => x.Email == email, cancellationToken))
        {
            return (null, "Email đã được sử dụng.");
        }

        if (await _dbContext.KhachHang.AnyAsync(x => x.SDT == soDienThoai, cancellationToken))
        {
            return (null, "Số điện thoại đã được sử dụng.");
        }

        var maNd = SinhMaNgauNhien("ND");
        var maKh = SinhMaNgauNhien("KH");

        var nguoiDung = new NguoiDung
        {
            MaND = maNd,
            TenND = hoTen,
            Email = email,
            MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
            VaiTro = "KhachHang",
            TrangThai = "Active",
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow,
        };

        var khachHang = new KhachHang
        {
            MaKH = maKh,
            MaND = maNd,
            TenKH = hoTen,
            SDT = soDienThoai,
            DiaChi = dto.DiaChi,
            DiemTichLuy = 0,
            NgayTao = DateTime.UtcNow,
        };

        _dbContext.NguoiDung.Add(nguoiDung);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _dbContext.KhachHang.Add(khachHang);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return (new DuLieuDangNhapDto
        {
            AccessToken = _jwtService.TaoAccessToken(nguoiDung),
            MaND = nguoiDung.MaND,
            MaKH = khachHang.MaKH,
            TenND = nguoiDung.TenND,
            Email = nguoiDung.Email,
            VaiTro = nguoiDung.VaiTro,
        }, null);
    }

    public async Task<(DuLieuDangNhapDto? DuLieu, string? Loi)> CapNhatHoSoAsync(string maNd, CapNhatHoSoDto dto, CancellationToken cancellationToken = default)
    {
        var nguoiDung = await _dbContext.NguoiDung.FirstOrDefaultAsync(x => x.MaND == maNd, cancellationToken);
        if (nguoiDung is null)
        {
            return (null, "Không tìm thấy người dùng.");
        }

        var khachHang = await _dbContext.KhachHang.FirstOrDefaultAsync(x => x.MaND == maNd, cancellationToken);
        if (khachHang is null)
        {
            return (null, "Không tìm thấy hồ sơ khách hàng.");
        }

        var hoTen = dto.HoTen.Trim();
        var email = dto.Email.Trim().ToLowerInvariant();
        var soDienThoai = dto.SoDienThoai.Trim();

        if (hoTen.Length < 2)
        {
            return (null, "Họ tên phải có ít nhất 2 ký tự.");
        }

        if (string.IsNullOrWhiteSpace(email) || !new EmailAddressAttribute().IsValid(email))
        {
            return (null, "Email không hợp lệ.");
        }

        if (string.IsNullOrWhiteSpace(soDienThoai) || !System.Text.RegularExpressions.Regex.IsMatch(soDienThoai, "^\\d{10}$"))
        {
            return (null, "Số điện thoại phải gồm đúng 10 chữ số.");
        }

        if (await _dbContext.NguoiDung.AnyAsync(x => x.MaND != maNd && x.Email == email, cancellationToken))
        {
            return (null, "Email đã được sử dụng.");
        }

        if (await _dbContext.KhachHang.AnyAsync(x => x.MaND != maNd && x.SDT == soDienThoai, cancellationToken))
        {
            return (null, "Số điện thoại đã được sử dụng.");
        }

        nguoiDung.TenND = hoTen;
        nguoiDung.Email = email;
        nguoiDung.NgayCapNhat = DateTime.UtcNow;
        khachHang.TenKH = hoTen;
        khachHang.SDT = soDienThoai;
        khachHang.DiaChi = dto.DiaChi?.Trim();

        await _dbContext.SaveChangesAsync(cancellationToken);

        return (new DuLieuDangNhapDto
        {
            MaND = nguoiDung.MaND,
            MaKH = khachHang.MaKH,
            TenND = nguoiDung.TenND,
            Email = nguoiDung.Email,
            VaiTro = nguoiDung.VaiTro,
        }, null);
    }

    public async Task<string?> DoiMatKhauAsync(string maNd, DoiMatKhauDto dto, CancellationToken cancellationToken = default)
    {
        var nguoiDung = await _dbContext.NguoiDung.FirstOrDefaultAsync(x => x.MaND == maNd, cancellationToken);
        if (nguoiDung is null)
        {
            return "Không tìm thấy người dùng.";
        }

        if (!BCrypt.Net.BCrypt.Verify(dto.MatKhauHienTai, nguoiDung.MatKhau))
        {
            return "Mật khẩu hiện tại không đúng.";
        }

        if (string.IsNullOrWhiteSpace(dto.MatKhauMoi) || dto.MatKhauMoi.Length < 8)
        {
            return "Mật khẩu mới phải có ít nhất 8 ký tự.";
        }

        if (dto.MatKhauMoi != dto.XacNhanMatKhauMoi)
        {
            return "Xác nhận mật khẩu mới không khớp.";
        }

        nguoiDung.MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhauMoi);
        nguoiDung.NgayCapNhat = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return null;
    }
}
