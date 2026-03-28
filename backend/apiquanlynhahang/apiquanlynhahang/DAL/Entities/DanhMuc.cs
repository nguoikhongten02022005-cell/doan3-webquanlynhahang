namespace apiquanlynhahang.DAL.Entities;

public class DanhMuc
{
    public string MaDanhMuc { get; set; } = string.Empty;
    public string TenDanhMuc { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public int ThuTu { get; set; }
    public string TrangThai { get; set; } = "Active";
}
