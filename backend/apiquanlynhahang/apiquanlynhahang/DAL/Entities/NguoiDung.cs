namespace apiquanlynhahang.DAL.Entities;

public class NguoiDung
{
    public string MaND { get; set; } = string.Empty;
    public string TenND { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MatKhau { get; set; } = string.Empty;
    public string VaiTro { get; set; } = "KhachHang";
    public string TrangThai { get; set; } = "Active";
    public DateTime NgayTao { get; set; }
    public DateTime NgayCapNhat { get; set; }
}
