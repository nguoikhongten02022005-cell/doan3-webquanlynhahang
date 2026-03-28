using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/nhan-vien")]
[Authorize(Roles = "Admin,NhanVien")]
public class NhanVienController : ControllerBase
{
    private readonly NhanVienService _service;

    public NhanVienController(NhanVienService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [HttpGet("{maNv}")]
    public async Task<IActionResult> LayTheoMa(string maNv, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoMaAsync(maNv, cancellationToken) });

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoNhanVienDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });
}
