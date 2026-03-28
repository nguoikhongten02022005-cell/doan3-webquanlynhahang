namespace apiquanlynhahang.DAL.Entities;

public class DanhGia
{
    public string MaDanhGia { get; set; } = string.Empty;
    public string MaKH { get; set; } = string.Empty;
    public string MaDonHang { get; set; } = string.Empty;
    public byte SoSao { get; set; }
    public string? NoiDung { get; set; }
    public string? PhanHoi { get; set; }
    public DateTime NgayDanhGia { get; set; }
    public DateTime NgayCapNhat { get; set; }
    public string TrangThai { get; set; } = "Pending";
}
