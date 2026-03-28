namespace apiquanlynhahang.DAL.Entities;

public class NhanVien
{
    public string MaNV { get; set; } = string.Empty;
    public string MaND { get; set; } = string.Empty;
    public string HoTen { get; set; } = string.Empty;
    public string? GioiTinh { get; set; }
    public string? SDT { get; set; }
    public string? DiaChi { get; set; }
    public string ChucVu { get; set; } = string.Empty;
    public decimal LuongCoBan { get; set; }
    public DateOnly? NgayVaoLam { get; set; }
    public string TinhTrang { get; set; } = "Active";
    public DateTime NgayCapNhat { get; set; }
}
