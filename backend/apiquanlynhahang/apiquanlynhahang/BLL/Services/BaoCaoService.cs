using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DTOs.Responses;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class BaoCaoService
{
    private readonly UngDungDbContext _dbContext;

    public BaoCaoService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<BaoCaoTongQuanDto> LayTongQuanAsync(CancellationToken cancellationToken = default)
    {
        return new BaoCaoTongQuanDto
        {
            TongNguoiDung = await _dbContext.NguoiDung.CountAsync(cancellationToken),
            TongNhanVien = await _dbContext.NhanVien.CountAsync(cancellationToken),
            TongKhachHang = await _dbContext.KhachHang.CountAsync(cancellationToken),
            TongBan = await _dbContext.Ban.CountAsync(cancellationToken),
            TongDonHang = await _dbContext.DonHang.CountAsync(cancellationToken),
            TongHoaDon = await _dbContext.HoaDon.CountAsync(cancellationToken),
            DoanhThuThanhCong = await _dbContext.ThanhToan
                .Where(x => x.TrangThai == "Success")
                .SumAsync(x => (decimal?)x.SoTien, cancellationToken) ?? 0m,
        };
    }

    public async Task<List<object>> LayDoanhThuNgayAsync(CancellationToken cancellationToken = default)
    {
        var duLieu = await _dbContext.HoaDon
            .Join(_dbContext.ThanhToan.Where(x => x.TrangThai == "Success"), hd => hd.MaHoaDon, tt => tt.MaHoaDon,
                (hd, tt) => new { hd.NgayXuat, hd.ThanhTien })
            .GroupBy(x => x.NgayXuat.Date)
            .Select(x => new { Ngay = x.Key, SoHoaDon = x.Count(), DoanhThu = x.Sum(v => v.ThanhTien) })
            .ToListAsync(cancellationToken);

        return duLieu.Cast<object>().ToList();
    }

    public async Task<List<object>> LayMonBanChayAsync(CancellationToken cancellationToken = default)
    {
        var duLieu = await _dbContext.ChiTietDonHang
            .Join(_dbContext.ThucDon, ct => ct.MaMon, td => td.MaMon,
                (ct, td) => new { td.MaMon, td.TenMon, ct.SoLuong, ct.ThanhTien })
            .GroupBy(x => new { x.MaMon, x.TenMon })
            .Select(x => new { x.Key.MaMon, x.Key.TenMon, TongSoLuong = x.Sum(v => v.SoLuong), TongDoanhThu = x.Sum(v => v.ThanhTien) })
            .OrderByDescending(x => x.TongSoLuong)
            .ToListAsync(cancellationToken);

        return duLieu.Cast<object>().ToList();
    }

    public async Task<List<object>> LayTinhTrangBanAsync(CancellationToken cancellationToken = default)
    {
        var duLieu = await _dbContext.Ban
            .GroupJoin(_dbContext.DonHang.Where(x => x.TrangThai != "Paid" && x.TrangThai != "Cancelled"),
                b => b.MaBan, d => d.MaBan,
                (b, ds) => new { Ban = b, Don = ds.FirstOrDefault() })
            .Select(x => new
            {
                x.Ban.MaBan,
                x.Ban.SoBan,
                x.Ban.SoChoNgoi,
                x.Ban.ViTri,
                x.Ban.TrangThai,
                MaDonHang = x.Don != null ? x.Don.MaDonHang : null,
                TrangThaiDon = x.Don != null ? x.Don.TrangThai : null,
            })
            .ToListAsync(cancellationToken);

        return duLieu.Cast<object>().ToList();
    }
}
