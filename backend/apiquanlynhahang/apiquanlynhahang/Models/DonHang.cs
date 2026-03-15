namespace apiquanlynhahang.Models;

public class DonHang
{
    public uint Id { get; set; }
    public string MaDonHang { get; set; } = string.Empty;
    public decimal TamTinh { get; set; }
    public decimal PhiDichVu { get; set; }
    public decimal TienGiam { get; set; }
    public string MaGiamGiaApDung { get; set; } = string.Empty;
    public decimal ThanhTien { get; set; }
    public DateTime DatLuc { get; set; }
    public string TrangThai { get; set; } = string.Empty;
    public string TrangThaiThanhToan { get; set; } = string.Empty;
    public string GhiChu { get; set; } = string.Empty;
    public string MaBan { get; set; } = string.Empty;
    public string PhuongThucThanhToan { get; set; } = string.Empty;
    public string EmailNguoiDung { get; set; } = string.Empty;
    public string TenKhachHang { get; set; } = string.Empty;
    public string SoDienThoaiKhachHang { get; set; } = string.Empty;
    public string EmailKhachHang { get; set; } = string.Empty;
    public string DiaChiKhachHang { get; set; } = string.Empty;
    public string? ThongTinKhachHang { get; set; }
    public uint? NguoiDungId { get; set; }
    public DateTime TaoLuc { get; set; }
    public DateTime CapNhatLuc { get; set; }
}
