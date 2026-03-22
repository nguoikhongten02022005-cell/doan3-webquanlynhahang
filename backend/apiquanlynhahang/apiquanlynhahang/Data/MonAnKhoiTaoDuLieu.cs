using apiquanlynhahang.Models;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Data;

public static class MonAnKhoiTaoDuLieu
{
    private sealed record MonAnMau(
        string TenMon,
        string Slug,
        string MoTa,
        decimal Gia,
        string DanhMuc,
        string NhanMon,
        string ToneMau,
        string HinhAnh);

    private static readonly IReadOnlyList<MonAnMau> DanhSachMonMau =
    [
        new("Bo bit tet Uc", "bo-bit-tet-uc", "Thit bo Uc cao cap nuong chin vua, kem khoai tay nghien", 385000m, "Mon Chinh", "Best Seller", "tone-red", "/images/thuc-don/bo-bit-tet-uc.jpg"),
        new("Ca hoi nuong teriyaki", "ca-hoi-nuong-teriyaki", "Phi le ca hoi tuoi nuong sot Teriyaki dac biet", 295000m, "Mon Chinh", "Healthy", "tone-amber", "/images/thuc-don/ca-hoi-teriyaki.jpg"),
        new("Ga nuong mat ong", "ga-nuong-mat-ong", "Dui ga nuong mat ong thom ngon, gion ngoai mem trong", 185000m, "Mon Chinh", "Popular", "tone-gold", string.Empty),
        new("Mi Y hai san", "mi-y-hai-san", "Mi Y sot kem voi tom, muc, ngheu tuoi ngon", 165000m, "Mon Chinh", "New", "tone-cool", "/images/thuc-don/mi-y-hai-san.jpg"),
        new("Salad Caesar", "salad-caesar", "Rau xa lach tuoi, ga nuong, pho mai Parmesan, sot Caesar", 95000m, "Khai Vi", "Light", "tone-green", string.Empty),
        new("Sup bi do", "sup-bi-do", "Sup bi do kem min, hat hanh nhan rang gion", 75000m, "Khai Vi", "Warm", "tone-amber", string.Empty),
        new("Goi cuon tom thit", "goi-cuon-tom-thit", "Goi cuon tuoi ngon voi tom, thit, rau song va bun", 65000m, "Khai Vi", "Fresh", "tone-mint", string.Empty),
        new("Khoai tay chien", "khoai-tay-chien", "Khoai tay chien gion rum, kem sot tuong ot", 55000m, "Khai Vi", "Classic", "tone-gold", string.Empty),
        new("Tra dao cam sa", "tra-dao-cam-sa", "Tra den pha dao tuoi, cam va sa thom mat", 55000m, "Do Uong", "Signature", "tone-amber", "/images/thuc-don/tra-dao-cam-sa.jpg"),
        new("Sinh to bo", "sinh-to-bo", "Sinh to bo sanh min, beo ngay tu nhien", 45000m, "Do Uong", "Creamy", "tone-green", string.Empty),
        new("Ca phe sua da", "ca-phe-sua-da", "Ca phe phin truyen thong pha sua da mat lanh", 35000m, "Do Uong", "Classic", "tone-brown", string.Empty),
        new("Nuoc ep dua hau", "nuoc-ep-dua-hau", "Nuoc ep dua hau tuoi mat, khong duong", 40000m, "Do Uong", "Fresh", "tone-red", string.Empty),
        new("Tiramisu", "tiramisu", "Banh Tiramisu Y truyen thong voi ca phe Espresso", 85000m, "Trang Mieng", "Premium", "tone-brown", string.Empty),
        new("Panna Cotta", "panna-cotta", "Banh Panna Cotta mem min voi sot dau tay", 75000m, "Trang Mieng", "Sweet", "tone-violet", string.Empty),
        new("Kem Vani", "kem-vani", "Kem vani tu lam voi hat vani Madagascar", 55000m, "Trang Mieng", "Homemade", "tone-gold", string.Empty),
        new("Combo Gia Dinh", "combo-gia-dinh", "2 mon chinh + 2 khai vi + 4 do uong + 1 trang mieng", 899000m, "Combo", "Save 20%", "tone-amber", string.Empty),
        new("Combo Couple", "combo-couple", "2 mon chinh + 1 khai vi + 2 do uong", 499000m, "Combo", "Romantic", "tone-red", string.Empty),
        new("Combo Solo", "combo-solo", "1 mon chinh + 1 khai vi + 1 do uong", 249000m, "Combo", "Value", "tone-cool", string.Empty),
    ];

    public static async Task DamBaoDuLieuMauAsync(UngDungDbContext dbContext, CancellationToken cancellationToken = default)
    {
        var cacSlugDangCo = await dbContext.MonAn
            .AsNoTracking()
            .Select(x => x.Slug)
            .ToListAsync(cancellationToken);

        var tapSlugDangCo = new HashSet<string>(cacSlugDangCo, StringComparer.OrdinalIgnoreCase);
        var thoiDiemTao = DateTime.UtcNow;

        var danhSachCanThem = DanhSachMonMau
            .Where(mon => !tapSlugDangCo.Contains(mon.Slug))
            .Select(mon => new MonAn
            {
                TenMon = mon.TenMon,
                Slug = mon.Slug,
                MoTa = mon.MoTa,
                Gia = mon.Gia,
                DanhMuc = mon.DanhMuc,
                NhanMon = mon.NhanMon,
                ToneMau = mon.ToneMau,
                HinhAnh = mon.HinhAnh,
                DangKinhDoanh = true,
                TaoLuc = thoiDiemTao,
                CapNhatLuc = thoiDiemTao,
            })
            .ToList();

        if (danhSachCanThem.Count == 0)
        {
            return;
        }

        dbContext.MonAn.AddRange(danhSachCanThem);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
