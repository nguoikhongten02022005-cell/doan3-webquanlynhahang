namespace apiquanlynhahang.DAL.Entities;

public class KhachHang
{
    public string MaKH { get; set; } = string.Empty;
    public string? MaND { get; set; }
    public string TenKH { get; set; } = string.Empty;
    public string? SDT { get; set; }
    public string? DiaChi { get; set; }
    public int DiemTichLuy { get; set; }
    public DateTime NgayTao { get; set; }
}
