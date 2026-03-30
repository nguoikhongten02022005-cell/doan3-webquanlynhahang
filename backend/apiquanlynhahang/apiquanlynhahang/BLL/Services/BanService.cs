using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;
using QRCoder;
using System.ComponentModel.DataAnnotations;

namespace apiquanlynhahang.BLL.Services;

public class BanService
{
    private readonly UngDungDbContext _dbContext;

    public BanService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<Ban>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.Ban.AsNoTracking().OrderBy(x => x.SoBan).ToListAsync(cancellationToken);

    public Task<Ban?> LayTheoMaAsync(string maBan, CancellationToken cancellationToken = default)
        => _dbContext.Ban.AsNoTracking().FirstOrDefaultAsync(x => x.MaBan == maBan, cancellationToken);

    private static int LaySoBanTuTen(string? tenBan, int giaTriMacDinh)
    {
        var chuSo = new string((tenBan ?? string.Empty).Where(char.IsDigit).ToArray());
        return int.TryParse(chuSo, out var ketQua) ? ketQua : giaTriMacDinh;
    }

    public async Task<Ban> TaoAsync(TaoBanDto dto, CancellationToken cancellationToken = default)
    {
        if (await _dbContext.Ban.AnyAsync(x => x.MaBan == dto.MaBan, cancellationToken))
        {
            throw new ValidationException("Ma ban da ton tai");
        }

        var entity = new Ban
        {
            MaBan = dto.MaBan,
            TenBan = dto.TenBan,
            KhuVuc = dto.KhuVuc ?? dto.ViTri,
            SoBan = LaySoBanTuTen(dto.TenBan, dto.SoBan),
            SoChoNgoi = dto.SoChoNgoi,
            ViTri = dto.ViTri ?? dto.KhuVuc,
            GhiChu = dto.GhiChu,
            TrangThai = "Available",
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow,
        };

        _dbContext.Ban.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<Ban?> CapNhatAsync(string maBan, CapNhatBanDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.Ban.FirstOrDefaultAsync(x => x.MaBan == maBan, cancellationToken);
        if (entity is null) return null;

        entity.TenBan = dto.TenBan;
        entity.KhuVuc = dto.KhuVuc;
        entity.SoBan = LaySoBanTuTen(dto.TenBan, entity.SoBan);
        entity.SoChoNgoi = dto.SoChoNgoi;
        entity.ViTri = dto.KhuVuc;
        entity.GhiChu = dto.GhiChu;
        entity.NgayCapNhat = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task XoaAsync(string maBan, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.Ban.FirstOrDefaultAsync(x => x.MaBan == maBan, cancellationToken);
        if (entity is null) return;
        if (!string.Equals(entity.TrangThai, "TRONG", StringComparison.OrdinalIgnoreCase) && !string.Equals(entity.TrangThai, "Available", StringComparison.OrdinalIgnoreCase))
        {
            throw new ValidationException("Bàn đang có khách hoặc chờ thanh toán, không thể xóa.");
        }
        _dbContext.Ban.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<Ban?> CapNhatTrangThaiAsync(string maBan, string trangThai, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.Ban.FirstOrDefaultAsync(x => x.MaBan == maBan, cancellationToken);
        if (entity is null) return null;
        entity.TrangThai = trangThai switch
        {
            "TRONG" => "Available",
            "CO_KHACH" => "Occupied",
            "CHO_THANH_TOAN" => "Reserved",
            _ => trangThai,
        };
        entity.NgayCapNhat = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<object?> TaoQrAsync(string maBan, string baseUrl, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.Ban.AsNoTracking().FirstOrDefaultAsync(x => x.MaBan == maBan, cancellationToken);
        if (entity is null) return null;

        var tenBan = entity.SoBan > 0 ? $"Bàn {entity.SoBan}" : entity.MaBan;
        var duongDan = $"{baseUrl.TrimEnd('/')}/ban/{maBan}";
        using var qrGenerator = new QRCodeGenerator();
        using var qrData = qrGenerator.CreateQrCode(duongDan, QRCodeGenerator.ECCLevel.Q);
        var qrCode = new PngByteQRCode(qrData);
        var qrBytes = qrCode.GetGraphic(12);
        var qrBase64 = $"data:image/png;base64,{Convert.ToBase64String(qrBytes)}";

        return new
        {
            MaBan = entity.MaBan,
            TenBan = entity.TenBan ?? tenBan,
            KhuVuc = entity.KhuVuc ?? entity.ViTri,
            Url = duongDan,
            QrBase64 = qrBase64,
        };
    }
}
