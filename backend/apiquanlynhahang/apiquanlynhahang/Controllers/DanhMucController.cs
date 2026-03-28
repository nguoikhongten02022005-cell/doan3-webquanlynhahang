using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/danh-muc")]
public class DanhMucController : ControllerBase
{
    private readonly DanhMucService _service;

    public DanhMucController(DanhMucService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [HttpGet("{maDanhMuc}")]
    public async Task<IActionResult> LayTheoMa(string maDanhMuc, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoMaAsync(maDanhMuc, cancellationToken) });

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoDanhMucDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });
}
