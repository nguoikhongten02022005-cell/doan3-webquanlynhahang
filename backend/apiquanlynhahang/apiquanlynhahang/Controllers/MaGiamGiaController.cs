using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/ma-giam-gia")]
public class MaGiamGiaController : ControllerBase
{
    private readonly MaGiamGiaService _service;

    public MaGiamGiaController(MaGiamGiaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [HttpGet("{maCode}")]
    public async Task<IActionResult> LayTheoMa(string maCode, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoMaAsync(maCode, cancellationToken) });

    [HttpPost("validate")]
    public async Task<IActionResult> KiemTra([FromBody] KiemTraMaGiamGiaRequest dto, CancellationToken cancellationToken)
    {
        var ketQua = await _service.KiemTraAsync(dto.MaCode, dto.TongTien, cancellationToken);
        return ketQua.Voucher is null ? BadRequest(new { message = ketQua.Loi }) : Ok(new { data = ketQua.Voucher });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoMaGiamGiaDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });
}
