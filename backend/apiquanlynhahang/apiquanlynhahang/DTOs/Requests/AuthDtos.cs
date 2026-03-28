namespace apiquanlynhahang.DTOs.Requests;

public class DangNhapDto
{
    public string Email { get; set; } = string.Empty;
    public string MatKhau { get; set; } = string.Empty;
}

public class DangKyKhachHangDto
{
    public string MaND { get; set; } = string.Empty;
    public string MaKH { get; set; } = string.Empty;
    public string TenND { get; set; } = string.Empty;
    public string TenKH { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MatKhau { get; set; } = string.Empty;
    public string? SDT { get; set; }
    public string? DiaChi { get; set; }
}
