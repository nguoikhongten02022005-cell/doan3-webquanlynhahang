namespace apiquanlynhahang.DTOs;

public class TaoDatBanDto
{
    public uint SoKhach { get; set; }
    public DateOnly NgayDat { get; set; }
    public TimeOnly GioDat { get; set; }
    public string KhuVucUuTien { get; set; } = "KHONG_UU_TIEN";
    public string GhiChu { get; set; } = string.Empty;
    public string TenKhach { get; set; } = string.Empty;
    public string SoDienThoaiKhach { get; set; } = string.Empty;
    public string EmailKhach { get; set; } = string.Empty;
    public string TrangThai { get; set; } = "YEU_CAU_DAT_BAN";
    public string NguonTao { get; set; } = "web";
    public string? EmailNguoiDung { get; set; }
    public string DipDacBiet { get; set; } = string.Empty;
    public string? KenhXacNhan { get; set; }
    public string GhiChuNoiBo { get; set; } = string.Empty;
    public string TaoBoi { get; set; } = string.Empty;
    public uint? NguoiDungId { get; set; }
}

public class CapNhatDatBanDto
{
    public uint? SoKhach { get; set; }
    public DateOnly? NgayDat { get; set; }
    public TimeOnly? GioDat { get; set; }
    public string? KhuVucUuTien { get; set; }
    public string? GhiChu { get; set; }
    public string? TenKhach { get; set; }
    public string? SoDienThoaiKhach { get; set; }
    public string? EmailKhach { get; set; }
    public string? DipDacBiet { get; set; }
    public string? GhiChuNoiBo { get; set; }
}

public class CapNhatTrangThaiDatBanDto
{
    public string TrangThai { get; set; } = string.Empty;
}

public class GanBanChoDatBanDto
{
    public List<string> DanhSachBanAnId { get; set; } = [];
}
