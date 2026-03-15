namespace apiquanlynhahang.DTOs;

public class TaoMaGiamGiaDto
{
    public string MaGiam { get; set; } = string.Empty;
    public string TenMaGiam { get; set; } = string.Empty;
    public string MoTa { get; set; } = string.Empty;
    public string LoaiGiam { get; set; } = "FIXED";
    public decimal GiaTriGiam { get; set; }
    public decimal DonToiThieu { get; set; }
    public decimal? GiamToiDa { get; set; }
    public DateTime? BatDauLuc { get; set; }
    public DateTime? KetThucLuc { get; set; }
    public uint? GioiHanSuDung { get; set; }
    public bool DangHoatDong { get; set; } = true;
}

public class CapNhatMaGiamGiaDto : TaoMaGiamGiaDto
{
}

public class KiemTraMaGiamGiaDto
{
    public string MaGiam { get; set; } = string.Empty;
    public decimal GiaTriDonHang { get; set; }
}
