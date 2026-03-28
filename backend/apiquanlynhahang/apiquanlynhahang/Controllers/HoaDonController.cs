using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/hoa-don")]
[Authorize(Roles = "Admin,NhanVien")]
public class HoaDonController : ControllerBase
{
    private readonly HoaDonService _service;

    public HoaDonController(HoaDonService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [HttpGet("{maHoaDon}")]
    public async Task<IActionResult> LayTheoMa(string maHoaDon, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoMaAsync(maHoaDon, cancellationToken) });

    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoHoaDonDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });
}
