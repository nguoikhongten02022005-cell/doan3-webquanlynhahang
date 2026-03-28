using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/danh-gia")]
public class DanhGiaController : ControllerBase
{
    private readonly DanhGiaService _service;

    public DanhGiaController(DanhGiaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoDanhGiaDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPatch("{maDanhGia}/duyet")]
    public async Task<IActionResult> Duyet(string maDanhGia, [FromBody] DuyetDanhGiaRequest dto, CancellationToken cancellationToken)
        => Ok(new { data = await _service.DuyetAsync(maDanhGia, dto.TrangThai, dto.PhanHoi, cancellationToken) });
}
