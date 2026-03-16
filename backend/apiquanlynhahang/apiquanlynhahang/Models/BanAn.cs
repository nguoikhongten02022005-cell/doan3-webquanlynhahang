namespace apiquanlynhahang.Models;

public class BanAn
{
    public string Id { get; set; } = string.Empty;
    public string MaBan { get; set; } = string.Empty;
    public string MaQr { get; set; } = string.Empty;
    public string TokenQr { get; set; } = string.Empty;
    public bool KichHoatQr { get; set; }
    public string TenBan { get; set; } = string.Empty;
    public string KhuVucId { get; set; } = string.Empty;
    public uint SucChua { get; set; }
    public string TrangThai { get; set; } = string.Empty;
    public uint? DatBanHienTaiId { get; set; }
    public string MaDatBanHienTai { get; set; } = string.Empty;
    public DateTime? DangSuDungLuc { get; set; }
    public DateTime? GiaiPhongLuc { get; set; }
    public string GhiChu { get; set; } = string.Empty;
    public DateTime TaoLuc { get; set; }
    public DateTime CapNhatLuc { get; set; }
}
