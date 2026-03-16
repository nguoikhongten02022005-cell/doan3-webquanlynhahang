namespace apiquanlynhahang.Models;

public class CongThucMonAn
{
    public uint Id { get; set; }
    public uint MonAnId { get; set; }
    public uint NguyenLieuId { get; set; }
    public decimal DinhLuong { get; set; }
    public string DonViTinh { get; set; } = string.Empty;
    public string GhiChu { get; set; } = string.Empty;
    public DateTime TaoLuc { get; set; }
    public DateTime CapNhatLuc { get; set; }
}
