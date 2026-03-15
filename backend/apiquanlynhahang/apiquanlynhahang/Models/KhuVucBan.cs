namespace apiquanlynhahang.Models;

public class KhuVucBan
{
    public string Id { get; set; } = string.Empty;
    public string TenKhuVuc { get; set; } = string.Empty;
    public string MoTa { get; set; } = string.Empty;
    public DateTime TaoLuc { get; set; }
    public DateTime CapNhatLuc { get; set; }
}
