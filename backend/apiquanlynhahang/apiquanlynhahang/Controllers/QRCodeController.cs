using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/qr-code")]
public class QRCodeController : ControllerBase
{
    private readonly QRCodeService _service;

    public QRCodeController(QRCodeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [HttpGet("{maQr}")]
    public async Task<IActionResult> LayTheoMa(string maQr, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoMaAsync(maQr, cancellationToken) });

    [HttpGet("ban/{maBan}")]
    public async Task<IActionResult> LayTheoBan(string maBan, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoBanAsync(maBan, cancellationToken) });

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoQRCodeDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });
}
