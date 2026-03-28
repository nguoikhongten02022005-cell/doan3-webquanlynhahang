namespace apiquanlynhahang.DAL.Entities;

public class HoaDon
{
    public string MaHoaDon { get; set; } = string.Empty;
    public string MaDonHang { get; set; } = string.Empty;
    public string? MaKH { get; set; }
    public string? MaCode { get; set; }
    public decimal TongTien { get; set; }
    public decimal GiamGia { get; set; }
    public decimal ThueSuat { get; set; }
    public decimal TienThue { get; set; }
    public decimal ThanhTien { get; set; }
    public string? GhiChu { get; set; }
    public DateTime NgayXuat { get; set; }
}
