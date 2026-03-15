namespace apiquanlynhahang.Models;

public class MaGiamGia
{
    public uint Id { get; set; }
    public string MaGiam { get; set; } = string.Empty;
    public string TenMaGiam { get; set; } = string.Empty;
    public string MoTa { get; set; } = string.Empty;
    public string LoaiGiam { get; set; } = string.Empty;
    public decimal GiaTriGiam { get; set; }
    public decimal DonToiThieu { get; set; }
    public decimal? GiamToiDa { get; set; }
    public DateTime? BatDauLuc { get; set; }
    public DateTime? KetThucLuc { get; set; }
    public uint? GioiHanSuDung { get; set; }
    public uint DaSuDung { get; set; }
    public bool DangHoatDong { get; set; }
    public DateTime TaoLuc { get; set; }
    public DateTime CapNhatLuc { get; set; }
}
