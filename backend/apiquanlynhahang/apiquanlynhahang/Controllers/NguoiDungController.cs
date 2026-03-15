using apiquanlynhahang.DTOs;
using apiquanlynhahang.Models;
using apiquanlynhahang.Services;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/nguoi-dung")]
public class NguoiDungController : ControllerBase
{
    private readonly NguoiDungService _service;

    public NguoiDungController(NguoiDungService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
    {
        var danhSach = await _service.LayDanhSachAsync(cancellationToken);
        return Ok(new { data = danhSach.Select(Map), meta = new { total = danhSach.Count } });
    }

    [HttpGet("me")]
    public async Task<IActionResult> LayNguoiDungHienTai([FromQuery] string email, CancellationToken cancellationToken)
    {
        var nguoiDung = await _service.LayTheoEmailAsync(email, cancellationToken);
        return nguoiDung is null ? NotFound(new { message = "Khong tim thay nguoi dung" }) : Ok(new { data = Map(nguoiDung) });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> LayTheoId(int id, CancellationToken cancellationToken)
    {
        var nguoiDung = await _service.LayTheoIdAsync(id, cancellationToken);
        return nguoiDung is null ? NotFound(new { message = "Khong tim thay nguoi dung" }) : Ok(new { data = Map(nguoiDung) });
    }

    [HttpPatch("{id:int}/role")]
    public async Task<IActionResult> CapNhatVaiTro(int id, [FromBody] CapNhatVaiTroNguoiDungDto dto, CancellationToken cancellationToken)
    {
        var nguoiDung = await _service.CapNhatVaiTroAsync(id, dto.VaiTro, cancellationToken);
        return nguoiDung is null ? NotFound(new { message = "Khong tim thay nguoi dung" }) : Ok(new { message = "Cap nhat vai tro thanh cong", data = Map(nguoiDung) });
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> CapNhatTrangThai(int id, [FromBody] CapNhatTrangThaiNguoiDungDto dto, CancellationToken cancellationToken)
    {
        var nguoiDung = await _service.CapNhatTrangThaiAsync(id, dto.TrangThai, cancellationToken);
        return nguoiDung is null ? NotFound(new { message = "Khong tim thay nguoi dung" }) : Ok(new { message = "Cap nhat trang thai thanh cong", data = Map(nguoiDung) });
    }

    private static object Map(NguoiDung entity) => new
    {
        entity.Id,
        entity.HoTen,
        entity.TenDangNhap,
        entity.Email,
        entity.VaiTro,
        entity.TrangThai,
        entity.SoDienThoai,
        entity.TaoLuc,
        entity.CapNhatLuc,
    };
}
