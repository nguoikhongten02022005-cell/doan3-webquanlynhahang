using apiquanlynhahang.Models;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Data;

public static class DuLieuPhatTrienKhoiTao
{
    public static async Task DamBaoDuLieuMauAsync(UngDungDbContext dbContext, CancellationToken cancellationToken = default)
    {
        var thoiDiem = DateTime.UtcNow;

        await DamBaoNguoiDungAsync(dbContext, thoiDiem, cancellationToken);
        await DamBaoKhuVucAsync(dbContext, thoiDiem, cancellationToken);
        await DamBaoBanAnAsync(dbContext, thoiDiem, cancellationToken);
        await MonAnKhoiTaoDuLieu.DamBaoDuLieuMauAsync(dbContext, cancellationToken);
        await DamBaoMaGiamGiaAsync(dbContext, thoiDiem, cancellationToken);
    }

    private static async Task DamBaoNguoiDungAsync(UngDungDbContext dbContext, DateTime thoiDiem, CancellationToken cancellationToken)
    {
        var nguoiDungTheoEmail = await dbContext.NguoiDung
            .AsNoTracking()
            .Select(x => x.Email)
            .ToListAsync(cancellationToken);

        var tapEmail = new HashSet<string>(nguoiDungTheoEmail, StringComparer.OrdinalIgnoreCase);
        var matKhauMaHoa = BCrypt.Net.BCrypt.HashPassword("secret123");

        var danhSachCanThem = new List<NguoiDung>();

        if (!tapEmail.Contains("admin@nhahang.local"))
        {
            danhSachCanThem.Add(new NguoiDung
            {
                HoTen = "Admin Local",
                TenDangNhap = "admin.local",
                Email = "admin@nhahang.local",
                MatKhauMaHoa = matKhauMaHoa,
                VaiTro = "admin",
                TrangThai = "ACTIVE",
                SoDienThoai = "0900000001",
                TaoLuc = thoiDiem,
                CapNhatLuc = thoiDiem,
            });
        }

        if (!tapEmail.Contains("staff@nhahang.local"))
        {
            danhSachCanThem.Add(new NguoiDung
            {
                HoTen = "Staff Local",
                TenDangNhap = "staff.local",
                Email = "staff@nhahang.local",
                MatKhauMaHoa = matKhauMaHoa,
                VaiTro = "staff",
                TrangThai = "ACTIVE",
                SoDienThoai = "0900000002",
                TaoLuc = thoiDiem,
                CapNhatLuc = thoiDiem,
            });
        }

        if (!tapEmail.Contains("customer@nhahang.local"))
        {
            danhSachCanThem.Add(new NguoiDung
            {
                HoTen = "Customer Local",
                TenDangNhap = "customer.local",
                Email = "customer@nhahang.local",
                MatKhauMaHoa = matKhauMaHoa,
                VaiTro = "customer",
                TrangThai = "ACTIVE",
                SoDienThoai = "0900000003",
                TaoLuc = thoiDiem,
                CapNhatLuc = thoiDiem,
            });
        }

        if (danhSachCanThem.Count == 0)
        {
            return;
        }

        dbContext.NguoiDung.AddRange(danhSachCanThem);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task DamBaoKhuVucAsync(UngDungDbContext dbContext, DateTime thoiDiem, CancellationToken cancellationToken)
    {
        var khuVucDangCo = await dbContext.KhuVucBan
            .AsNoTracking()
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        var tapId = new HashSet<string>(khuVucDangCo, StringComparer.OrdinalIgnoreCase);
        var danhSachCanThem = new List<KhuVucBan>();

        if (!tapId.Contains("KV-A"))
        {
            danhSachCanThem.Add(new KhuVucBan
            {
                Id = "KV-A",
                TenKhuVuc = "Tang 1 - Khu A",
                MoTa = "Khu vuc test local tang 1",
                TaoLuc = thoiDiem,
                CapNhatLuc = thoiDiem,
            });
        }

        if (!tapId.Contains("KV-B"))
        {
            danhSachCanThem.Add(new KhuVucBan
            {
                Id = "KV-B",
                TenKhuVuc = "Tang 1 - Khu B",
                MoTa = "Khu vuc test local tang 1",
                TaoLuc = thoiDiem,
                CapNhatLuc = thoiDiem,
            });
        }

        if (danhSachCanThem.Count == 0)
        {
            return;
        }

        dbContext.KhuVucBan.AddRange(danhSachCanThem);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task DamBaoBanAnAsync(UngDungDbContext dbContext, DateTime thoiDiem, CancellationToken cancellationToken)
    {
        var banDangCo = await dbContext.BanAn
            .AsNoTracking()
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        var tapId = new HashSet<string>(banDangCo, StringComparer.OrdinalIgnoreCase);
        var danhSachCanThem = new List<BanAn>();

        ThemBanNeuChuaCo(danhSachCanThem, tapId, thoiDiem, "BAN-A1", "BAN01", "QR-BAN01", "TOKEN-BAN01", "Ban 01", "KV-A", 4);
        ThemBanNeuChuaCo(danhSachCanThem, tapId, thoiDiem, "BAN-A2", "BAN02", "QR-BAN02", "TOKEN-BAN02", "Ban 02", "KV-A", 6);
        ThemBanNeuChuaCo(danhSachCanThem, tapId, thoiDiem, "BAN-B1", "BAN03", "QR-BAN03", "TOKEN-BAN03", "Ban 03", "KV-B", 2);
        ThemBanNeuChuaCo(danhSachCanThem, tapId, thoiDiem, "BAN-B2", "BAN04", "QR-BAN04", "TOKEN-BAN04", "Ban 04", "KV-B", 8);

        if (danhSachCanThem.Count == 0)
        {
            return;
        }

        dbContext.BanAn.AddRange(danhSachCanThem);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static void ThemBanNeuChuaCo(List<BanAn> danhSachCanThem, HashSet<string> tapId, DateTime thoiDiem, string id, string maBan, string maQr, string tokenQr, string tenBan, string khuVucId, uint sucChua)
    {
        if (tapId.Contains(id))
        {
            return;
        }

        danhSachCanThem.Add(new BanAn
        {
            Id = id,
            MaBan = maBan,
            MaQr = maQr,
            TokenQr = tokenQr,
            KichHoatQr = true,
            TenBan = tenBan,
            KhuVucId = khuVucId,
            SucChua = sucChua,
            TrangThai = "AVAILABLE",
            DatBanHienTaiId = null,
            MaDatBanHienTai = string.Empty,
            GhiChu = "Du lieu mau local",
            TaoLuc = thoiDiem,
            CapNhatLuc = thoiDiem,
        });
    }

    private static async Task DamBaoMaGiamGiaAsync(UngDungDbContext dbContext, DateTime thoiDiem, CancellationToken cancellationToken)
    {
        var maDangCo = await dbContext.MaGiamGia
            .AsNoTracking()
            .Select(x => x.MaGiam)
            .ToListAsync(cancellationToken);

        var tapMa = new HashSet<string>(maDangCo, StringComparer.OrdinalIgnoreCase);
        if (tapMa.Contains("LOCAL10"))
        {
            return;
        }

        dbContext.MaGiamGia.Add(new MaGiamGia
        {
            MaGiam = "LOCAL10",
            TenMaGiam = "Giam local 10%",
            MoTa = "Ma giam gia phuc vu smoke test local",
            LoaiGiam = "PERCENTAGE",
            GiaTriGiam = 10,
            DonToiThieu = 100000,
            GiamToiDa = 50000,
            BatDauLuc = thoiDiem.AddDays(-1),
            KetThucLuc = thoiDiem.AddYears(1),
            GioiHanSuDung = 100,
            DaSuDung = 0,
            DangHoatDong = true,
            TaoLuc = thoiDiem,
            CapNhatLuc = thoiDiem,
        });

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
