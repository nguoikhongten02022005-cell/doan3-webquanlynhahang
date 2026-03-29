namespace apiquanlynhahang.DTOs.Responses;

public class DuLieuDangNhapDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string TokenType { get; set; } = "Bearer";
    public string MaND { get; set; } = string.Empty;
    public string MaKH { get; set; } = string.Empty;
    public string TenND { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string VaiTro { get; set; } = string.Empty;
}
