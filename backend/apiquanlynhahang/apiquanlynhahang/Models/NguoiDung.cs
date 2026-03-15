namespace apiquanlynhahang.Models;

public class NguoiDung
{
    public uint Id { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public string TenDangNhap { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MatKhauMaHoa { get; set; } = string.Empty;
    public string VaiTro { get; set; } = string.Empty;
    public string TrangThai { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public DateTime TaoLuc { get; set; }
    public DateTime CapNhatLuc { get; set; }
}
