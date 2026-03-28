using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class KhachHangService
{
    private readonly UngDungDbContext _dbContext;

    public KhachHangService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<KhachHang>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.KhachHang.AsNoTracking().OrderBy(x => x.MaKH).ToListAsync(cancellationToken);

    public Task<KhachHang?> LayTheoMaAsync(string maKh, CancellationToken cancellationToken = default)
        => _dbContext.KhachHang.AsNoTracking().FirstOrDefaultAsync(x => x.MaKH == maKh, cancellationToken);

    public async Task<KhachHang> TaoAsync(TaoKhachHangDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new KhachHang
        {
            MaKH = dto.MaKH,
            MaND = dto.MaND,
            TenKH = dto.TenKH,
            SDT = dto.SDT,
            DiaChi = dto.DiaChi,
            DiemTichLuy = 0,
            NgayTao = DateTime.UtcNow,
        };

        _dbContext.KhachHang.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
