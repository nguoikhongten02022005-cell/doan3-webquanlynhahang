namespace apiquanlynhahang.Models;

public class DatBan
{
    public uint Id { get; set; }
    public string MaDatBan { get; set; } = string.Empty;
    public uint SoKhach { get; set; }
    public DateOnly NgayDat { get; set; }
    public TimeOnly GioDat { get; set; }
    public string KhuVucUuTien { get; set; } = string.Empty;
    public string GhiChu { get; set; } = string.Empty;
    public string TenKhach { get; set; } = string.Empty;
    public string SoDienThoaiKhach { get; set; } = string.Empty;
    public string EmailKhach { get; set; } = string.Empty;
    public string TrangThai { get; set; } = string.Empty;
    public string NguonTao { get; set; } = string.Empty;
    public string? EmailNguoiDung { get; set; }
    public string DipDacBiet { get; set; } = string.Empty;
    public string? KenhXacNhan { get; set; }
    public string GhiChuNoiBo { get; set; } = string.Empty;
    public DateTime? CheckInLuc { get; set; }
    public DateTime? XepBanLuc { get; set; }
    public DateTime? HoanThanhLuc { get; set; }
    public DateTime? HuyLuc { get; set; }
    public DateTime? VangMatLuc { get; set; }
    public string TaoBoi { get; set; } = string.Empty;
    public uint? NguoiDungId { get; set; }
    public DateTime TaoLuc { get; set; }
    public DateTime CapNhatLuc { get; set; }
}
