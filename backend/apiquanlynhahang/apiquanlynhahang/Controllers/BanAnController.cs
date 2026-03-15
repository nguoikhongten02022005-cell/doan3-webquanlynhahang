using apiquanlynhahang.DTOs;
using apiquanlynhahang.Models;
using apiquanlynhahang.Services;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/ban-an")]
public class BanAnController : ControllerBase
{
    private readonly BanAnService _banAnService;

    public BanAnController(BanAnService banAnService)
    {
        _banAnService = banAnService;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach([FromQuery] string? khuVucId, [FromQuery] string? trangThai, [FromQuery] uint? sucChuaToiThieu, CancellationToken cancellationToken)
    {
        var danhSach = await _banAnService.LayDanhSachAsync(khuVucId, trangThai, sucChuaToiThieu, cancellationToken);
        return Ok(new { data = danhSach.Select(Map), meta = new { total = danhSach.Count } });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> LayTheoId(string id, CancellationToken cancellationToken)
    {
        var ban = await _banAnService.LayTheoIdAsync(id, cancellationToken);
        return ban is null ? NotFound(new { message = "Khong tim thay ban an" }) : Ok(new { data = Map(ban) });
    }

    [HttpGet("available-for-booking/{datBanId:int}")]
    public async Task<IActionResult> LayBanKhaDung(int datBanId, CancellationToken cancellationToken)
    {
        var danhSach = await _banAnService.LayDanhSachKhaDungChoDatBanAsync(datBanId, cancellationToken);
        return Ok(new { data = danhSach.Select(Map), meta = new { total = danhSach.Count } });
    }

    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoBanAnDto dto, CancellationToken cancellationToken)
    {
        var ban = await _banAnService.TaoAsync(dto, cancellationToken);
        return StatusCode(201, new { message = "Tao ban thanh cong", data = Map(ban) });
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> CapNhat(string id, [FromBody] CapNhatBanAnDto dto, CancellationToken cancellationToken)
    {
        var ban = await _banAnService.CapNhatAsync(id, dto, cancellationToken);
        return ban is null ? NotFound(new { message = "Khong tim thay ban an" }) : Ok(new { message = "Cap nhat ban thanh cong", data = Map(ban) });
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> CapNhatTrangThai(string id, [FromBody] CapNhatTrangThaiBanAnDto dto, CancellationToken cancellationToken)
    {
        var ban = await _banAnService.CapNhatTrangThaiAsync(id, dto.TrangThai, cancellationToken);
        return ban is null ? NotFound(new { message = "Khong tim thay ban an" }) : Ok(new { message = "Cap nhat trang thai ban thanh cong", data = Map(ban) });
    }

    private static object Map(BanAn ban) => new
    {
        ban.Id,
        ban.MaBan,
        ban.TenBan,
        ban.KhuVucId,
        ban.SucChua,
        ban.TrangThai,
        ban.DatBanHienTaiId,
        ban.MaDatBanHienTai,
        ban.DangSuDungLuc,
        ban.GiaiPhongLuc,
        ban.GhiChu,
        ban.TaoLuc,
        ban.CapNhatLuc,
    };
}
