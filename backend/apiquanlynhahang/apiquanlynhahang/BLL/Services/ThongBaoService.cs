using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class ThongBaoService
{
    private readonly UngDungDbContext _dbContext;

    public ThongBaoService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<ThongBao>> LayTheoNguoiDungAsync(string maNd, CancellationToken cancellationToken = default)
        => _dbContext.ThongBao.AsNoTracking().Where(x => x.MaND == maNd).OrderByDescending(x => x.NgayTao).ToListAsync(cancellationToken);

    public async Task<ThongBao> TaoAsync(TaoThongBaoDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new ThongBao
        {
            MaThongBao = dto.MaThongBao,
            MaND = dto.MaND,
            TieuDe = dto.TieuDe,
            NoiDung = dto.NoiDung,
            LoaiThongBao = dto.LoaiThongBao,
            MaThamChieu = dto.MaThamChieu,
            DaDoc = false,
            NgayTao = DateTime.UtcNow,
        };

        _dbContext.ThongBao.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<ThongBao?> DanhDauDaDocAsync(string maThongBao, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.ThongBao.FirstOrDefaultAsync(x => x.MaThongBao == maThongBao, cancellationToken);
        if (entity is null) return null;
        entity.DaDoc = true;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
