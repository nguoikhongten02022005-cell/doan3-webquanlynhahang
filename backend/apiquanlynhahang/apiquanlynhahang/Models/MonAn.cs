namespace apiquanlynhahang.Models;

public class MonAn
{
    public uint Id { get; set; }
    public string TenMon { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string MoTa { get; set; } = string.Empty;
    public decimal Gia { get; set; }
    public string DanhMuc { get; set; } = string.Empty;
    public string NhanMon { get; set; } = string.Empty;
    public string ToneMau { get; set; } = string.Empty;
    public string HinhAnh { get; set; } = string.Empty;
    public bool DangKinhDoanh { get; set; }
    public DateTime TaoLuc { get; set; }
    public DateTime CapNhatLuc { get; set; }
}
