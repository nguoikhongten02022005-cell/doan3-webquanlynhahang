namespace apiquanlynhahang.DAL.Entities;

public class ThanhToan
{
    public string MaThanhToan { get; set; } = string.Empty;
    public string MaHoaDon { get; set; } = string.Empty;
    public string PhuongThuc { get; set; } = string.Empty;
    public decimal SoTien { get; set; }
    public string? MaGiaoDich { get; set; }
    public string TrangThai { get; set; } = "Pending";
    public DateTime ThoiGian { get; set; }
}
