using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.Common;
using apiquanlynhahang.DTOs.Requests;
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

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [Authorize]
    [HttpGet("{maDonHang}")]
    public async Task<IActionResult> LayTheoMa(string maDonHang, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoMaAsync(maDonHang, cancellationToken), chiTiet = await _service.LayChiTietAsync(maDonHang, cancellationToken) });

    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoDonHangDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPatch("{maDonHang}/status")]
    public async Task<IActionResult> CapNhatTrangThai(string maDonHang, [FromBody] CapNhatTrangThaiDto dto, CancellationToken cancellationToken)
        => Ok(new { data = await _service.CapNhatTrangThaiAsync(maDonHang, dto.TrangThai, User.LayNguoiDungHienTai()?.MaND, cancellationToken) });
}
