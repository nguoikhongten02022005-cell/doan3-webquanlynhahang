using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class NguoiDungService
{
    private readonly UngDungDbContext _dbContext;

    public NguoiDungService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<NguoiDung>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.NguoiDung.AsNoTracking().OrderBy(x => x.MaND).ToListAsync(cancellationToken);

    public Task<NguoiDung?> LayTheoMaAsync(string maNd, CancellationToken cancellationToken = default)
        => _dbContext.NguoiDung.AsNoTracking().FirstOrDefaultAsync(x => x.MaND == maNd, cancellationToken);

    public async Task<NguoiDung?> CapNhatVaiTroAsync(string maNd, string vaiTro, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.NguoiDung.FirstOrDefaultAsync(x => x.MaND == maNd, cancellationToken);
        if (entity is null) return null;
        entity.VaiTro = vaiTro;
        entity.NgayCapNhat = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<NguoiDung?> CapNhatTrangThaiAsync(string maNd, string trangThai, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.NguoiDung.FirstOrDefaultAsync(x => x.MaND == maNd, cancellationToken);
        if (entity is null) return null;
        entity.TrangThai = trangThai;
        entity.NgayCapNhat = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
