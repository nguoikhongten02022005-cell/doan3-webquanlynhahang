namespace apiquanlynhahang.DAL.Entities;

public class LichSuDonHang
{
    public string MaLichSu { get; set; } = string.Empty;
    public string MaDonHang { get; set; } = string.Empty;
    public string? TrangThaiCu { get; set; }
    public string TrangThaiMoi { get; set; } = string.Empty;
    public string? GhiChu { get; set; }
    public string? NguoiThucHien { get; set; }
    public DateTime ThoiGian { get; set; }
}
