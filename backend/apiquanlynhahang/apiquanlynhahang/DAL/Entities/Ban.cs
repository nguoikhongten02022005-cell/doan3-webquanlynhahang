namespace apiquanlynhahang.DAL.Entities;

public class Ban
{
    public string MaBan { get; set; } = string.Empty;
    public int SoBan { get; set; }
    public int SoChoNgoi { get; set; }
    public string? ViTri { get; set; }
    public string TrangThai { get; set; } = "Available";
    public DateTime NgayTao { get; set; }
    public DateTime NgayCapNhat { get; set; }
}
