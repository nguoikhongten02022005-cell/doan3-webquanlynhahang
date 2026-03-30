using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/ban")]
public class BanController : ControllerBase
{
    private readonly BanService _service;

    public BanController(BanService service)
    {
        _service = service;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> LayDanhSach(CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayDanhSachAsync(cancellationToken) });

    [AllowAnonymous]
    [HttpGet("{maBan}")]
    public async Task<IActionResult> LayTheoMa(string maBan, CancellationToken cancellationToken)
        => Ok(new { data = await _service.LayTheoMaAsync(maBan, cancellationToken) });

    [AllowAnonymous]
    [HttpGet("{maBan}/thuc-don")]
    public async Task<IActionResult> LayThucDonTaiBan(string maBan, [FromServices] DonHangService donHangService, CancellationToken cancellationToken)
    {
        var ban = await _service.LayTheoMaAsync(maBan, cancellationToken);
        if (ban is null) return NotFound(new { message = "Bàn không tồn tại" });
        return Ok(new { ban, data = await donHangService.LayThucDonChoBanAsync(cancellationToken) });
    }

    [AllowAnonymous]
    [HttpPost("{maBan}/order")]
    public async Task<IActionResult> TaoOrderTaiBan(string maBan, [FromBody] TaoOrderTaiBanDto dto, [FromServices] DonHangService donHangService, CancellationToken cancellationToken)
    {
        var ban = await _service.LayTheoMaAsync(maBan, cancellationToken);
        if (ban is null) return NotFound(new { message = "Bàn không tồn tại" });
        return Ok(new { data = await donHangService.TaoHoacThemMonTaiBanAsync(maBan, dto, cancellationToken) });
    }

    [AllowAnonymous]
    [HttpGet("{maBan}/order")]
    public async Task<IActionResult> LayOrderDangMoTaiBan(string maBan, [FromServices] DonHangService donHangService, CancellationToken cancellationToken)
    {
        var ban = await _service.LayTheoMaAsync(maBan, cancellationToken);
        if (ban is null) return NotFound(new { message = "Bàn không tồn tại" });
        return Ok(new { data = await donHangService.LayDonTaiBanDangMoAsync(maBan, cancellationToken) });
    }

    [AllowAnonymous]
    [HttpPost("{maBan}/yeu-cau-thanh-toan")]
    public async Task<IActionResult> YeuCauThanhToanTaiBan(string maBan, [FromServices] DonHangService donHangService, CancellationToken cancellationToken)
    {
        var ban = await _service.LayTheoMaAsync(maBan, cancellationToken);
        if (ban is null) return NotFound(new { message = "Bàn không tồn tại" });
        return Ok(new { success = await donHangService.YeuCauThanhToanTaiBanAsync(maBan, cancellationToken) });
    }

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPost("{maBan}/xac-nhan-thanh-toan")]
    public async Task<IActionResult> XacNhanThanhToanTaiBan(string maBan, [FromServices] DonHangService donHangService, CancellationToken cancellationToken)
    {
        var ban = await _service.LayTheoMaAsync(maBan, cancellationToken);
        if (ban is null) return NotFound(new { message = "Bàn không tồn tại" });
        return Ok(new { success = await donHangService.XacNhanThanhToanTaiBanAsync(maBan, cancellationToken) });
    }

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoBanDto dto, CancellationToken cancellationToken)
        => StatusCode(201, new { data = await _service.TaoAsync(dto, cancellationToken) });

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPut("{maBan}")]
    public async Task<IActionResult> CapNhat(string maBan, [FromBody] CapNhatBanDto dto, CancellationToken cancellationToken)
    {
        var duLieu = await _service.CapNhatAsync(maBan, dto, cancellationToken);
        return duLieu is null ? NotFound(new { message = "Khong tim thay ban" }) : Ok(new { data = duLieu });
    }

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpDelete("{maBan}")]
    public async Task<IActionResult> Xoa(string maBan, CancellationToken cancellationToken)
    {
        await _service.XoaAsync(maBan, cancellationToken);
        return NoContent();
    }

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpPatch("{maBan}/status")]
    public async Task<IActionResult> CapNhatTrangThai(string maBan, [FromBody] CapNhatTrangThaiDto dto, CancellationToken cancellationToken)
        => Ok(new { data = await _service.CapNhatTrangThaiAsync(maBan, dto.TrangThai, cancellationToken) });

    [Authorize(Roles = "Admin,NhanVien")]
    [HttpGet("{maBan}/qr")]
    public async Task<IActionResult> LayQrTheoBan(string maBan, CancellationToken cancellationToken)
    {
        var scheme = Request.Scheme;
        var host = Request.Host.HasValue ? Request.Host.Value : "localhost:5173";
        var duLieu = await _service.TaoQrAsync(maBan, $"{scheme}://{host}", cancellationToken);
        return duLieu is null ? NotFound(new { message = "Khong tim thay ban" }) : Ok(new { data = duLieu });
    }
}
