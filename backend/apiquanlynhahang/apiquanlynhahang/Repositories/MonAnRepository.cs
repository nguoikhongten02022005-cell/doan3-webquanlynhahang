using apiquanlynhahang.Data;
using apiquanlynhahang.Models;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Repositories;

public class MonAnRepository : IMonAnRepository
{
    private readonly UngDungDbContext _dbContext;

    public MonAnRepository(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<MonAn>> LayDanhSachAsync(CancellationToken cancellationToken = default)
    {
        return _dbContext.MonAn
            .AsNoTracking()
            .Where(x => x.DangKinhDoanh)
            .OrderBy(x => x.DanhMuc)
            .ThenBy(x => x.TenMon)
            .ToListAsync(cancellationToken);
    }

    public Task<MonAn?> LayTheoIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return _dbContext.MonAn
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == (uint)id && x.DangKinhDoanh, cancellationToken);
    }
}
