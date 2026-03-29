using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.Common;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/mang-ve/don-hang")]
[Authorize]
public class MangVeController : ControllerBase
{
    private readonly DonHangService _donHangService;
    private readonly AuthService _authService;

    public MangVeController(DonHangService donHangService, AuthService authService)
    {
        _donHangService = donHangService;
        _authService = authService;
    }

    [HttpPost]
    public async Task<IActionResult> TaoDonMangVe([FromBody] TaoDonMangVeDto dto, CancellationToken cancellationToken)
    {
        var current = User.LayNguoiDungHienTai();
        if (current is null) return Unauthorized(new { message = "Khong xac dinh duoc nguoi dung hien tai" });

        var thongTinNguoiDung = await _authService.LayThongTinNguoiDungHienTaiAsync(current.MaND, cancellationToken);
        if (thongTinNguoiDung is null || string.IsNullOrWhiteSpace(thongTinNguoiDung.MaKH))
        {
            return BadRequest(new { message = "Khong tim thay ma khach hang de tao don mang ve" });
        }

        dto.MaKH = thongTinNguoiDung.MaKH;
        var duLieu = await _donHangService.TaoDonMangVeAsync(dto, cancellationToken);
        return StatusCode(201, new { data = duLieu });
    }

    [HttpGet("{maDonHang}")]
    public async Task<IActionResult> LayDonMangVe(string maDonHang, CancellationToken cancellationToken)
    {
        var current = User.LayNguoiDungHienTai();
        if (current is null) return Unauthorized(new { message = "Khong xac dinh duoc nguoi dung hien tai" });

        var thongTinNguoiDung = await _authService.LayThongTinNguoiDungHienTaiAsync(current.MaND, cancellationToken);
        var duLieu = await _donHangService.LayChiTietDonMangVeAsync(maDonHang, thongTinNguoiDung?.MaKH, cancellationToken);
        return duLieu is null ? NotFound(new { message = "Khong tim thay don mang ve" }) : Ok(new { data = duLieu });
    }

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpGet("/api/mang-ve/admin/don-hang")]
    public async Task<IActionResult> LayDanhSachDonMangVeChoAdmin(CancellationToken cancellationToken)
        => Ok(new { data = await _donHangService.LayDanhSachDonMangVeChoAdminAsync(cancellationToken) });

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPatch("/api/mang-ve/admin/don-hang/{maDonHang}/trang-thai")]
    public async Task<IActionResult> CapNhatTrangThaiDonMangVe(string maDonHang, [FromBody] CapNhatTrangThaiDto dto, CancellationToken cancellationToken)
    {
        var duLieu = await _donHangService.CapNhatTrangThaiDonMangVeAsync(maDonHang, dto.TrangThai, cancellationToken);
        return duLieu is null ? NotFound(new { message = "Khong tim thay don mang ve" }) : Ok(new { data = duLieu });
    }
}
