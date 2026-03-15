namespace apiquanlynhahang.DTOs;

public class TaoBanAnDto
{
    public string Id { get; set; } = string.Empty;
    public string MaBan { get; set; } = string.Empty;
    public string TenBan { get; set; } = string.Empty;
    public string KhuVucId { get; set; } = string.Empty;
    public uint SucChua { get; set; }
    public string GhiChu { get; set; } = string.Empty;
}

public class CapNhatBanAnDto
{
    public string? MaBan { get; set; }
    public string? TenBan { get; set; }
    public string? KhuVucId { get; set; }
    public uint? SucChua { get; set; }
    public string? GhiChu { get; set; }
}

public class CapNhatTrangThaiBanAnDto
{
    public string TrangThai { get; set; } = string.Empty;
}
