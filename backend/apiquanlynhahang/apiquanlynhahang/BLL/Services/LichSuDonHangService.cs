using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class LichSuDonHangService
{
    private readonly UngDungDbContext _dbContext;

    public LichSuDonHangService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<LichSuDonHang>> LayTheoDonAsync(string maDonHang, CancellationToken cancellationToken = default)
        => _dbContext.LichSuDonHang.AsNoTracking().Where(x => x.MaDonHang == maDonHang).OrderBy(x => x.ThoiGian).ToListAsync(cancellationToken);
}
