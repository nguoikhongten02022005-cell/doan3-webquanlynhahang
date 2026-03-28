namespace apiquanlynhahang.DAL.Entities;

public class ThongBao
{
    public string MaThongBao { get; set; } = string.Empty;
    public string MaND { get; set; } = string.Empty;
    public string TieuDe { get; set; } = string.Empty;
    public string? NoiDung { get; set; }
    public string LoaiThongBao { get; set; } = string.Empty;
    public string? MaThamChieu { get; set; }
    public bool DaDoc { get; set; }
    public DateTime NgayTao { get; set; }
}
