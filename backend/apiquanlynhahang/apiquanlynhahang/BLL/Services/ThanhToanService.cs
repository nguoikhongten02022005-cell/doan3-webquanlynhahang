using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class ThanhToanService
{
    private readonly UngDungDbContext _dbContext;

    public ThanhToanService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<ThanhToan>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.ThanhToan.AsNoTracking().OrderByDescending(x => x.ThoiGian).ToListAsync(cancellationToken);

    public async Task<ThanhToan> TaoAsync(TaoThanhToanDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new ThanhToan
        {
            MaThanhToan = dto.MaThanhToan,
            MaHoaDon = dto.MaHoaDon,
            PhuongThuc = dto.PhuongThuc,
            SoTien = dto.SoTien,
            MaGiaoDich = dto.MaGiaoDich,
            TrangThai = "Success",
            ThoiGian = DateTime.UtcNow,
        };

        _dbContext.ThanhToan.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
