using apiquanlynhahang.Common;
using apiquanlynhahang.Data;
using apiquanlynhahang.DTOs;
using apiquanlynhahang.Models;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Services;

public class KhoService
{
    private readonly UngDungDbContext _dbContext;

    public KhoService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<NguyenLieu>> LayDanhSachNguyenLieuAsync(CancellationToken cancellationToken = default)
        => _dbContext.NguyenLieu.AsNoTracking().OrderBy(x => x.TenNguyenLieu).ToListAsync(cancellationToken);

    public Task<List<NguyenLieu>> LayCanhBaoTonThapAsync(CancellationToken cancellationToken = default)
        => _dbContext.NguyenLieu.AsNoTracking()
            .Where(x => x.SoLuongTon <= x.MucCanhBaoToiThieu)
            .OrderBy(x => x.SoLuongTon)
            .ToListAsync(cancellationToken);

    public Task<NguyenLieu?> LayNguyenLieuTheoIdAsync(int id, CancellationToken cancellationToken = default)
        => _dbContext.NguyenLieu.AsNoTracking().FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);

    public async Task<NguyenLieu> TaoNguyenLieuAsync(TaoNguyenLieuDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.MaNguyenLieu) || string.IsNullOrWhiteSpace(dto.TenNguyenLieu) || string.IsNullOrWhiteSpace(dto.DonViTinh))
        {
            throw new ApiException(400, "Ma nguyen lieu, ten nguyen lieu va don vi tinh la bat buoc");
        }

        var daTonTai = await _dbContext.NguyenLieu.AnyAsync(x => x.MaNguyenLieu == dto.MaNguyenLieu, cancellationToken);
        if (daTonTai)
        {
            throw new ApiException(409, "Ma nguyen lieu da ton tai");
        }

        var nguyenLieu = new NguyenLieu
        {
            MaNguyenLieu = dto.MaNguyenLieu.Trim(),
            TenNguyenLieu = dto.TenNguyenLieu.Trim(),
            DonViTinh = dto.DonViTinh.Trim(),
            SoLuongTon = dto.SoLuongTon,
            MucCanhBaoToiThieu = dto.MucCanhBaoToiThieu,
            TrangThai = TinhTrangThaiNguyenLieu(dto.SoLuongTon, dto.MucCanhBaoToiThieu),
            GhiChu = dto.GhiChu?.Trim() ?? string.Empty,
            TaoLuc = DateTime.UtcNow,
            CapNhatLuc = DateTime.UtcNow,
        };

        _dbContext.NguyenLieu.Add(nguyenLieu);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return nguyenLieu;
    }

    public async Task<NguyenLieu?> CapNhatNguyenLieuAsync(int id, CapNhatNguyenLieuDto dto, CancellationToken cancellationToken = default)
    {
        var nguyenLieu = await _dbContext.NguyenLieu.FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);
        if (nguyenLieu is null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(dto.TenNguyenLieu)) nguyenLieu.TenNguyenLieu = dto.TenNguyenLieu.Trim();
        if (!string.IsNullOrWhiteSpace(dto.DonViTinh)) nguyenLieu.DonViTinh = dto.DonViTinh.Trim();
        if (dto.SoLuongTon.HasValue) nguyenLieu.SoLuongTon = dto.SoLuongTon.Value;
        if (dto.MucCanhBaoToiThieu.HasValue) nguyenLieu.MucCanhBaoToiThieu = dto.MucCanhBaoToiThieu.Value;
        if (dto.GhiChu is not null) nguyenLieu.GhiChu = dto.GhiChu.Trim();

        nguyenLieu.TrangThai = TinhTrangThaiNguyenLieu(nguyenLieu.SoLuongTon, nguyenLieu.MucCanhBaoToiThieu);
        nguyenLieu.CapNhatLuc = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return nguyenLieu;
    }

    public async Task<bool> XoaNguyenLieuAsync(int id, CancellationToken cancellationToken = default)
    {
        var nguyenLieu = await _dbContext.NguyenLieu.FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);
        if (nguyenLieu is null)
        {
            return false;
        }

        var dangDuocDung = await _dbContext.CongThucMonAn.AnyAsync(x => x.NguyenLieuId == nguyenLieu.Id, cancellationToken);
        if (dangDuocDung)
        {
            throw new ApiException(409, "Nguyen lieu dang duoc gan cho cong thuc mon an, khong the xoa");
        }

        _dbContext.NguyenLieu.Remove(nguyenLieu);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public Task<List<PhieuNhapKho>> LayDanhSachPhieuNhapAsync(CancellationToken cancellationToken = default)
        => _dbContext.PhieuNhapKho.AsNoTracking().OrderByDescending(x => x.NgayNhap).ThenByDescending(x => x.Id).ToListAsync(cancellationToken);

    public Task<List<ChiTietNhapKho>> LayChiTietPhieuNhapAsync(int phieuNhapKhoId, CancellationToken cancellationToken = default)
        => _dbContext.ChiTietNhapKho.AsNoTracking().Where(x => x.PhieuNhapKhoId == (uint)phieuNhapKhoId).OrderBy(x => x.Id).ToListAsync(cancellationToken);

    public async Task<PhieuNhapKho> TaoPhieuNhapAsync(TaoPhieuNhapKhoDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.DanhSachNguyenLieu.Count == 0)
        {
            throw new ApiException(400, "Phieu nhap kho phai co it nhat 1 nguyen lieu");
        }

        var danhSachId = dto.DanhSachNguyenLieu.Select(x => (uint)x.NguyenLieuId).Distinct().ToList();
        var danhSachNguyenLieu = await _dbContext.NguyenLieu.Where(x => danhSachId.Contains(x.Id)).ToListAsync(cancellationToken);
        if (danhSachNguyenLieu.Count != danhSachId.Count)
        {
            throw new ApiException(400, "Co nguyen lieu khong ton tai trong phieu nhap");
        }

        var phieuNhap = new PhieuNhapKho
        {
            MaPhieuNhap = $"NK-{DateTime.UtcNow:yyyyMMddHHmmss}",
            NgayNhap = dto.NgayNhap ?? DateTime.UtcNow,
            NhaCungCap = dto.NhaCungCap?.Trim() ?? string.Empty,
            GhiChu = dto.GhiChu?.Trim() ?? string.Empty,
            TongTien = 0,
            NguoiTaoId = dto.NguoiTaoId,
            TaoLuc = DateTime.UtcNow,
            CapNhatLuc = DateTime.UtcNow,
        };

        _dbContext.PhieuNhapKho.Add(phieuNhap);
        await _dbContext.SaveChangesAsync(cancellationToken);

        decimal tongTien = 0;
        var chiTietNhap = new List<ChiTietNhapKho>();
        var bienDongKhos = new List<BienDongKho>();

        foreach (var item in dto.DanhSachNguyenLieu)
        {
            var nguyenLieu = danhSachNguyenLieu.First(x => x.Id == (uint)item.NguyenLieuId);
            var soLuongTruoc = nguyenLieu.SoLuongTon;
            var soLuongSau = nguyenLieu.SoLuongTon + item.SoLuongNhap;
            var thanhTien = item.SoLuongNhap * item.DonGiaNhap;

            chiTietNhap.Add(new ChiTietNhapKho
            {
                PhieuNhapKhoId = phieuNhap.Id,
                NguyenLieuId = nguyenLieu.Id,
                SoLuongNhap = item.SoLuongNhap,
                DonGiaNhap = item.DonGiaNhap,
                ThanhTien = thanhTien,
                GhiChu = item.GhiChu?.Trim() ?? string.Empty,
            });

            bienDongKhos.Add(new BienDongKho
            {
                NguyenLieuId = nguyenLieu.Id,
                LoaiBienDong = "NHAP_KHO",
                SoLuongThayDoi = item.SoLuongNhap,
                SoLuongTruoc = soLuongTruoc,
                SoLuongSau = soLuongSau,
                ThamChieuLoai = "PHIEU_NHAP_KHO",
                ThamChieuId = phieuNhap.Id,
                GhiChu = string.IsNullOrWhiteSpace(item.GhiChu) ? $"Nhap kho {phieuNhap.MaPhieuNhap}" : item.GhiChu.Trim(),
                TaoLuc = DateTime.UtcNow,
            });

            nguyenLieu.SoLuongTon = soLuongSau;
            nguyenLieu.TrangThai = TinhTrangThaiNguyenLieu(nguyenLieu.SoLuongTon, nguyenLieu.MucCanhBaoToiThieu);
            nguyenLieu.CapNhatLuc = DateTime.UtcNow;
            tongTien += thanhTien;
        }

        phieuNhap.TongTien = tongTien;
        phieuNhap.CapNhatLuc = DateTime.UtcNow;

        _dbContext.ChiTietNhapKho.AddRange(chiTietNhap);
        _dbContext.BienDongKho.AddRange(bienDongKhos);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return phieuNhap;
    }

    public Task<List<CongThucMonAn>> LayCongThucTheoMonAsync(int monAnId, CancellationToken cancellationToken = default)
        => _dbContext.CongThucMonAn.AsNoTracking().Where(x => x.MonAnId == (uint)monAnId).OrderBy(x => x.Id).ToListAsync(cancellationToken);

    public async Task<CongThucMonAn> TaoCongThucAsync(TaoCongThucMonAnDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.DinhLuong <= 0 || string.IsNullOrWhiteSpace(dto.DonViTinh))
        {
            throw new ApiException(400, "Dinh luong va don vi tinh phai hop le");
        }

        var monTonTai = await _dbContext.MonAn.AnyAsync(x => x.Id == (uint)dto.MonAnId, cancellationToken);
        var nguyenLieuTonTai = await _dbContext.NguyenLieu.AnyAsync(x => x.Id == (uint)dto.NguyenLieuId, cancellationToken);
        if (!monTonTai || !nguyenLieuTonTai)
        {
            throw new ApiException(400, "Mon an hoac nguyen lieu khong ton tai");
        }

        var daTonTai = await _dbContext.CongThucMonAn.AnyAsync(x => x.MonAnId == (uint)dto.MonAnId && x.NguyenLieuId == (uint)dto.NguyenLieuId, cancellationToken);
        if (daTonTai)
        {
            throw new ApiException(409, "Cong thuc mon an da ton tai voi nguyen lieu nay");
        }

        var congThuc = new CongThucMonAn
        {
            MonAnId = (uint)dto.MonAnId,
            NguyenLieuId = (uint)dto.NguyenLieuId,
            DinhLuong = dto.DinhLuong,
            DonViTinh = dto.DonViTinh.Trim(),
            GhiChu = dto.GhiChu?.Trim() ?? string.Empty,
            TaoLuc = DateTime.UtcNow,
            CapNhatLuc = DateTime.UtcNow,
        };

        _dbContext.CongThucMonAn.Add(congThuc);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return congThuc;
    }

    public async Task<CongThucMonAn?> CapNhatCongThucAsync(int id, CapNhatCongThucMonAnDto dto, CancellationToken cancellationToken = default)
    {
        var congThuc = await _dbContext.CongThucMonAn.FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);
        if (congThuc is null)
        {
            return null;
        }

        if (dto.DinhLuong.HasValue) congThuc.DinhLuong = dto.DinhLuong.Value;
        if (!string.IsNullOrWhiteSpace(dto.DonViTinh)) congThuc.DonViTinh = dto.DonViTinh.Trim();
        if (dto.GhiChu is not null) congThuc.GhiChu = dto.GhiChu.Trim();
        congThuc.CapNhatLuc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return congThuc;
    }

    public async Task<bool> XoaCongThucAsync(int id, CancellationToken cancellationToken = default)
    {
        var congThuc = await _dbContext.CongThucMonAn.FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);
        if (congThuc is null)
        {
            return false;
        }

        _dbContext.CongThucMonAn.Remove(congThuc);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task TruKhoTheoDonHangHoanThanhAsync(uint donHangId, CancellationToken cancellationToken = default)
    {
        var chiTietDonHang = await _dbContext.ChiTietDonHang.Where(x => x.DonHangId == donHangId && x.MonAnId.HasValue).ToListAsync(cancellationToken);
        if (chiTietDonHang.Count == 0)
        {
            return;
        }

        var daTruKho = await _dbContext.BienDongKho.AnyAsync(x => x.ThamChieuLoai == "DON_HANG" && x.ThamChieuId == donHangId, cancellationToken);
        if (daTruKho)
        {
            return;
        }

        var danhSachMon = chiTietDonHang.Select(x => x.MonAnId!.Value).Distinct().ToList();
        var congThuc = await _dbContext.CongThucMonAn.Where(x => danhSachMon.Contains(x.MonAnId)).ToListAsync(cancellationToken);
        if (congThuc.Count == 0)
        {
            return;
        }

        var tongCanTru = new Dictionary<uint, decimal>();
        foreach (var chiTiet in chiTietDonHang)
        {
            var congThucMon = congThuc.Where(x => x.MonAnId == chiTiet.MonAnId!.Value).ToList();
            foreach (var muc in congThucMon)
            {
                if (!tongCanTru.ContainsKey(muc.NguyenLieuId))
                {
                    tongCanTru[muc.NguyenLieuId] = 0;
                }

                tongCanTru[muc.NguyenLieuId] += muc.DinhLuong * chiTiet.SoLuong;
            }
        }

        var danhSachNguyenLieu = await _dbContext.NguyenLieu.Where(x => tongCanTru.Keys.Contains(x.Id)).ToListAsync(cancellationToken);
        var bienDong = new List<BienDongKho>();

        foreach (var nguyenLieu in danhSachNguyenLieu)
        {
            var soLuongCanTru = tongCanTru[nguyenLieu.Id];
            if (nguyenLieu.SoLuongTon < soLuongCanTru)
            {
                throw new ApiException(409, $"Nguyen lieu {nguyenLieu.TenNguyenLieu} khong du ton kho de hoan thanh don hang");
            }

            var soLuongTruoc = nguyenLieu.SoLuongTon;
            var soLuongSau = nguyenLieu.SoLuongTon - soLuongCanTru;
            nguyenLieu.SoLuongTon = soLuongSau;
            nguyenLieu.TrangThai = TinhTrangThaiNguyenLieu(soLuongSau, nguyenLieu.MucCanhBaoToiThieu);
            nguyenLieu.CapNhatLuc = DateTime.UtcNow;

            bienDong.Add(new BienDongKho
            {
                NguyenLieuId = nguyenLieu.Id,
                LoaiBienDong = "TRU_KHO_DON_HANG",
                SoLuongThayDoi = -soLuongCanTru,
                SoLuongTruoc = soLuongTruoc,
                SoLuongSau = soLuongSau,
                ThamChieuLoai = "DON_HANG",
                ThamChieuId = donHangId,
                GhiChu = $"Tru kho cho don hang {donHangId}",
                TaoLuc = DateTime.UtcNow,
            });
        }

        _dbContext.BienDongKho.AddRange(bienDong);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static string TinhTrangThaiNguyenLieu(decimal soLuongTon, decimal mucCanhBao)
    {
        if (soLuongTon <= 0) return "HET_HANG";
        if (soLuongTon <= mucCanhBao) return "SAP_HET";
        return "CON_HANG";
    }
}
