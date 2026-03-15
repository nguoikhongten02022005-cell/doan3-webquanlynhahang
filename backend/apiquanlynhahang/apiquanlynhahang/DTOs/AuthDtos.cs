namespace apiquanlynhahang.DTOs;

public class DangNhapDto
{
    public string Identifier { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class DangKyDto
{
    public string FullName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Phone { get; set; }
}

public class CapNhatHoSoDto
{
    public string? FullName { get; set; }
    public string? Phone { get; set; }
}
