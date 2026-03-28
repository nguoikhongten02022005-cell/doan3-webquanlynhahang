namespace apiquanlynhahang.DAL.Entities;

public class QRCode
{
    public string MaQR { get; set; } = string.Empty;
    public string MaBan { get; set; } = string.Empty;
    public string DuongDanQR { get; set; } = string.Empty;
    public DateTime NgayTao { get; set; }
    public DateTime? NgayHetHan { get; set; }
    public string TrangThai { get; set; } = "Active";
}
