namespace apiquanlynhahang.DAL.Entities;

public class DonHang
{
    public string MaDonHang { get; set; } = string.Empty;
    public string? MaKH { get; set; }
    public string? MaBan { get; set; }
    public string? MaBanAn { get; set; }
    public string? MaNV { get; set; }
    public string? MaDatBan { get; set; }
    public string LoaiDon { get; set; } = "TAI_QUAN";
    public string? DiaChiGiao { get; set; }
    public decimal PhiShip { get; set; }
    public decimal TongTien { get; set; }
    public string TrangThai { get; set; } = "Pending";
    public string NguonTao { get; set; } = "TaiQuay";
    public string? GhiChu { get; set; }
    public DateTime NgayTao { get; set; }
    public DateTime NgayCapNhat { get; set; }
}
