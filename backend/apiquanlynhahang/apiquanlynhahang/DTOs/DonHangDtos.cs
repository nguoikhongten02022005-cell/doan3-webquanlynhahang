namespace apiquanlynhahang.DTOs;

public class TaoDonHangDto
{
    public List<TaoChiTietDonHangDto> DanhSachMon { get; set; } = [];
    public string MaGiamGiaApDung { get; set; } = string.Empty;
    public KhachHangDonHangDto KhachHang { get; set; } = new();
    public string GhiChu { get; set; } = string.Empty;
    public string MaBan { get; set; } = string.Empty;
    public string PhuongThucThanhToan { get; set; } = "TIEN_MAT";
    public string EmailNguoiDung { get; set; } = string.Empty;
    public uint? NguoiDungId { get; set; }
}

public class TaoChiTietDonHangDto
{
    public int? MonAnId { get; set; }
    public uint SoLuong { get; set; }
    public string KichCo { get; set; } = "M";
    public List<string> ToppingDaChon { get; set; } = [];
    public string GhiChuMon { get; set; } = string.Empty;
    public string MaBienThe { get; set; } = string.Empty;
}

public class KhachHangDonHangDto
{
    public string TenKhachHang { get; set; } = string.Empty;
    public string SoDienThoaiKhachHang { get; set; } = string.Empty;
    public string EmailKhachHang { get; set; } = string.Empty;
    public string DiaChiKhachHang { get; set; } = string.Empty;
}

public class CapNhatTrangThaiDonHangDto
{
    public string TrangThai { get; set; } = string.Empty;
}
