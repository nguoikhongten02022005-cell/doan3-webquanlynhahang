using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class DanhGiaService
{
    private readonly UngDungDbContext _dbContext;

    public DanhGiaService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<DanhGia>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.DanhGia.AsNoTracking().OrderByDescending(x => x.NgayDanhGia).ToListAsync(cancellationToken);

    public async Task<DanhGia> TaoAsync(TaoDanhGiaDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new DanhGia
        {
            MaDanhGia = dto.MaDanhGia,
            MaKH = dto.MaKH,
            MaDonHang = dto.MaDonHang,
            SoSao = dto.SoSao,
            NoiDung = dto.NoiDung,
            TrangThai = "Pending",
            NgayDanhGia = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow,
        };

        _dbContext.DanhGia.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<DanhGia?> DuyetAsync(string maDanhGia, string trangThai, string? phanHoi, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.DanhGia.FirstOrDefaultAsync(x => x.MaDanhGia == maDanhGia, cancellationToken);
        if (entity is null) return null;
        entity.TrangThai = trangThai;
        entity.PhanHoi = phanHoi;
        entity.NgayCapNhat = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
