using apiquanlynhahang.DTOs;
using apiquanlynhahang.Services;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/qr/ban")]
public class QrController : ControllerBase
{
    private readonly BanAnService _banAnService;
    private readonly DonHangService _donHangService;
    private readonly IMonAnService _monAnService;

    public QrController(BanAnService banAnService, DonHangService donHangService, IMonAnService monAnService)
    {
        _banAnService = banAnService;
        _donHangService = donHangService;
        _monAnService = monAnService;
    }

    [HttpGet("{tokenQr}")]
    public async Task<IActionResult> LayThongTinBanTheoQr(string tokenQr, CancellationToken cancellationToken)
    {
        var ban = await _banAnService.LayTheoTokenQrAsync(tokenQr, cancellationToken);
        return ban is null
            ? NotFound(new { message = "Khong tim thay ban theo QR" })
            : Ok(new
            {
                data = new
                {
                    ban.Id,
                    ban.MaBan,
                    ban.MaQr,
                    ban.TokenQr,
                    ban.KichHoatQr,
                    ban.TenBan,
                    ban.KhuVucId,
                    ban.SucChua,
                    ban.TrangThai,
                }
            });
    }

    [HttpGet("{tokenQr}/mon-an")]
    public async Task<IActionResult> LayMonAnTheoBanQr(string tokenQr, CancellationToken cancellationToken)
    {
        var ban = await _banAnService.LayTheoTokenQrAsync(tokenQr, cancellationToken);
        if (ban is null || !ban.KichHoatQr)
        {
            return NotFound(new { message = "QR ban khong hop le hoac chua kich hoat" });
        }

        var monAn = await _monAnService.LayDanhSachAsync(cancellationToken);
        return Ok(new
        {
            data = new
            {
                ban = new { ban.Id, ban.MaBan, ban.TenBan, ban.TokenQr },
                monAn,
            }
        });
    }

    [HttpPost("{tokenQr}/don-hang")]
    public async Task<IActionResult> TaoDonHangQuaQr(string tokenQr, [FromBody] TaoDonHangDto dto, CancellationToken cancellationToken)
    {
        var ban = await _banAnService.LayTheoTokenQrAsync(tokenQr, cancellationToken);
        if (ban is null || !ban.KichHoatQr)
        {
            return NotFound(new { message = "QR ban khong hop le hoac chua kich hoat" });
        }

        dto.MaBan = ban.MaBan;
        var (donHang, loi) = await _donHangService.TaoAsync(dto, cancellationToken);
        return donHang is null
            ? BadRequest(new { message = loi })
            : StatusCode(201, new { message = "Tao don hang qua QR thanh cong", data = new { donHang.Id, donHang.MaDonHang, donHang.MaBan, donHang.ThanhTien, donHang.TrangThai } });
    }
}
