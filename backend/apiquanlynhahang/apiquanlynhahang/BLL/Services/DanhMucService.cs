using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class DanhMucService
{
    private readonly UngDungDbContext _dbContext;

    public DanhMucService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<DanhMuc>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.DanhMuc.AsNoTracking().OrderBy(x => x.ThuTu).ToListAsync(cancellationToken);

    public Task<DanhMuc?> LayTheoMaAsync(string maDanhMuc, CancellationToken cancellationToken = default)
        => _dbContext.DanhMuc.AsNoTracking().FirstOrDefaultAsync(x => x.MaDanhMuc == maDanhMuc, cancellationToken);

    public async Task<DanhMuc> TaoAsync(TaoDanhMucDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new DanhMuc
        {
            MaDanhMuc = dto.MaDanhMuc,
            TenDanhMuc = dto.TenDanhMuc,
            MoTa = dto.MoTa,
            ThuTu = dto.ThuTu,
            TrangThai = "Active",
        };

        _dbContext.DanhMuc.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
