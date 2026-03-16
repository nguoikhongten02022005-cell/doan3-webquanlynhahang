using apiquanlynhahang.DTOs;
using apiquanlynhahang.Common;
using apiquanlynhahang.Models;
using apiquanlynhahang.Services;
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
    public async Task<IActionResult> DangNhap([FromBody] DangNhapDto dto, CancellationToken cancellationToken)
    {
        var (nguoiDung, loi) = await _authService.DangNhapAsync(dto, null, cancellationToken);
        return nguoiDung is null
            ? BadRequest(new { message = loi })
            : Ok(new { message = "Dang nhap thanh cong", data = TaoDuLieuAuth(nguoiDung, _authService.TaoAccessToken(nguoiDung)) });
    }

    [HttpPost("internal-login")]
    public async Task<IActionResult> DangNhapNoiBo([FromBody] DangNhapDto dto, CancellationToken cancellationToken)
    {
        var (nguoiDung, loi) = await _authService.DangNhapAsync(dto, "staff", cancellationToken);
        return nguoiDung is null
            ? BadRequest(new { message = loi })
            : Ok(new { message = "Dang nhap noi bo thanh cong", data = TaoDuLieuAuth(nguoiDung, _authService.TaoAccessToken(nguoiDung)) });
    }

    [HttpPost("register")]
    public async Task<IActionResult> DangKy([FromBody] DangKyDto dto, CancellationToken cancellationToken)
    {
        var (nguoiDung, loi) = await _authService.DangKyAsync(dto, cancellationToken);
        return nguoiDung is null
            ? BadRequest(new { message = loi })
            : StatusCode(201, new { message = "Dang ky tai khoan thanh cong", data = TaoDuLieuAuth(nguoiDung, _authService.TaoAccessToken(nguoiDung)) });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> LayToi(CancellationToken cancellationToken)
    {
        var currentUser = User.LayNguoiDungHienTai();
        if (currentUser is null)
        {
            return Unauthorized(new { message = "Khong xac dinh duoc nguoi dung hien tai" });
        }

        var nguoiDung = await _authService.LayTheoEmailAsync(currentUser.Email, cancellationToken);
        return nguoiDung is null
            ? NotFound(new { message = "Khong tim thay nguoi dung" })
            : Ok(new { message = "Lay thong tin nguoi dung thanh cong", data = TaoDuLieuAuth(nguoiDung, _authService.TaoAccessToken(nguoiDung)) });
    }

    [Authorize]
    [HttpPatch("me")]
    public async Task<IActionResult> CapNhatToi([FromBody] CapNhatHoSoDto dto, CancellationToken cancellationToken)
    {
        var currentUser = User.LayNguoiDungHienTai();
        if (currentUser is null)
        {
            return Unauthorized(new { message = "Khong xac dinh duoc nguoi dung hien tai" });
        }

        var (nguoiDung, loi) = await _authService.CapNhatHoSoAsync(currentUser.Email, dto, cancellationToken);
        return nguoiDung is null
            ? NotFound(new { message = loi })
            : Ok(new { message = "Cap nhat ho so thanh cong", data = TaoDuLieuAuth(nguoiDung, _authService.TaoAccessToken(nguoiDung)) });
    }

    [HttpPost("refresh")]
    public IActionResult LamMoi()
    {
        return Ok(new { message = "Chua cau hinh refresh token trong ban nay", data = (object?)null });
    }

    [HttpPost("logout")]
    public IActionResult DangXuat()
    {
        return Ok(new { message = "Dang xuat thanh cong", data = (object?)null });
    }

    private static object TaoDuLieuAuth(NguoiDung nguoiDung, string accessToken) => new
    {
        accessToken,
        tokenType = "Bearer",
        user = new
        {
            nguoiDung.Id,
            fullName = nguoiDung.HoTen,
            username = nguoiDung.TenDangNhap,
            nguoiDung.Email,
            role = nguoiDung.VaiTro,
            status = nguoiDung.TrangThai,
            phone = nguoiDung.SoDienThoai,
        },
        currentUser = new
        {
            id = nguoiDung.Id,
            fullName = nguoiDung.HoTen,
            email = nguoiDung.Email,
            role = nguoiDung.VaiTro,
        },
    };
}
