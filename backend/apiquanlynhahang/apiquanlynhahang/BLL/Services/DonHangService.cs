using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class DonHangService
{
    private readonly UngDungDbContext _dbContext;

    public DonHangService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<DonHang>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.DonHang.AsNoTracking().OrderByDescending(x => x.NgayTao).ToListAsync(cancellationToken);

    public Task<DonHang?> LayTheoMaAsync(string maDonHang, CancellationToken cancellationToken = default)
        => _dbContext.DonHang.AsNoTracking().FirstOrDefaultAsync(x => x.MaDonHang == maDonHang, cancellationToken);

    public Task<List<ChiTietDonHang>> LayChiTietAsync(string maDonHang, CancellationToken cancellationToken = default)
        => _dbContext.ChiTietDonHang.AsNoTracking().Where(x => x.MaDonHang == maDonHang).OrderBy(x => x.MaChiTiet).ToListAsync(cancellationToken);

    public async Task<DonHang> TaoAsync(TaoDonHangDto dto, CancellationToken cancellationToken = default)
    {
        var maMon = dto.ChiTiet.Select(x => x.MaMon).ToList();
        var monAn = await _dbContext.ThucDon.Where(x => maMon.Contains(x.MaMon)).ToListAsync(cancellationToken);

        decimal tongTien = 0;
        var chiTietMoi = new List<ChiTietDonHang>();

        foreach (var item in dto.ChiTiet)
        {
            var mon = monAn.First(x => x.MaMon == item.MaMon);
            var donGia = item.DonGia ?? mon.Gia;
            var thanhTien = donGia * item.SoLuong;
            tongTien += thanhTien;

            chiTietMoi.Add(new ChiTietDonHang
            {
                MaChiTiet = item.MaChiTiet,
                MaDonHang = dto.MaDonHang,
                MaMon = item.MaMon,
                SoLuong = item.SoLuong,
                DonGia = donGia,
                ThanhTien = thanhTien,
                GhiChu = item.GhiChu,
                TrangThai = "Pending",
                NgayTao = DateTime.UtcNow,
            });
        }

        var donHang = new DonHang
        {
            MaDonHang = dto.MaDonHang,
            MaKH = dto.MaKH,
            MaBan = dto.MaBan,
            MaNV = dto.MaNV,
            MaDatBan = dto.MaDatBan,
            TongTien = tongTien,
            TrangThai = "Pending",
            NguonTao = dto.NguonTao,
            GhiChu = dto.GhiChu,
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow,
        };

        _dbContext.DonHang.Add(donHang);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _dbContext.ChiTietDonHang.AddRange(chiTietMoi);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return donHang;
    }

    public async Task<DonHang?> CapNhatTrangThaiAsync(string maDonHang, string trangThai, string? nguoiThucHien, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.DonHang.FirstOrDefaultAsync(x => x.MaDonHang == maDonHang, cancellationToken);
        if (entity is null) return null;

        var trangThaiCu = entity.TrangThai;
        entity.TrangThai = trangThai;
        entity.NgayCapNhat = DateTime.UtcNow;

        _dbContext.LichSuDonHang.Add(new LichSuDonHang
        {
            MaLichSu = $"LS{Guid.NewGuid():N}"[..16],
            MaDonHang = maDonHang,
            TrangThaiCu = trangThaiCu,
            TrangThaiMoi = trangThai,
            NguoiThucHien = nguoiThucHien,
            ThoiGian = DateTime.UtcNow,
        });

        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
