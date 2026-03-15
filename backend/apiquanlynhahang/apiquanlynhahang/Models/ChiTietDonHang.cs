namespace apiquanlynhahang.Models;

public class ChiTietDonHang
{
    public uint Id { get; set; }
    public uint DonHangId { get; set; }
    public uint? MonAnId { get; set; }
    public string TenMon { get; set; } = string.Empty;
    public decimal DonGia { get; set; }
    public uint SoLuong { get; set; }
    public string KichCo { get; set; } = string.Empty;
    public string? ToppingDaChon { get; set; }
    public string GhiChuMon { get; set; } = string.Empty;
    public string MaBienThe { get; set; } = string.Empty;
    public string? ThongTinMon { get; set; }
}
