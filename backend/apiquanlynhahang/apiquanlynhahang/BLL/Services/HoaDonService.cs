using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class HoaDonService
{
    private readonly UngDungDbContext _dbContext;

    public HoaDonService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<HoaDon>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.HoaDon.AsNoTracking().OrderByDescending(x => x.NgayXuat).ToListAsync(cancellationToken);

    public Task<HoaDon?> LayTheoMaAsync(string maHoaDon, CancellationToken cancellationToken = default)
        => _dbContext.HoaDon.AsNoTracking().FirstOrDefaultAsync(x => x.MaHoaDon == maHoaDon, cancellationToken);

    public async Task<HoaDon> TaoAsync(TaoHoaDonDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new HoaDon
        {
            MaHoaDon = dto.MaHoaDon,
            MaDonHang = dto.MaDonHang,
            MaKH = dto.MaKH,
            MaCode = dto.MaCode,
            TongTien = dto.TongTien,
            GiamGia = dto.GiamGia,
            ThueSuat = dto.ThueSuat,
            TienThue = dto.TienThue,
            ThanhTien = dto.ThanhTien,
            GhiChu = dto.GhiChu,
            NgayXuat = DateTime.UtcNow,
        };

        _dbContext.HoaDon.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
