namespace apiquanlynhahang.DTOs.Requests;

public class DangNhapDto
{
    public string Email { get; set; } = string.Empty;
    public string MatKhau { get; set; } = string.Empty;
}

public class DangKyKhachHangDto
{
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SoDienThoai { get; set; } = string.Empty;
    public string MatKhau { get; set; } = string.Empty;
    public string XacNhanMatKhau { get; set; } = string.Empty;
    public string? DiaChi { get; set; }
}

public class CapNhatHoSoDto
{
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SoDienThoai { get; set; } = string.Empty;
    public string? DiaChi { get; set; }
}

public class DoiMatKhauDto
{
    public string MatKhauHienTai { get; set; } = string.Empty;
    public string MatKhauMoi { get; set; } = string.Empty;
    public string XacNhanMatKhauMoi { get; set; } = string.Empty;
}
