namespace apiquanlynhahang.Models;

public class ChiTietNhapKho
{
    public uint Id { get; set; }
    public uint PhieuNhapKhoId { get; set; }
    public uint NguyenLieuId { get; set; }
    public decimal SoLuongNhap { get; set; }
    public decimal DonGiaNhap { get; set; }
    public decimal ThanhTien { get; set; }
    public string GhiChu { get; set; } = string.Empty;
}
