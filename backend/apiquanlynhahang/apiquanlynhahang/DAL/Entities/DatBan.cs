namespace apiquanlynhahang.DAL.Entities;

public class DatBan
{
    public string MaDatBan { get; set; } = string.Empty;
    public string? MaKH { get; set; }
    public string? MaBan { get; set; }
    public string? MaNV { get; set; }
    public DateOnly NgayDat { get; set; }
    public TimeOnly GioDat { get; set; }
    public TimeOnly? GioKetThuc { get; set; }
    public int SoNguoi { get; set; }
    public string? GhiChu { get; set; }
    public string TrangThai { get; set; } = "Pending";
    public DateTime NgayTao { get; set; }
    public DateTime NgayCapNhat { get; set; }
}
