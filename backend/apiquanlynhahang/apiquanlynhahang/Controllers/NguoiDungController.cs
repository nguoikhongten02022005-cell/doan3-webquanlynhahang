using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.Common;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/nguoi-dung")]
[Authorize(Roles = "Admin,NhanVien")]
public class NguoiDungController : ControllerBase
{
    private readonly NguoiDungService _service;

    public NguoiDungController(NguoiDungService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> LayToi(CancellationToken cancellationToken)
    {
        var current = User.LayNguoiDungHienTai();
        if (current is null) return Unauthorized(new { message = "Khong xac dinh duoc nguoi dung hien tai" });
        return Ok(new { data = await _service.LayTheoMaAsync(current.MaND, cancellationToken) });
    }

    [HttpGet("{maNd}")]
    public async Task<IActionResult> LayTheoMa(string maNd, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoMaAsync(maNd, cancellationToken) });

    [Authorize(Roles = "Admin")]
    [HttpPatch("{maNd}/role")]
    public async Task<IActionResult> CapNhatVaiTro(string maNd, [FromBody] CapNhatTrangThaiDto dto, CancellationToken cancellationToken)
        => Ok(new { data = await _service.CapNhatVaiTroAsync(maNd, dto.TrangThai, cancellationToken) });

    [Authorize(Roles = "Admin")]
    [HttpPatch("{maNd}/status")]
    public async Task<IActionResult> CapNhatTrangThai(string maNd, [FromBody] CapNhatTrangThaiDto dto, CancellationToken cancellationToken)
        => Ok(new { data = await _service.CapNhatTrangThaiAsync(maNd, dto.TrangThai, cancellationToken) });
}
