using apiquanlynhahang.Data;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Services;

public class BaoCaoService
{
    private readonly UngDungDbContext _dbContext;

    public BaoCaoService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<object> LayTongQuanAsync(DateTime? tuNgay, DateTime? denNgay, CancellationToken cancellationToken = default)
    {
        var tu = tuNgay ?? DateTime.UtcNow.Date;
        var den = denNgay ?? DateTime.UtcNow;

        var donHangs = await _dbContext.DonHang.AsNoTracking()
            .Where(x => x.DatLuc >= tu && x.DatLuc <= den)
            .ToListAsync(cancellationToken);

        var datBans = await _dbContext.DatBan.AsNoTracking()
            .Where(x => x.TaoLuc >= tu && x.TaoLuc <= den)
            .ToListAsync(cancellationToken);

        var banAns = await _dbContext.BanAn.AsNoTracking().ToListAsync(cancellationToken);
        var voucherDaDung = await _dbContext.MaGiamGia.AsNoTracking().SumAsync(x => (int?)x.DaSuDung, cancellationToken) ?? 0;

        var doanhThu = donHangs
            .Where(x => x.TrangThai == "DA_HOAN_THANH" || x.TrangThaiThanhToan == "DA_THANH_TOAN")
            .Sum(x => x.ThanhTien);

        return new
        {
            DoanhThu = doanhThu,
            TongDonHang = donHangs.Count,
            TongDatBan = datBans.Count,
            VoucherDaDung = voucherDaDung,
            SoBanTrong = banAns.Count(x => x.TrangThai == "AVAILABLE"),
            SoBanGiuCho = banAns.Count(x => x.TrangThai == "HELD"),
            SoBanDangPhucVu = banAns.Count(x => x.TrangThai == "OCCUPIED"),
            SoBanCanDon = banAns.Count(x => x.TrangThai == "DIRTY"),
            SoKhachKhongDen = datBans.Count(x => x.TrangThai == "KHONG_DEN"),
        };
    }

    public async Task<List<object>> LayTopMonBanChayAsync(int top = 5, CancellationToken cancellationToken = default)
    {
        var duLieu = await _dbContext.ChiTietDonHang.AsNoTracking()
            .GroupBy(x => x.TenMon)
            .Select(x => new
            {
                TenMon = x.Key,
                TongSoLuong = x.Sum(v => v.SoLuong),
                TongDoanhThu = x.Sum(v => v.DonGia * v.SoLuong),
            })
            .OrderByDescending(x => x.TongSoLuong)
            .Take(top)
            .ToListAsync(cancellationToken);

        return duLieu.Cast<object>().ToList();
    }

    public async Task<List<object>> LayCanhBaoKhoAsync(CancellationToken cancellationToken = default)
    {
        var duLieu = await _dbContext.NguyenLieu.AsNoTracking()
            .Where(x => x.SoLuongTon <= x.MucCanhBaoToiThieu)
            .OrderBy(x => x.SoLuongTon)
            .Select(x => new
            {
                x.Id,
                x.MaNguyenLieu,
                x.TenNguyenLieu,
                x.DonViTinh,
                x.SoLuongTon,
                x.MucCanhBaoToiThieu,
                x.TrangThai,
            })
            .ToListAsync(cancellationToken);

        return duLieu.Cast<object>().ToList();
    }
}
