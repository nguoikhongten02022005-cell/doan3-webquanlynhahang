namespace apiquanlynhahang.DAL.Entities;

public class ChiTietDonHang
{
    public string MaChiTiet { get; set; } = string.Empty;
    public string MaDonHang { get; set; } = string.Empty;
    public string MaMon { get; set; } = string.Empty;
    public int SoLuong { get; set; }
    public decimal DonGia { get; set; }
    public decimal ThanhTien { get; set; }
    public string? GhiChu { get; set; }
    public string TrangThai { get; set; } = "Pending";
    public DateTime NgayTao { get; set; }
}
