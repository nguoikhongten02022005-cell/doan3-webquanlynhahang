using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.Common;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/thong-bao")]
public class ThongBaoController : ControllerBase
{
    private readonly ThongBaoService _service;

    public ThongBaoController(ThongBaoService service)
    {
        _service = service;
    }

    [Authorize]
    [HttpGet("cua-toi")]
    public async Task<IActionResult> LayCuaToi(CancellationToken cancellationToken)
    {
        var current = User.LayNguoiDungHienTai();
        if (current is null) return Unauthorized(new { message = "Khong xac dinh duoc nguoi dung hien tai" });
        return Ok(new { data = await _service.LayTheoNguoiDungAsync(current.MaND, cancellationToken) });
    }

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoThongBaoDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });

    [Authorize]
    [HttpPatch("{maThongBao}/da-doc")]
    public async Task<IActionResult> DanhDauDaDoc(string maThongBao, CancellationToken cancellationToken)
        => Ok(new { data = await _service.DanhDauDaDocAsync(maThongBao, cancellationToken) });
}
