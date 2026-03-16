namespace apiquanlynhahang.Models;

public class NguyenLieu
{
    public uint Id { get; set; }
    public string MaNguyenLieu { get; set; } = string.Empty;
    public string TenNguyenLieu { get; set; } = string.Empty;
    public string DonViTinh { get; set; } = string.Empty;
    public decimal SoLuongTon { get; set; }
    public decimal MucCanhBaoToiThieu { get; set; }
    public string TrangThai { get; set; } = string.Empty;
    public string GhiChu { get; set; } = string.Empty;
    public DateTime TaoLuc { get; set; }
    public DateTime CapNhatLuc { get; set; }
}
