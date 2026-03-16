namespace apiquanlynhahang.Models;

public class PhieuNhapKho
{
    public uint Id { get; set; }
    public string MaPhieuNhap { get; set; } = string.Empty;
    public DateTime NgayNhap { get; set; }
    public string NhaCungCap { get; set; } = string.Empty;
    public string GhiChu { get; set; } = string.Empty;
    public decimal TongTien { get; set; }
    public uint? NguoiTaoId { get; set; }
    public DateTime TaoLuc { get; set; }
    public DateTime CapNhatLuc { get; set; }
}
