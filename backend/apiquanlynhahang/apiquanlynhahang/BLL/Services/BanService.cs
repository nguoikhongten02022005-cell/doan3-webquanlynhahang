using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

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

    public async Task<Ban> TaoAsync(TaoBanDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new Ban
        {
            MaBan = dto.MaBan,
            SoBan = dto.SoBan,
            SoChoNgoi = dto.SoChoNgoi,
            ViTri = dto.ViTri,
            TrangThai = "Available",
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow,
        };

        _dbContext.Ban.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<Ban?> CapNhatTrangThaiAsync(string maBan, string trangThai, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.Ban.FirstOrDefaultAsync(x => x.MaBan == maBan, cancellationToken);
        if (entity is null) return null;
        entity.TrangThai = trangThai;
        entity.NgayCapNhat = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
