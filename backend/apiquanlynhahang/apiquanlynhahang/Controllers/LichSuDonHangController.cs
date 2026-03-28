using apiquanlynhahang.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/lich-su-don-hang")]
[Authorize(Roles = "Admin,NhanVien")]
public class LichSuDonHangController : ControllerBase
{
    private readonly LichSuDonHangService _service;

    public LichSuDonHangController(LichSuDonHangService service)
    {
        _service = service;
    }

    [HttpGet("{maDonHang}")]
    public async Task<IActionResult> LayTheoDon(string maDonHang, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoDonAsync(maDonHang, cancellationToken) });
}
