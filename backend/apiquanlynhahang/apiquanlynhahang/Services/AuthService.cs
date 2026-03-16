using apiquanlynhahang.Data;
using apiquanlynhahang.DTOs;
using apiquanlynhahang.Models;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Services;

public class AuthService
{
    private readonly UngDungDbContext _dbContext;
    private readonly JwtService _jwtService;

    public AuthService(UngDungDbContext dbContext, JwtService jwtService)
    {
        _dbContext = dbContext;
        _jwtService = jwtService;
    }

    public async Task<(NguoiDung? NguoiDung, string? Loi)> DangNhapAsync(DangNhapDto dto, string? vaiTroBatBuoc = null, CancellationToken cancellationToken = default)
    {
        var identifier = dto.Identifier.Trim();
        var nguoiDung = await _dbContext.NguoiDung
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Email == identifier || x.TenDangNhap == identifier, cancellationToken);

        if (nguoiDung is null)
        {
            return (null, "Thong tin dang nhap khong dung");
        }

        if (nguoiDung.TrangThai != "ACTIVE")
        {
            return (null, "Tai khoan dang bi khoa hoac tam dung");
        }

        if (!string.IsNullOrWhiteSpace(vaiTroBatBuoc) && nguoiDung.VaiTro != vaiTroBatBuoc && nguoiDung.VaiTro != "admin")
        {
            return (null, "Tai khoan khong co quyen dang nhap noi bo");
        }

        var hopLe = BCrypt.Net.BCrypt.Verify(dto.Password, nguoiDung.MatKhauMaHoa);
        if (!hopLe)
        {
            return (null, "Thong tin dang nhap khong dung");
        }

        return (nguoiDung, null);
    }

    public async Task<(NguoiDung? NguoiDung, string? Loi)> DangKyAsync(DangKyDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.Password.Length < 6)
        {
            return (null, "Mat khau phai co it nhat 6 ky tu");
        }

        var username = dto.Username.Trim();
        var email = dto.Email.Trim().ToLowerInvariant();

        var daTonTai = await _dbContext.NguoiDung.AnyAsync(
            x => x.TenDangNhap == username || x.Email == email,
            cancellationToken);

        if (daTonTai)
        {
            return (null, "Ten dang nhap hoac email da ton tai");
        }

        var nguoiDung = new NguoiDung
        {
            HoTen = dto.FullName.Trim(),
            TenDangNhap = username,
            Email = email,
            MatKhauMaHoa = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            VaiTro = "customer",
            TrangThai = "ACTIVE",
            SoDienThoai = dto.Phone?.Trim(),
            TaoLuc = DateTime.UtcNow,
            CapNhatLuc = DateTime.UtcNow,
        };

        _dbContext.NguoiDung.Add(nguoiDung);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return (nguoiDung, null);
    }

    public Task<NguoiDung?> LayTheoEmailAsync(string email, CancellationToken cancellationToken = default)
        => _dbContext.NguoiDung.AsNoTracking().FirstOrDefaultAsync(x => x.Email == email, cancellationToken);

    public string TaoAccessToken(NguoiDung nguoiDung) => _jwtService.TaoAccessToken(nguoiDung);

    public async Task<(NguoiDung? NguoiDung, string? Loi)> CapNhatHoSoAsync(string email, CapNhatHoSoDto dto, CancellationToken cancellationToken = default)
    {
        var nguoiDung = await _dbContext.NguoiDung.FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
        if (nguoiDung is null)
        {
            return (null, "Khong tim thay nguoi dung");
        }

        if (!string.IsNullOrWhiteSpace(dto.FullName))
        {
            nguoiDung.HoTen = dto.FullName.Trim();
        }

        if (dto.Phone is not null)
        {
            nguoiDung.SoDienThoai = dto.Phone.Trim();
        }

        nguoiDung.CapNhatLuc = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return (nguoiDung, null);
    }
}
