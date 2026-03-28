using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using apiquanlynhahang.DTOs.Responses;
using Microsoft.EntityFrameworkCore;

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

    public Task<NguoiDung?> LayTheoEmailAsync(string email, CancellationToken cancellationToken = default)
        => _dbContext.NguoiDung.AsNoTracking().FirstOrDefaultAsync(x => x.Email == email, cancellationToken);

    public Task<KhachHang?> LayKhachHangTheoMaNDAsync(string maNd, CancellationToken cancellationToken = default)
        => _dbContext.KhachHang.AsNoTracking().FirstOrDefaultAsync(x => x.MaND == maNd, cancellationToken);

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

        return (new DuLieuDangNhapDto
        {
            AccessToken = _jwtService.TaoAccessToken(nguoiDung),
            MaND = nguoiDung.MaND,
            TenND = nguoiDung.TenND,
            Email = nguoiDung.Email,
            VaiTro = nguoiDung.VaiTro,
        }, null);
    }

    public async Task<(DuLieuDangNhapDto? DuLieu, string? Loi)> DangKyKhachHangAsync(DangKyKhachHangDto dto, CancellationToken cancellationToken = default)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        if (await _dbContext.NguoiDung.AnyAsync(x => x.MaND == dto.MaND || x.Email == email, cancellationToken))
        {
            return (null, "Nguoi dung da ton tai");
        }

        if (await _dbContext.KhachHang.AnyAsync(x => x.MaKH == dto.MaKH, cancellationToken))
        {
            return (null, "Khach hang da ton tai");
        }

        var nguoiDung = new NguoiDung
        {
            MaND = dto.MaND,
            TenND = dto.TenND,
            Email = email,
            MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
            VaiTro = "KhachHang",
            TrangThai = "Active",
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow,
        };

        var khachHang = new KhachHang
        {
            MaKH = dto.MaKH,
            MaND = dto.MaND,
            TenKH = dto.TenKH,
            SDT = dto.SDT,
            DiaChi = dto.DiaChi,
            DiemTichLuy = 0,
            NgayTao = DateTime.UtcNow,
        };

        _dbContext.NguoiDung.Add(nguoiDung);
        _dbContext.KhachHang.Add(khachHang);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return (new DuLieuDangNhapDto
        {
            AccessToken = _jwtService.TaoAccessToken(nguoiDung),
            MaND = nguoiDung.MaND,
            TenND = nguoiDung.TenND,
            Email = nguoiDung.Email,
            VaiTro = nguoiDung.VaiTro,
        }, null);
    }
}
