namespace apiquanlynhahang.DTOs.Requests;

public class TaoNhanVienDto
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
}

public class TaoKhachHangDto
{
    public string MaKH { get; set; } = string.Empty;
    public string? MaND { get; set; }
    public string TenKH { get; set; } = string.Empty;
    public string? SDT { get; set; }
    public string? DiaChi { get; set; }
}

public class TaoBanDto
{
    public string MaBan { get; set; } = string.Empty;
    public string? TenBan { get; set; }
    public string? KhuVuc { get; set; }
    public int SoBan { get; set; }
    public int SoChoNgoi { get; set; }
    public string? ViTri { get; set; }
    public string? GhiChu { get; set; }
}

public class CapNhatBanDto
{
    public string TenBan { get; set; } = string.Empty;
    public string KhuVuc { get; set; } = string.Empty;
    public int SoChoNgoi { get; set; }
    public string? GhiChu { get; set; }
}

public class TaoQRCodeDto
{
    public string MaQR { get; set; } = string.Empty;
    public string MaBan { get; set; } = string.Empty;
    public string DuongDanQR { get; set; } = string.Empty;
    public DateTime? NgayHetHan { get; set; }
}

public class TaoDanhMucDto
{
    public string MaDanhMuc { get; set; } = string.Empty;
    public string TenDanhMuc { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public int ThuTu { get; set; }
}

public class TaoThucDonDto
{
    public string MaMon { get; set; } = string.Empty;
    public string? MaDanhMuc { get; set; }
    public string TenMon { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public decimal Gia { get; set; }
    public string? HinhAnh { get; set; }
    public int ThoiGianChuanBi { get; set; }
}

public class TaoMaGiamGiaDto
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
}

public class TaoDatBanDto
{
    public string MaDatBan { get; set; } = string.Empty;
    public string? MaKH { get; set; }
    public string? MaBan { get; set; }
    public string? MaNV { get; set; }
    public DateOnly NgayDat { get; set; }
    public TimeOnly GioDat { get; set; }
    public TimeOnly? GioKetThuc { get; set; }
    public int SoNguoi { get; set; }
    public string? GhiChu { get; set; }
}

public class TaoChiTietDonHangDto
{
    public string MaChiTiet { get; set; } = string.Empty;
    public string MaMon { get; set; } = string.Empty;
    public int SoLuong { get; set; }
    public decimal? DonGia { get; set; }
    public string? GhiChu { get; set; }
}

public class TaoOrderTaiBanDto
{
    public List<TaoChiTietDonHangDto> DanhSachMon { get; set; } = [];
}

public class TaoDonHangDto
{
    public string MaDonHang { get; set; } = string.Empty;
    public string? MaKH { get; set; }
    public string? MaBan { get; set; }
    public string? MaNV { get; set; }
    public string? MaDatBan { get; set; }
    public string NguonTao { get; set; } = "TaiQuay";
    public string? GhiChu { get; set; }
    public List<TaoChiTietDonHangDto> ChiTiet { get; set; } = [];
}

public class TaoHoaDonDto
{
    public string MaHoaDon { get; set; } = string.Empty;
    public string MaDonHang { get; set; } = string.Empty;
    public string? MaKH { get; set; }
    public string? MaCode { get; set; }
    public decimal TongTien { get; set; }
    public decimal GiamGia { get; set; }
    public decimal ThueSuat { get; set; }
    public decimal TienThue { get; set; }
    public decimal ThanhTien { get; set; }
    public string? GhiChu { get; set; }
}

public class TaoThanhToanDto
{
    public string MaThanhToan { get; set; } = string.Empty;
    public string MaHoaDon { get; set; } = string.Empty;
    public string PhuongThuc { get; set; } = string.Empty;
    public decimal SoTien { get; set; }
    public string? MaGiaoDich { get; set; }
}

public class TaoDanhGiaDto
{
    public string MaDanhGia { get; set; } = string.Empty;
    public string MaKH { get; set; } = string.Empty;
    public string MaDonHang { get; set; } = string.Empty;
    public byte SoSao { get; set; }
    public string? NoiDung { get; set; }
}

public class TaoThongBaoDto
{
    public string MaThongBao { get; set; } = string.Empty;
    public string MaND { get; set; } = string.Empty;
    public string TieuDe { get; set; } = string.Empty;
    public string? NoiDung { get; set; }
    public string LoaiThongBao { get; set; } = string.Empty;
    public string? MaThamChieu { get; set; }
}

public class CapNhatTrangThaiDto
{
    public string TrangThai { get; set; } = string.Empty;
}

public class TaoDonMangVeDto
{
    public string MaKH { get; set; } = string.Empty;
    public string LoaiDon { get; set; } = "MANG_VE_PICKUP";
    public string? HoTen { get; set; }
    public string? SoDienThoai { get; set; }
    public string GioLayHang { get; set; } = string.Empty;
    public string? GioGiao { get; set; }
    public string? DiaChiGiao { get; set; }
    public decimal PhiShip { get; set; }
    public string? GhiChu { get; set; }
    public string? MaGiamGia { get; set; }
    public List<TaoChiTietDonHangDto> DanhSachMon { get; set; } = [];
}
