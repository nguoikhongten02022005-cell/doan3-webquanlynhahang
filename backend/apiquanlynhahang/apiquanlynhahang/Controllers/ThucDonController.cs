using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/thuc-don")]
public class ThucDonController : ControllerBase
{
    private readonly ThucDonService _service;

    public ThucDonController(ThucDonService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [HttpGet("{maMon}")]
    public async Task<IActionResult> LayTheoMa(string maMon, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoMaAsync(maMon, cancellationToken) });

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoThucDonDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });
}
