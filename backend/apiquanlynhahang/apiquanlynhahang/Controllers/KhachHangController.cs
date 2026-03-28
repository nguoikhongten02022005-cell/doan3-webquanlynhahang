using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/khach-hang")]
public class KhachHangController : ControllerBase
{
    private readonly KhachHangService _service;

    public KhachHangController(KhachHangService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [Authorize]
    [HttpGet("{maKh}")]
    public async Task<IActionResult> LayTheoMa(string maKh, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoMaAsync(maKh, cancellationToken) });

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoKhachHangDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });
}
