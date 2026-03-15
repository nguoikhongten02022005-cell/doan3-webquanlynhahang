using apiquanlynhahang.Services;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/mon-an")]
public class MonAnController : ControllerBase
{
    private readonly IMonAnService _monAnService;

    public MonAnController(IMonAnService monAnService)
    {
        _monAnService = monAnService;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
    {
        var danhSach = await _monAnService.LayDanhSachAsync(cancellationToken);

        return Ok(new
        {
            data = danhSach,
            meta = new
            {
                total = danhSach.Count,
            },
        });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> LayTheoId(int id, CancellationToken cancellationToken)
    {
        if (id <= 0)
        {
            return BadRequest(new
            {
                message = "Id mon an khong hop le",
            });
        }

        var monAn = await _monAnService.LayTheoIdAsync(id, cancellationToken);

        if (monAn is null)
        {
            return NotFound(new
            {
                message = "Khong tim thay mon an",
            });
        }

        return Ok(new
        {
            data = monAn,
        });
    }
}
