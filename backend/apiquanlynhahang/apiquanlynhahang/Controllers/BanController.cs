using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/ban")]
public class BanController : ControllerBase
{
    private readonly BanService _service;

    public BanController(BanService service)
    {
        _service = service;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [AllowAnonymous]
    [HttpGet("{maBan}")]
    public async Task<IActionResult> LayTheoMa(string maBan, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoMaAsync(maBan, cancellationToken) });

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoBanDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPatch("{maBan}/status")]
    public async Task<IActionResult> CapNhatTrangThai(string maBan, [FromBody] CapNhatTrangThaiDto dto, CancellationToken cancellationToken)
        => Ok(new { data = await _service.CapNhatTrangThaiAsync(maBan, dto.TrangThai, cancellationToken) });
}
