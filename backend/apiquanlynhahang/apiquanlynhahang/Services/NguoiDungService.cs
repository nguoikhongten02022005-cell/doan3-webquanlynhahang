using apiquanlynhahang.Data;
using apiquanlynhahang.Common;
using apiquanlynhahang.Models;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Services;

public class NguoiDungService
{
    private readonly UngDungDbContext _dbContext;

    public NguoiDungService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<NguoiDung>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.NguoiDung.AsNoTracking().OrderByDescending(x => x.Id).ToListAsync(cancellationToken);

    public Task<NguoiDung?> LayTheoIdAsync(int id, CancellationToken cancellationToken = default)
        => _dbContext.NguoiDung.AsNoTracking().FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);

    public Task<NguoiDung?> LayTheoEmailAsync(string email, CancellationToken cancellationToken = default)
        => _dbContext.NguoiDung.AsNoTracking().FirstOrDefaultAsync(x => x.Email == email, cancellationToken);

    public async Task<NguoiDung?> CapNhatVaiTroAsync(int id, string vaiTro, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.NguoiDung.FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        if (vaiTro != "admin" && vaiTro != "staff" && vaiTro != "customer")
        {
            throw new ApiException(400, "Vai tro khong hop le");
        }

        entity.VaiTro = vaiTro;
        entity.CapNhatLuc = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<NguoiDung?> CapNhatTrangThaiAsync(int id, string trangThai, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.NguoiDung.FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        if (trangThai != "ACTIVE" && trangThai != "INACTIVE")
        {
            throw new ApiException(400, "Trang thai khong hop le");
        }

        entity.TrangThai = trangThai;
        entity.CapNhatLuc = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
