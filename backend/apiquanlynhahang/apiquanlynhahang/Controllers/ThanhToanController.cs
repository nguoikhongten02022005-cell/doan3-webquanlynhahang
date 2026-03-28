using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/thanh-toan")]
[Authorize(Roles = "Admin,NhanVien")]
public class ThanhToanController : ControllerBase
{
    private readonly ThanhToanService _service;

    public ThanhToanController(ThanhToanService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoThanhToanDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });
}
