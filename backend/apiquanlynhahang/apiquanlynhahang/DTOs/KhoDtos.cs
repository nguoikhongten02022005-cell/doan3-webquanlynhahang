namespace apiquanlynhahang.DTOs;

public class TaoNguyenLieuDto
{
    public string MaNguyenLieu { get; set; } = string.Empty;
    public string TenNguyenLieu { get; set; } = string.Empty;
    public string DonViTinh { get; set; } = string.Empty;
    public decimal SoLuongTon { get; set; }
    public decimal MucCanhBaoToiThieu { get; set; }
    public string GhiChu { get; set; } = string.Empty;
}

public class CapNhatNguyenLieuDto
{
    public string? TenNguyenLieu { get; set; }
    public string? DonViTinh { get; set; }
    public decimal? SoLuongTon { get; set; }
    public decimal? MucCanhBaoToiThieu { get; set; }
    public string? GhiChu { get; set; }
}

public class TaoChiTietNhapKhoDto
{
    public int NguyenLieuId { get; set; }
    public decimal SoLuongNhap { get; set; }
    public decimal DonGiaNhap { get; set; }
    public string GhiChu { get; set; } = string.Empty;
}

public class TaoPhieuNhapKhoDto
{
    public DateTime? NgayNhap { get; set; }
    public string NhaCungCap { get; set; } = string.Empty;
    public string GhiChu { get; set; } = string.Empty;
    public uint? NguoiTaoId { get; set; }
    public List<TaoChiTietNhapKhoDto> DanhSachNguyenLieu { get; set; } = [];
}

public class TaoCongThucMonAnDto
{
    public int MonAnId { get; set; }
    public int NguyenLieuId { get; set; }
    public decimal DinhLuong { get; set; }
    public string DonViTinh { get; set; } = string.Empty;
    public string GhiChu { get; set; } = string.Empty;
}

public class CapNhatCongThucMonAnDto
{
    public decimal? DinhLuong { get; set; }
    public string? DonViTinh { get; set; }
    public string? GhiChu { get; set; }
}
