using apiquanlynhahang.DTOs;
using apiquanlynhahang.Common;
using apiquanlynhahang.Models;
using apiquanlynhahang.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/don-hang")]
public class DonHangController : ControllerBase
{
    private readonly DonHangService _service;

    public DonHangController(DonHangService service)
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

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> LayDonHangCuaToi(CancellationToken cancellationToken)
    {
        var currentUser = User.LayNguoiDungHienTai();
        if (currentUser is null)
        {
            return Unauthorized(new { message = "Khong xac dinh duoc nguoi dung hien tai" });
        }

        var danhSach = await _service.LayDonHangCuaToiAsync(currentUser.Email, cancellationToken);
        return Ok(new { data = danhSach.Select(Map), meta = new { total = danhSach.Count } });
    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> LayTheoId(int id, CancellationToken cancellationToken)
    {
        var donHang = await _service.LayTheoIdAsync(id, cancellationToken);
        if (donHang is null)
        {
            return NotFound(new { message = "Khong tim thay don hang" });
        }

        var chiTiet = await _service.LayChiTietAsync(id, cancellationToken);
        return Ok(new { data = MapChiTiet(donHang, chiTiet) });
    }

    [HttpPost]
    [HttpPost("checkout")]
    public async Task<IActionResult> Tao([FromBody] TaoDonHangDto dto, CancellationToken cancellationToken)
    {
        var (donHang, loi) = await _service.TaoAsync(dto, cancellationToken);
        return donHang is null ? BadRequest(new { message = loi }) : StatusCode(201, new { message = "Tao don hang thanh cong", data = Map(donHang) });
    }

    [Authorize(Roles = "admin,staff")]
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> CapNhatTrangThai(int id, [FromBody] CapNhatTrangThaiDonHangDto dto, CancellationToken cancellationToken)
    {
        var donHang = await _service.CapNhatTrangThaiAsync(id, dto.TrangThai, cancellationToken);
        return donHang is null ? NotFound(new { message = "Khong tim thay don hang" }) : Ok(new { message = "Cap nhat trang thai don hang thanh cong", data = Map(donHang) });
    }

    private static object Map(DonHang entity) => new
    {
        entity.Id,
        entity.MaDonHang,
        entity.TamTinh,
        entity.PhiDichVu,
        entity.TienGiam,
        entity.MaGiamGiaApDung,
        entity.ThanhTien,
        entity.DatLuc,
        entity.TrangThai,
        entity.TrangThaiThanhToan,
        entity.GhiChu,
        entity.MaBan,
        entity.PhuongThucThanhToan,
        entity.EmailNguoiDung,
        entity.TenKhachHang,
        entity.SoDienThoaiKhachHang,
        entity.EmailKhachHang,
        entity.DiaChiKhachHang,
        entity.ThongTinKhachHang,
        entity.NguoiDungId,
        entity.TaoLuc,
        entity.CapNhatLuc,
    };

    private static object MapChiTiet(DonHang entity, List<ChiTietDonHang> chiTiet) => new
    {
        donHang = Map(entity),
        chiTiet = chiTiet.Select(x => new
        {
            x.Id,
            x.DonHangId,
            x.MonAnId,
            x.TenMon,
            x.DonGia,
            x.SoLuong,
            x.KichCo,
            x.ToppingDaChon,
            x.GhiChuMon,
            x.MaBienThe,
            x.ThongTinMon,
        }),
    };
}
