using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.Common;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/dat-ban")]
public class DatBanController : ControllerBase
{
    private readonly DatBanService _service;

    public DatBanController(DatBanService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [Authorize]
    [HttpGet("{maDatBan}")]
    public async Task<IActionResult> LayTheoMa(string maDatBan, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoMaAsync(maDatBan, cancellationToken) });

    [Authorize]
    [HttpGet("khach/{maKh}")]
    public async Task<IActionResult> LayTheoKhach(string maKh, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoKhachAsync(maKh, cancellationToken) });

    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoDatBanDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });

    [Authorize]
    [HttpPatch("{maDatBan}/status")]
    public async Task<IActionResult> CapNhatTrangThai(string maDatBan, [FromBody] CapNhatTrangThaiDto dto, CancellationToken cancellationToken)
    {
        var current = User.LayNguoiDungHienTai();
        if (current is null) return Unauthorized(new { message = "Khong xac dinh duoc nguoi dung hien tai" });

        if (!string.Equals(current.VaiTro, "Admin", StringComparison.OrdinalIgnoreCase)
            && !string.Equals(current.VaiTro, "NhanVien", StringComparison.OrdinalIgnoreCase))
        {
            if (!string.Equals(dto.TrangThai, "Cancelled", StringComparison.OrdinalIgnoreCase))
            {
                return Forbid();
            }

            var datBan = await _service.LayTheoMaAsync(maDatBan, cancellationToken);
            if (datBan is null) return NotFound(new { message = "Khong tim thay dat ban" });

            var maKh = await _service.LayMaKhTheoNguoiDungAsync(current.MaND, cancellationToken);
            if (string.IsNullOrWhiteSpace(maKh) || !string.Equals(datBan.MaKH, maKh, StringComparison.OrdinalIgnoreCase))
            {
                return Forbid();
            }
        }

        return Ok(new { data = await _service.CapNhatTrangThaiAsync(maDatBan, dto.TrangThai, cancellationToken) });
    }
}
