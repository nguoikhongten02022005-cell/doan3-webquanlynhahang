using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace apiquanlynhahang.BLL.Services;

public class DonHangService
{
    private readonly UngDungDbContext _dbContext;

    public DonHangService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    private async Task DongBoTrangThaiBanVaBookingAsync(string maBan, string trangThaiBan, string? trangThaiDatBan, CancellationToken cancellationToken)
    {
        var ban = await _dbContext.Ban.FirstOrDefaultAsync(x => x.MaBan == maBan, cancellationToken);
        if (ban is not null)
        {
            ban.TrangThai = trangThaiBan;
            ban.NgayCapNhat = DateTime.UtcNow;
        }

        var datBanGanNhat = await _dbContext.DatBan
            .Where(x => x.MaBan == maBan && x.TrangThai != "Cancelled" && x.TrangThai != "Completed" && x.TrangThai != "NoShow")
            .OrderByDescending(x => x.NgayTao)
            .FirstOrDefaultAsync(cancellationToken);

        if (datBanGanNhat is not null && !string.IsNullOrWhiteSpace(trangThaiDatBan))
        {
            datBanGanNhat.TrangThai = trangThaiDatBan;
            datBanGanNhat.NgayCapNhat = DateTime.UtcNow;
        }
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
            LoaiDon = "TAI_QUAN",
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

        if (string.Equals(dto.NguonTao, "Online", StringComparison.OrdinalIgnoreCase))
        {
            var maHoaDon = $"HD_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            var hoaDon = new HoaDon
            {
                MaHoaDon = maHoaDon,
                MaDonHang = donHang.MaDonHang,
                MaKH = donHang.MaKH,
                MaCode = null,
                TongTien = tongTien,
                GiamGia = 0,
                ThueSuat = 0,
                TienThue = 0,
                ThanhTien = tongTien,
                GhiChu = donHang.GhiChu,
                NgayXuat = DateTime.UtcNow,
            };

            _dbContext.HoaDon.Add(hoaDon);

            var thanhToan = new ThanhToan
            {
                MaThanhToan = $"TT_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}_{Random.Shared.Next(100, 999)}",
                MaHoaDon = maHoaDon,
                PhuongThuc = "TienMat",
                SoTien = tongTien,
                MaGiaoDich = $"GD_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
                TrangThai = "Success",
                ThoiGian = DateTime.UtcNow,
            };

            _dbContext.ThanhToan.Add(thanhToan);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return donHang;
    }

    public async Task<DonHang> TaoDonMangVeAsync(TaoDonMangVeDto dto, CancellationToken cancellationToken = default)
    {
        var laDonGiaoHang = string.Equals(dto.LoaiDon, "MANG_VE_GIAO_HANG", StringComparison.OrdinalIgnoreCase);
        if (laDonGiaoHang && string.IsNullOrWhiteSpace(dto.DiaChiGiao))
        {
            throw new ValidationException("Đơn giao hàng bắt buộc phải có địa chỉ giao.");
        }

        var maMon = dto.DanhSachMon.Select(x => x.MaMon).ToList();
        var monAn = await _dbContext.ThucDon.Where(x => maMon.Contains(x.MaMon)).ToListAsync(cancellationToken);

        decimal tongTien = 0;
        var maDonHang = $"DHMV_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        var chiTietMoi = new List<ChiTietDonHang>();

        foreach (var item in dto.DanhSachMon)
        {
            var mon = monAn.First(x => x.MaMon == item.MaMon);
            var donGia = item.DonGia ?? mon.Gia;
            var thanhTien = donGia * item.SoLuong;
            tongTien += thanhTien;

            chiTietMoi.Add(new ChiTietDonHang
            {
                MaChiTiet = string.IsNullOrWhiteSpace(item.MaChiTiet) ? $"CTMV_{Guid.NewGuid():N}"[..18] : item.MaChiTiet,
                MaDonHang = maDonHang,
                MaMon = item.MaMon,
                SoLuong = item.SoLuong,
                DonGia = donGia,
                ThanhTien = thanhTien,
                GhiChu = item.GhiChu,
                TrangThai = "Pending",
                NgayTao = DateTime.UtcNow,
            });
        }

        decimal phiDichVu = tongTien > 0 ? Math.Ceiling(tongTien * 0.05m / 1000) * 1000 : 0;
        decimal phiShip = laDonGiaoHang ? 30000 : 0;
        var maGiamGia = string.IsNullOrWhiteSpace(dto.MaGiamGia) ? null : dto.MaGiamGia.Trim().ToUpperInvariant();

        var donHang = new DonHang
        {
            MaDonHang = maDonHang,
            MaKH = dto.MaKH,
            LoaiDon = laDonGiaoHang ? "MANG_VE_GIAO_HANG" : "MANG_VE_PICKUP",
            DiaChiGiao = laDonGiaoHang ? dto.DiaChiGiao?.Trim() : null,
            PhiShip = phiShip,
            TongTien = tongTien + phiDichVu + phiShip,
            TrangThai = "Pending",
            NguonTao = "Online",
            GhiChu = string.Join(" | ", new[]
            {
                laDonGiaoHang ? $"Gio giao: {dto.GioGiao}" : $"Gio lay: {dto.GioLayHang}",
                dto.GhiChu?.Trim(),
                maGiamGia is null ? null : $"Ma giam gia: {maGiamGia}",
                dto.HoTen is null ? null : $"Nguoi nhan: {dto.HoTen.Trim()}",
                dto.SoDienThoai is null ? null : $"SDT: {dto.SoDienThoai.Trim()}",
                laDonGiaoHang ? $"Dia chi giao: {dto.DiaChiGiao?.Trim()}" : null
            }.Where(x => !string.IsNullOrWhiteSpace(x))),
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow,
        };

        _dbContext.DonHang.Add(donHang);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _dbContext.ChiTietDonHang.AddRange(chiTietMoi);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return donHang;
    }

    public async Task<object?> LayChiTietDonMangVeAsync(string maDonHang, string? maKh, CancellationToken cancellationToken = default)
    {
        var donHang = await _dbContext.DonHang.AsNoTracking().FirstOrDefaultAsync(x => x.MaDonHang == maDonHang && (x.LoaiDon == "MANG_VE_PICKUP" || x.LoaiDon == "MANG_VE_GIAO_HANG"), cancellationToken);
        if (donHang is null) return null;
        if (!string.IsNullOrWhiteSpace(maKh) && !string.Equals(donHang.MaKH, maKh, StringComparison.OrdinalIgnoreCase)) return null;

        var chiTiet = await LayChiTietAsync(maDonHang, cancellationToken);
        return new
        {
            DonHang = donHang,
            ChiTiet = chiTiet,
        };
    }

    private static Dictionary<string, string> TachThongTinMangVe(string? ghiChu)
    {
        var ketQua = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        if (string.IsNullOrWhiteSpace(ghiChu)) return ketQua;

        foreach (var dong in ghiChu.Split("|", StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries))
        {
            var viTri = dong.IndexOf(':');
            if (viTri <= 0) continue;
            ketQua[dong[..viTri].Trim()] = dong[(viTri + 1)..].Trim();
        }

        return ketQua;
    }

    public async Task<List<object>> LayDanhSachDonMangVeChoAdminAsync(CancellationToken cancellationToken = default)
    {
        var donMangVe = await _dbContext.DonHang
            .AsNoTracking()
            .Where(x => x.LoaiDon == "MANG_VE_PICKUP" || x.LoaiDon == "MANG_VE_GIAO_HANG")
            .OrderByDescending(x => x.NgayTao)
            .ToListAsync(cancellationToken);

        var maDon = donMangVe.Select(x => x.MaDonHang).ToList();
        var chiTiet = await _dbContext.ChiTietDonHang
            .AsNoTracking()
            .Where(x => maDon.Contains(x.MaDonHang))
            .ToListAsync(cancellationToken);

        var maMon = chiTiet.Select(x => x.MaMon).Distinct().ToList();
        var tenMonLookup = await _dbContext.ThucDon
            .AsNoTracking()
            .Where(x => maMon.Contains(x.MaMon))
            .ToDictionaryAsync(x => x.MaMon, x => x.TenMon, cancellationToken);

        return donMangVe.Select(don =>
        {
            var thongTin = TachThongTinMangVe(don.GhiChu);
            var danhSachMon = chiTiet
                .Where(x => x.MaDonHang == don.MaDonHang)
                .Select(x => new
                {
                    x.MaMon,
                    TenMon = tenMonLookup.TryGetValue(x.MaMon, out var tenMon) ? tenMon : x.MaMon,
                    x.SoLuong,
                    x.ThanhTien,
                })
                .ToList();

            return (object)new
            {
                don.MaDonHang,
                don.MaKH,
                don.LoaiDon,
                HoTen = thongTin.TryGetValue("Nguoi nhan", out var hoTen) ? hoTen : string.Empty,
                SoDienThoai = thongTin.TryGetValue("SDT", out var soDienThoai) ? soDienThoai : string.Empty,
                GioLayHang = thongTin.TryGetValue("Gio lay", out var gioLayHang) ? gioLayHang : string.Empty,
                GioGiao = thongTin.TryGetValue("Gio giao", out var gioGiao) ? gioGiao : string.Empty,
                DiaChiGiao = don.DiaChiGiao ?? (thongTin.TryGetValue("Dia chi giao", out var diaChiGiao) ? diaChiGiao : string.Empty),
                don.PhiShip,
                don.TongTien,
                don.TrangThai,
                don.NgayTao,
                DanhSachMon = danhSachMon,
            };
        }).ToList();
    }

    public async Task<List<object>> LayLichSuDonMangVeAsync(string maKh, CancellationToken cancellationToken = default)
    {
        var donMangVe = await _dbContext.DonHang
            .AsNoTracking()
            .Where(x => x.MaKH == maKh && (x.LoaiDon == "MANG_VE_PICKUP" || x.LoaiDon == "MANG_VE_GIAO_HANG"))
            .OrderByDescending(x => x.NgayTao)
            .ToListAsync(cancellationToken);

        var maDon = donMangVe.Select(x => x.MaDonHang).ToList();
        var chiTiet = await _dbContext.ChiTietDonHang
            .AsNoTracking()
            .Where(x => maDon.Contains(x.MaDonHang))
            .ToListAsync(cancellationToken);

        var maMon = chiTiet.Select(x => x.MaMon).Distinct().ToList();
        var tenMonLookup = await _dbContext.ThucDon
            .AsNoTracking()
            .Where(x => maMon.Contains(x.MaMon))
            .ToDictionaryAsync(x => x.MaMon, x => x.TenMon, cancellationToken);

        return donMangVe.Select(don =>
        {
            var thongTin = TachThongTinMangVe(don.GhiChu);
            var danhSachMon = chiTiet
                .Where(x => x.MaDonHang == don.MaDonHang)
                .Select(x => new
                {
                    x.MaMon,
                    TenMon = tenMonLookup.TryGetValue(x.MaMon, out var tenMon) ? tenMon : x.MaMon,
                    x.SoLuong,
                    x.DonGia,
                    x.ThanhTien,
                })
                .ToList();

            return (object)new
            {
                don.MaDonHang,
                don.LoaiDon,
                don.TrangThai,
                don.TongTien,
                don.PhiShip,
                don.DiaChiGiao,
                GioLayHang = thongTin.TryGetValue("Gio lay", out var gioLayHang) ? gioLayHang : string.Empty,
                GioGiao = thongTin.TryGetValue("Gio giao", out var gioGiao) ? gioGiao : string.Empty,
                don.NgayTao,
                DanhSachMon = danhSachMon,
            };
        }).ToList();
    }

    public async Task<DonHang?> HuyDonMangVeAsync(string maDonHang, string maKh, CancellationToken cancellationToken = default)
    {
        var donHang = await _dbContext.DonHang.FirstOrDefaultAsync(x => x.MaDonHang == maDonHang && x.MaKH == maKh && (x.LoaiDon == "MANG_VE_PICKUP" || x.LoaiDon == "MANG_VE_GIAO_HANG"), cancellationToken);
        if (donHang is null) return null;
        if (!string.Equals(donHang.TrangThai, "Pending", StringComparison.OrdinalIgnoreCase))
        {
            throw new ValidationException("Chỉ có thể hủy đơn khi đang ở trạng thái chờ xác nhận.");
        }

        donHang.TrangThai = "Cancelled";
        donHang.NgayCapNhat = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return donHang;
    }

    public async Task<List<ThucDon>> LayThucDonChoBanAsync(CancellationToken cancellationToken = default)
        => await _dbContext.ThucDon.AsNoTracking().Where(x => x.TrangThai == "Available").OrderBy(x => x.TenMon).ToListAsync(cancellationToken);

    public async Task<object?> LayDonTaiBanDangMoAsync(string maBan, CancellationToken cancellationToken = default)
    {
        if (!await _dbContext.Ban.AnyAsync(x => x.MaBan == maBan, cancellationToken))
        {
            return null;
        }

        var donHang = await _dbContext.DonHang.AsNoTracking().FirstOrDefaultAsync(x => x.MaBanAn == maBan && x.LoaiDon == "TAI_BAN" && (x.TrangThai == "Pending" || x.TrangThai == "Confirmed"), cancellationToken);
        if (donHang is null) return null;

        var chiTiet = await LayChiTietAsync(donHang.MaDonHang, cancellationToken);
        var maMon = chiTiet.Select(x => x.MaMon).Distinct().ToList();
        var tenMonLookup = await _dbContext.ThucDon
            .AsNoTracking()
            .Where(x => maMon.Contains(x.MaMon))
            .ToDictionaryAsync(x => x.MaMon, x => x.TenMon, cancellationToken);

        var chiTietMoRong = chiTiet.Select(x => new
        {
            x.MaMon,
            TenMon = tenMonLookup.TryGetValue(x.MaMon, out var tenMon) ? tenMon : x.MaMon,
            x.SoLuong,
            x.DonGia,
            x.ThanhTien,
        }).ToList();

        return new { DonHang = donHang, ChiTiet = chiTietMoRong };
    }

    public async Task<object> TaoHoacThemMonTaiBanAsync(string maBan, TaoOrderTaiBanDto dto, CancellationToken cancellationToken = default)
    {
        var ban = await _dbContext.Ban.FirstOrDefaultAsync(x => x.MaBan == maBan, cancellationToken);
        if (ban is null) throw new ValidationException("Bàn không tồn tại.");

        var monHopLe = await _dbContext.ThucDon.Where(x => dto.DanhSachMon.Select(m => m.MaMon).Contains(x.MaMon)).ToListAsync(cancellationToken);
        var donDangMo = await _dbContext.DonHang.FirstOrDefaultAsync(x => x.MaBanAn == maBan && x.LoaiDon == "TAI_BAN" && (x.TrangThai == "Pending" || x.TrangThai == "Confirmed"), cancellationToken);

        if (donDangMo is null)
        {
            donDangMo = new DonHang
            {
                MaDonHang = $"DHBAN_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
                MaBanAn = maBan,
                MaBan = maBan,
                LoaiDon = "TAI_BAN",
                TongTien = 0,
                TrangThai = "Pending",
                NguonTao = "TaiQuay",
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow,
            };
            _dbContext.DonHang.Add(donDangMo);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        foreach (var item in dto.DanhSachMon)
        {
            var mon = monHopLe.First(x => x.MaMon == item.MaMon);
            var donGia = item.DonGia ?? mon.Gia;
            var chiTietCu = await _dbContext.ChiTietDonHang.FirstOrDefaultAsync(x => x.MaDonHang == donDangMo.MaDonHang && x.MaMon == item.MaMon, cancellationToken);
            if (chiTietCu is null)
            {
                _dbContext.ChiTietDonHang.Add(new ChiTietDonHang
                {
                    MaChiTiet = string.IsNullOrWhiteSpace(item.MaChiTiet) ? $"CTBAN_{Guid.NewGuid():N}"[..18] : item.MaChiTiet,
                    MaDonHang = donDangMo.MaDonHang,
                    MaMon = item.MaMon,
                    SoLuong = item.SoLuong,
                    DonGia = donGia,
                    ThanhTien = donGia * item.SoLuong,
                    GhiChu = item.GhiChu,
                    TrangThai = "Pending",
                    NgayTao = DateTime.UtcNow,
                });
            }
            else
            {
                chiTietCu.SoLuong += item.SoLuong;
                chiTietCu.ThanhTien = chiTietCu.DonGia * chiTietCu.SoLuong;
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        var tongTien = await _dbContext.ChiTietDonHang.Where(x => x.MaDonHang == donDangMo.MaDonHang).SumAsync(x => x.ThanhTien, cancellationToken);
        donDangMo.TongTien = tongTien;
        donDangMo.NgayCapNhat = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        var chiTietMoi = await LayChiTietAsync(donDangMo.MaDonHang, cancellationToken);
        await DongBoTrangThaiBanVaBookingAsync(maBan, "Occupied", "DA_CHECK_IN", cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new { DonHang = donDangMo, ChiTiet = chiTietMoi };
    }

    public async Task<bool> YeuCauThanhToanTaiBanAsync(string maBan, CancellationToken cancellationToken = default)
    {
        var ban = await _dbContext.Ban.FirstOrDefaultAsync(x => x.MaBan == maBan, cancellationToken);
        if (ban is null) return false;

        var donHang = await _dbContext.DonHang.FirstOrDefaultAsync(x => x.MaBanAn == maBan && x.LoaiDon == "TAI_BAN" && (x.TrangThai == "Pending" || x.TrangThai == "Confirmed"), cancellationToken);
        if (donHang is null) return false;

        donHang.TrangThai = "Confirmed";
        donHang.NgayCapNhat = DateTime.UtcNow;
        await DongBoTrangThaiBanVaBookingAsync(maBan, "Reserved", "Confirmed", cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> XacNhanThanhToanTaiBanAsync(string maBan, CancellationToken cancellationToken = default)
    {
        var ban = await _dbContext.Ban.FirstOrDefaultAsync(x => x.MaBan == maBan, cancellationToken);
        if (ban is null) return false;

        var donHang = await _dbContext.DonHang.FirstOrDefaultAsync(x => x.MaBanAn == maBan && x.LoaiDon == "TAI_BAN" && (x.TrangThai == "Pending" || x.TrangThai == "Confirmed"), cancellationToken);
        if (donHang is null) return false;

        donHang.TrangThai = "Paid";
        donHang.NgayCapNhat = DateTime.UtcNow;
        await DongBoTrangThaiBanVaBookingAsync(maBan, "Available", "Completed", cancellationToken);

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<DonHang?> CapNhatTrangThaiDonMangVeAsync(string maDonHang, string trangThai, CancellationToken cancellationToken = default)
    {
        var donHang = await _dbContext.DonHang.FirstOrDefaultAsync(x => x.MaDonHang == maDonHang && (x.LoaiDon == "MANG_VE_PICKUP" || x.LoaiDon == "MANG_VE_GIAO_HANG"), cancellationToken);
        if (donHang is null) return null;

        var chuyenTrangThaiHopLe = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase)
        {
            ["Pending"] = ["Confirmed", "Cancelled"],
            ["Confirmed"] = ["Preparing"],
            ["Preparing"] = [donHang.LoaiDon == "MANG_VE_GIAO_HANG" ? "Served" : "Ready"],
            ["Ready"] = ["Paid"],
            ["Served"] = ["Paid"],
            ["Paid"] = [],
            ["Cancelled"] = [],
        };

        if (!chuyenTrangThaiHopLe.TryGetValue(donHang.TrangThai, out var trangThaiHopLe) || !trangThaiHopLe.Contains(trangThai, StringComparer.OrdinalIgnoreCase))
        {
            throw new ValidationException($"Không thể chuyển trạng thái từ {donHang.TrangThai} sang {trangThai}.");
        }

        donHang.TrangThai = trangThai;
        donHang.NgayCapNhat = DateTime.UtcNow;
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
