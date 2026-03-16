namespace apiquanlynhahang.Models;

public class BienDongKho
{
    public uint Id { get; set; }
    public uint NguyenLieuId { get; set; }
    public string LoaiBienDong { get; set; } = string.Empty;
    public decimal SoLuongThayDoi { get; set; }
    public decimal SoLuongTruoc { get; set; }
    public decimal SoLuongSau { get; set; }
    public string ThamChieuLoai { get; set; } = string.Empty;
    public uint? ThamChieuId { get; set; }
    public string GhiChu { get; set; } = string.Empty;
    public DateTime TaoLuc { get; set; }
}
