using System.Text.Json;
using apiquanlynhahang.Data;
using apiquanlynhahang.Common;
using apiquanlynhahang.DTOs;
using apiquanlynhahang.Models;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Services;

public class DonHangService
{
    private readonly UngDungDbContext _dbContext;
    private readonly MaGiamGiaService _maGiamGiaService;
    private readonly KhoService _khoService;

    public DonHangService(UngDungDbContext dbContext, MaGiamGiaService maGiamGiaService, KhoService khoService)
    {
        _dbContext = dbContext;
        _maGiamGiaService = maGiamGiaService;
        _khoService = khoService;
    }

    public Task<List<DonHang>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.DonHang.AsNoTracking().OrderByDescending(x => x.Id).ToListAsync(cancellationToken);

    public Task<List<DonHang>> LayDonHangCuaToiAsync(string email, CancellationToken cancellationToken = default)
        => _dbContext.DonHang.AsNoTracking().Where(x => x.EmailNguoiDung == email || x.EmailKhachHang == email).OrderByDescending(x => x.Id).ToListAsync(cancellationToken);

    public Task<DonHang?> LayTheoIdAsync(int id, CancellationToken cancellationToken = default)
        => _dbContext.DonHang.AsNoTracking().FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);

    public Task<List<ChiTietDonHang>> LayChiTietAsync(int donHangId, CancellationToken cancellationToken = default)
        => _dbContext.ChiTietDonHang.AsNoTracking().Where(x => x.DonHangId == (uint)donHangId).OrderBy(x => x.Id).ToListAsync(cancellationToken);

    public async Task<(DonHang? DonHang, string? Loi)> TaoAsync(TaoDonHangDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.DanhSachMon.Count == 0)
        {
            return (null, "Don hang phai co it nhat 1 mon");
        }

        if (dto.KhachHang is null || string.IsNullOrWhiteSpace(dto.KhachHang.TenKhachHang) || string.IsNullOrWhiteSpace(dto.KhachHang.SoDienThoaiKhachHang))
        {
            return (null, "Thong tin khach hang khong hop le");
        }

        var danhSachId = dto.DanhSachMon.Where(x => x.MonAnId.HasValue).Select(x => (uint)x.MonAnId!.Value).ToList();
        var monAns = await _dbContext.MonAn.Where(x => danhSachId.Contains(x.Id) && x.DangKinhDoanh).ToListAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(dto.MaBan))
        {
            var banTonTai = await _dbContext.BanAn.AnyAsync(x => x.MaBan == dto.MaBan || x.Id == dto.MaBan, cancellationToken);
            if (!banTonTai)
            {
                return (null, "Ban an khong ton tai");
            }
        }

        decimal tamTinh = 0;
        var chiTiets = new List<ChiTietDonHang>();

        foreach (var item in dto.DanhSachMon)
        {
            var monAn = monAns.FirstOrDefault(x => x.Id == (uint)(item.MonAnId ?? 0));
            if (monAn is null)
            {
                return (null, $"Khong tim thay mon an id {item.MonAnId}");
            }

            var donGia = monAn.Gia;
            tamTinh += donGia * item.SoLuong;

            chiTiets.Add(new ChiTietDonHang
            {
                MonAnId = monAn.Id,
                TenMon = monAn.TenMon,
                DonGia = donGia,
                SoLuong = item.SoLuong,
                KichCo = string.IsNullOrWhiteSpace(item.KichCo) ? "M" : item.KichCo,
                ToppingDaChon = JsonSerializer.Serialize(item.ToppingDaChon),
                GhiChuMon = item.GhiChuMon,
                MaBienThe = string.IsNullOrWhiteSpace(item.MaBienThe) ? $"{monAn.Slug}_{item.KichCo}" : item.MaBienThe,
                ThongTinMon = JsonSerializer.Serialize(new { monAn.TenMon, monAn.Gia, monAn.Slug }),
            });
        }

        decimal tienGiam = 0;
        if (!string.IsNullOrWhiteSpace(dto.MaGiamGiaApDung))
        {
            var (voucher, loi) = await _maGiamGiaService.KiemTraAsync(dto.MaGiamGiaApDung, tamTinh, cancellationToken);
            if (voucher is null)
            {
                return (null, loi);
            }

            tienGiam = voucher.LoaiGiam == "PERCENTAGE"
                ? tamTinh * voucher.GiaTriGiam / 100
                : voucher.GiaTriGiam;

            if (voucher.GiamToiDa.HasValue && tienGiam > voucher.GiamToiDa.Value)
            {
                tienGiam = voucher.GiamToiDa.Value;
            }

            voucher.DaSuDung += 1;
        }

        var donHang = new DonHang
        {
            MaDonHang = $"DH-{DateTime.UtcNow:yyyyMMddHHmmss}",
            TamTinh = tamTinh,
            PhiDichVu = 0,
            TienGiam = tienGiam,
            MaGiamGiaApDung = dto.MaGiamGiaApDung,
            ThanhTien = tamTinh - tienGiam,
            DatLuc = DateTime.UtcNow,
            TrangThai = "MOI_TAO",
            TrangThaiThanhToan = "CHUA_THANH_TOAN",
            GhiChu = dto.GhiChu,
            MaBan = dto.MaBan,
            PhuongThucThanhToan = dto.PhuongThucThanhToan,
            EmailNguoiDung = dto.EmailNguoiDung,
            TenKhachHang = dto.KhachHang.TenKhachHang,
            SoDienThoaiKhachHang = dto.KhachHang.SoDienThoaiKhachHang,
            EmailKhachHang = dto.KhachHang.EmailKhachHang,
            DiaChiKhachHang = dto.KhachHang.DiaChiKhachHang,
            ThongTinKhachHang = JsonSerializer.Serialize(dto.KhachHang),
            NguoiDungId = dto.NguoiDungId,
            TaoLuc = DateTime.UtcNow,
            CapNhatLuc = DateTime.UtcNow,
        };

        _dbContext.DonHang.Add(donHang);
        await _dbContext.SaveChangesAsync(cancellationToken);

        foreach (var chiTiet in chiTiets)
        {
            chiTiet.DonHangId = donHang.Id;
        }

        _dbContext.ChiTietDonHang.AddRange(chiTiets);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return (donHang, null);
    }

    public async Task<DonHang?> CapNhatTrangThaiAsync(int id, string trangThai, CancellationToken cancellationToken = default)
    {
        var donHang = await _dbContext.DonHang.FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);
        if (donHang is null)
        {
            return null;
        }

        if (string.IsNullOrWhiteSpace(trangThai))
        {
            throw new ApiException(400, "Trang thai don hang khong hop le");
        }

        donHang.TrangThai = trangThai;
        donHang.CapNhatLuc = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        if (trangThai == "DA_HOAN_THANH")
        {
            await _khoService.TruKhoTheoDonHangHoanThanhAsync(donHang.Id, cancellationToken);
        }

        return donHang;
    }
}
