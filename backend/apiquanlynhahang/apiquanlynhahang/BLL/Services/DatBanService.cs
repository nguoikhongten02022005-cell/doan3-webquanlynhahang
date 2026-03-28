using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class DatBanService
{
    private readonly UngDungDbContext _dbContext;

    public DatBanService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<DatBan>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.DatBan.AsNoTracking().OrderByDescending(x => x.NgayTao).ToListAsync(cancellationToken);

    public Task<DatBan?> LayTheoMaAsync(string maDatBan, CancellationToken cancellationToken = default)
        => _dbContext.DatBan.AsNoTracking().FirstOrDefaultAsync(x => x.MaDatBan == maDatBan, cancellationToken);

    public Task<List<DatBan>> LayTheoKhachAsync(string maKh, CancellationToken cancellationToken = default)
        => _dbContext.DatBan.AsNoTracking().Where(x => x.MaKH == maKh).OrderByDescending(x => x.NgayTao).ToListAsync(cancellationToken);

    public async Task<DatBan> TaoAsync(TaoDatBanDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new DatBan
        {
            MaDatBan = dto.MaDatBan,
            MaKH = dto.MaKH,
            MaBan = dto.MaBan,
            MaNV = dto.MaNV,
            NgayDat = dto.NgayDat,
            GioDat = dto.GioDat,
            GioKetThuc = dto.GioKetThuc,
            SoNguoi = dto.SoNguoi,
            GhiChu = dto.GhiChu,
            TrangThai = "Pending",
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow,
        };

        _dbContext.DatBan.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<DatBan?> CapNhatTrangThaiAsync(string maDatBan, string trangThai, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.DatBan.FirstOrDefaultAsync(x => x.MaDatBan == maDatBan, cancellationToken);
        if (entity is null) return null;
        entity.TrangThai = trangThai;
        entity.NgayCapNhat = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
