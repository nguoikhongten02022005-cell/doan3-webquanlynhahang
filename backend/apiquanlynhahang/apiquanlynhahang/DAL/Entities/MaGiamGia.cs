namespace apiquanlynhahang.DAL.Entities;

public class MaGiamGia
{
    public string MaCode { get; set; } = string.Empty;
    public string TenCode { get; set; } = string.Empty;
    public decimal GiaTri { get; set; }
    public string LoaiGiam { get; set; } = string.Empty;
    public decimal? GiaTriToiDa { get; set; }
    public decimal DonHangToiThieu { get; set; }
    public DateOnly NgayBatDau { get; set; }
    public DateOnly NgayKetThuc { get; set; }
    public int? SoLanToiDa { get; set; }
    public int SoLanDaDung { get; set; }
    public string TrangThai { get; set; } = "Active";
}
