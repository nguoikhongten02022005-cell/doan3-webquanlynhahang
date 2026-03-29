using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.Common;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [HttpPost("dang-nhap")]
    public async Task<IActionResult> DangNhapKhach([FromBody] DangNhapDto dto, CancellationToken cancellationToken)
    {
        var (duLieu, loi) = await _authService.DangNhapKhachAsync(dto, cancellationToken);
        return duLieu is null ? BadRequest(new { message = loi }) : Ok(new { message = "Dang nhap khach thanh cong", data = duLieu });
    }

    [HttpPost("internal-login")]
    public async Task<IActionResult> DangNhapNoiBo([FromBody] DangNhapDto dto, CancellationToken cancellationToken)
    {
        var (duLieu, loi) = await _authService.DangNhapNoiBoAsync(dto, cancellationToken);
        return duLieu is null ? BadRequest(new { message = loi }) : Ok(new { message = "Dang nhap noi bo thanh cong", data = duLieu });
    }

    [HttpPost("register")]
    [HttpPost("dang-ky")]
    public async Task<IActionResult> DangKy([FromBody] DangKyKhachHangDto dto, CancellationToken cancellationToken)
    {
        var (duLieu, loi) = await _authService.DangKyKhachHangAsync(dto, cancellationToken);
        return duLieu is null ? BadRequest(new { message = loi }) : StatusCode(201, new { message = "Dang ky khach hang thanh cong", data = duLieu });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> LayToi(CancellationToken cancellationToken)
    {
        var current = User.LayNguoiDungHienTai();
        if (current is null) return Unauthorized(new { message = "Khong xac dinh duoc nguoi dung hien tai" });
        var nguoiDung = await _authService.LayThongTinNguoiDungHienTaiAsync(current.MaND, cancellationToken);
        return nguoiDung is null ? NotFound(new { message = "Khong tim thay nguoi dung" }) : Ok(new { data = nguoiDung });
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> CapNhatHoSo([FromBody] CapNhatHoSoDto dto, CancellationToken cancellationToken)
    {
        var current = User.LayNguoiDungHienTai();
        if (current is null) return Unauthorized(new { message = "Khong xac dinh duoc nguoi dung hien tai" });

        var (duLieu, loi) = await _authService.CapNhatHoSoAsync(current.MaND, dto, cancellationToken);
        return duLieu is null ? BadRequest(new { message = loi }) : Ok(new { message = "Cap nhat ho so thanh cong", data = duLieu });
    }

    [Authorize]
    [HttpPut("doi-mat-khau")]
    public async Task<IActionResult> DoiMatKhau([FromBody] DoiMatKhauDto dto, CancellationToken cancellationToken)
    {
        var current = User.LayNguoiDungHienTai();
        if (current is null) return Unauthorized(new { message = "Khong xac dinh duoc nguoi dung hien tai" });

        var loi = await _authService.DoiMatKhauAsync(current.MaND, dto, cancellationToken);
        return loi is null ? Ok(new { message = "Doi mat khau thanh cong" }) : BadRequest(new { message = loi });
    }
}
