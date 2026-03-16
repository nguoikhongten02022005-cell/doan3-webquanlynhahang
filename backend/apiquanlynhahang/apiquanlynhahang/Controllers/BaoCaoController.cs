using apiquanlynhahang.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/bao-cao")]
[Authorize(Roles = "admin,staff")]
public class BaoCaoController : ControllerBase
{
    private readonly BaoCaoService _baoCaoService;

    public BaoCaoController(BaoCaoService baoCaoService)
    {
        _baoCaoService = baoCaoService;
    }

    [HttpGet("tong-quan")]
    public async Task<IActionResult> LayTongQuan([FromQuery] DateTime? tuNgay, [FromQuery] DateTime? denNgay, CancellationToken cancellationToken)
    {
        var duLieu = await _baoCaoService.LayTongQuanAsync(tuNgay, denNgay, cancellationToken);
        return Ok(new { data = duLieu });
    }

    [HttpGet("top-mon-ban-chay")]
    public async Task<IActionResult> LayTopMonBanChay([FromQuery] int top = 5, CancellationToken cancellationToken = default)
    {
        var duLieu = await _baoCaoService.LayTopMonBanChayAsync(top, cancellationToken);
        return Ok(new { data = duLieu, meta = new { total = duLieu.Count } });
    }

    [HttpGet("canh-bao-kho")]
    public async Task<IActionResult> LayCanhBaoKho(CancellationToken cancellationToken = default)
    {
        var duLieu = await _baoCaoService.LayCanhBaoKhoAsync(cancellationToken);
        return Ok(new { data = duLieu, meta = new { total = duLieu.Count } });
    }
}
