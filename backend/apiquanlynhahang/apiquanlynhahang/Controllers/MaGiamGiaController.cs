using apiquanlynhahang.DTOs;
using apiquanlynhahang.Models;
using apiquanlynhahang.Services;
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

    [Authorize(Roles = "admin,staff")]
    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
    {
        var danhSach = await _service.LayDanhSachAsync(cancellationToken);
        return Ok(new { data = danhSach.Select(Map), meta = new { total = danhSach.Count } });
    }

    [HttpGet("{maGiam}")]
    public async Task<IActionResult> LayTheoCode(string maGiam, CancellationToken cancellationToken)
    {
        var voucher = await _service.LayTheoCodeAsync(maGiam, cancellationToken);
        return voucher is null ? NotFound(new { message = "Khong tim thay ma giam gia" }) : Ok(new { data = Map(voucher) });
    }

    [HttpPost("validate")]
    public async Task<IActionResult> KiemTra([FromBody] KiemTraMaGiamGiaDto dto, CancellationToken cancellationToken)
    {
        var (voucher, loi) = await _service.KiemTraAsync(dto.MaGiam, dto.GiaTriDonHang, cancellationToken);
        return voucher is null ? BadRequest(new { message = loi }) : Ok(new { message = "Kiem tra ma giam gia thanh cong", data = Map(voucher) });
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoMaGiamGiaDto dto, CancellationToken cancellationToken)
    {
        var voucher = await _service.TaoAsync(dto, cancellationToken);
        return StatusCode(201, new { message = "Tao ma giam gia thanh cong", data = Map(voucher) });
    }

    [Authorize(Roles = "admin")]
    [HttpPatch("{id:int}")]
    public async Task<IActionResult> CapNhat(int id, [FromBody] CapNhatMaGiamGiaDto dto, CancellationToken cancellationToken)
    {
        var voucher = await _service.CapNhatAsync(id, dto, cancellationToken);
        return voucher is null ? NotFound(new { message = "Khong tim thay ma giam gia" }) : Ok(new { message = "Cap nhat ma giam gia thanh cong", data = Map(voucher) });
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Xoa(int id, CancellationToken cancellationToken)
    {
        var daXoa = await _service.XoaAsync(id, cancellationToken);
        return daXoa ? Ok(new { message = "Xoa ma giam gia thanh cong", data = (object?)null }) : NotFound(new { message = "Khong tim thay ma giam gia" });
    }

    private static object Map(MaGiamGia voucher) => new
    {
        voucher.Id,
        voucher.MaGiam,
        voucher.TenMaGiam,
        voucher.MoTa,
        voucher.LoaiGiam,
        voucher.GiaTriGiam,
        voucher.DonToiThieu,
        voucher.GiamToiDa,
        voucher.BatDauLuc,
        voucher.KetThucLuc,
        voucher.GioiHanSuDung,
        voucher.DaSuDung,
        voucher.DangHoatDong,
        voucher.TaoLuc,
        voucher.CapNhatLuc,
    };
}
