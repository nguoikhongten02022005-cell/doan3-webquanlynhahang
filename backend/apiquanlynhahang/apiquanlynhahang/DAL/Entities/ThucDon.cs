namespace apiquanlynhahang.DAL.Entities;

public class ThucDon
{
    public string MaMon { get; set; } = string.Empty;
    public string? MaDanhMuc { get; set; }
    public string TenMon { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public decimal Gia { get; set; }
    public string? HinhAnh { get; set; }
    public int ThoiGianChuanBi { get; set; }
    public string TrangThai { get; set; } = "Available";
    public DateTime NgayTao { get; set; }
    public DateTime NgayCapNhat { get; set; }
}
