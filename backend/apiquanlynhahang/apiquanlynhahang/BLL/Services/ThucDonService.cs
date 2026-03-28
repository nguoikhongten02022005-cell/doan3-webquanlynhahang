using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class ThucDonService
{
    private readonly UngDungDbContext _dbContext;

    public ThucDonService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<ThucDon>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.ThucDon.AsNoTracking().OrderBy(x => x.TenMon).ToListAsync(cancellationToken);

    public Task<ThucDon?> LayTheoMaAsync(string maMon, CancellationToken cancellationToken = default)
        => _dbContext.ThucDon.AsNoTracking().FirstOrDefaultAsync(x => x.MaMon == maMon, cancellationToken);

    public async Task<ThucDon> TaoAsync(TaoThucDonDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new ThucDon
        {
            MaMon = dto.MaMon,
            MaDanhMuc = dto.MaDanhMuc,
            TenMon = dto.TenMon,
            MoTa = dto.MoTa,
            Gia = dto.Gia,
            HinhAnh = dto.HinhAnh,
            ThoiGianChuanBi = dto.ThoiGianChuanBi,
            TrangThai = "Available",
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow,
        };

        _dbContext.ThucDon.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
