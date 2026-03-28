using apiquanlynhahang.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/bao-cao")]
[Authorize(Roles = "Admin,NhanVien")]
public class BaoCaoController : ControllerBase
{
    private readonly BaoCaoService _service;

    public BaoCaoController(BaoCaoService service)
    {
        _service = service;
    }

    [HttpGet("tong-quan")]
    public async Task<IActionResult> TongQuan(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTongQuanAsync(cancellationToken) });

    [HttpGet("doanh-thu-ngay")]
    public async Task<IActionResult> DoanhThuNgay(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDoanhThuNgayAsync(cancellationToken) });

    [HttpGet("mon-ban-chay")]
    public async Task<IActionResult> MonBanChay(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayMonBanChayAsync(cancellationToken) });

    [HttpGet("tinh-trang-ban")]
    public async Task<IActionResult> TinhTrangBan(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTinhTrangBanAsync(cancellationToken) });
}
