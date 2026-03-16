using apiquanlynhahang.DTOs;
using apiquanlynhahang.Models;
using apiquanlynhahang.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api")]
[Authorize(Roles = "admin,staff")]
public class KhoController : ControllerBase
{
    private readonly KhoService _khoService;

    public KhoController(KhoService khoService)
    {
        _khoService = khoService;
    }

    [HttpGet("nguyen-lieu")]
    public async Task<IActionResult> LayDanhSachNguyenLieu(CancellationToken cancellationToken)
    {
        var danhSach = await _khoService.LayDanhSachNguyenLieuAsync(cancellationToken);
        return Ok(new { data = danhSach.Select(MapNguyenLieu), meta = new { total = danhSach.Count } });
    }

    [HttpGet("nguyen-lieu/canh-bao")]
    public async Task<IActionResult> LayCanhBaoTonThap(CancellationToken cancellationToken)
    {
        var danhSach = await _khoService.LayCanhBaoTonThapAsync(cancellationToken);
        return Ok(new { data = danhSach.Select(MapNguyenLieu), meta = new { total = danhSach.Count } });
    }

    [HttpGet("nguyen-lieu/{id:int}")]
    public async Task<IActionResult> LayNguyenLieuTheoId(int id, CancellationToken cancellationToken)
    {
        var nguyenLieu = await _khoService.LayNguyenLieuTheoIdAsync(id, cancellationToken);
        return nguyenLieu is null ? NotFound(new { message = "Khong tim thay nguyen lieu" }) : Ok(new { data = MapNguyenLieu(nguyenLieu) });
    }

    [HttpPost("nguyen-lieu")]
    public async Task<IActionResult> TaoNguyenLieu([FromBody] TaoNguyenLieuDto dto, CancellationToken cancellationToken)
    {
        var nguyenLieu = await _khoService.TaoNguyenLieuAsync(dto, cancellationToken);
        return StatusCode(201, new { message = "Tao nguyen lieu thanh cong", data = MapNguyenLieu(nguyenLieu) });
    }

    [HttpPatch("nguyen-lieu/{id:int}")]
    public async Task<IActionResult> CapNhatNguyenLieu(int id, [FromBody] CapNhatNguyenLieuDto dto, CancellationToken cancellationToken)
    {
        var nguyenLieu = await _khoService.CapNhatNguyenLieuAsync(id, dto, cancellationToken);
        return nguyenLieu is null ? NotFound(new { message = "Khong tim thay nguyen lieu" }) : Ok(new { message = "Cap nhat nguyen lieu thanh cong", data = MapNguyenLieu(nguyenLieu) });
    }

    [HttpDelete("nguyen-lieu/{id:int}")]
    public async Task<IActionResult> XoaNguyenLieu(int id, CancellationToken cancellationToken)
    {
        var daXoa = await _khoService.XoaNguyenLieuAsync(id, cancellationToken);
        return daXoa ? Ok(new { message = "Xoa nguyen lieu thanh cong" }) : NotFound(new { message = "Khong tim thay nguyen lieu" });
    }

    [HttpGet("phieu-nhap-kho")]
    public async Task<IActionResult> LayDanhSachPhieuNhap(CancellationToken cancellationToken)
    {
        var danhSach = await _khoService.LayDanhSachPhieuNhapAsync(cancellationToken);
        return Ok(new { data = danhSach.Select(MapPhieuNhap), meta = new { total = danhSach.Count } });
    }

    [HttpGet("phieu-nhap-kho/{id:int}")]
    public async Task<IActionResult> LayChiTietPhieuNhap(int id, CancellationToken cancellationToken)
    {
        var chiTiet = await _khoService.LayChiTietPhieuNhapAsync(id, cancellationToken);
        return Ok(new { data = chiTiet.Select(MapChiTietNhapKho), meta = new { total = chiTiet.Count } });
    }

    [HttpPost("phieu-nhap-kho")]
    public async Task<IActionResult> TaoPhieuNhap([FromBody] TaoPhieuNhapKhoDto dto, CancellationToken cancellationToken)
    {
        var phieuNhap = await _khoService.TaoPhieuNhapAsync(dto, cancellationToken);
        return StatusCode(201, new { message = "Tao phieu nhap kho thanh cong", data = MapPhieuNhap(phieuNhap) });
    }

    [HttpGet("cong-thuc-mon/{monAnId:int}")]
    public async Task<IActionResult> LayCongThucTheoMon(int monAnId, CancellationToken cancellationToken)
    {
        var danhSach = await _khoService.LayCongThucTheoMonAsync(monAnId, cancellationToken);
        return Ok(new { data = danhSach.Select(MapCongThuc), meta = new { total = danhSach.Count } });
    }

    [HttpPost("cong-thuc-mon")]
    public async Task<IActionResult> TaoCongThuc([FromBody] TaoCongThucMonAnDto dto, CancellationToken cancellationToken)
    {
        var congThuc = await _khoService.TaoCongThucAsync(dto, cancellationToken);
        return StatusCode(201, new { message = "Tao cong thuc mon an thanh cong", data = MapCongThuc(congThuc) });
    }

    [HttpPatch("cong-thuc-mon/{id:int}")]
    public async Task<IActionResult> CapNhatCongThuc(int id, [FromBody] CapNhatCongThucMonAnDto dto, CancellationToken cancellationToken)
    {
        var congThuc = await _khoService.CapNhatCongThucAsync(id, dto, cancellationToken);
        return congThuc is null ? NotFound(new { message = "Khong tim thay cong thuc mon an" }) : Ok(new { message = "Cap nhat cong thuc mon an thanh cong", data = MapCongThuc(congThuc) });
    }

    [HttpDelete("cong-thuc-mon/{id:int}")]
    public async Task<IActionResult> XoaCongThuc(int id, CancellationToken cancellationToken)
    {
        var daXoa = await _khoService.XoaCongThucAsync(id, cancellationToken);
        return daXoa ? Ok(new { message = "Xoa cong thuc mon an thanh cong" }) : NotFound(new { message = "Khong tim thay cong thuc mon an" });
    }

    private static object MapNguyenLieu(NguyenLieu nguyenLieu) => new
    {
        nguyenLieu.Id,
        nguyenLieu.MaNguyenLieu,
        nguyenLieu.TenNguyenLieu,
        nguyenLieu.DonViTinh,
        nguyenLieu.SoLuongTon,
        nguyenLieu.MucCanhBaoToiThieu,
        nguyenLieu.TrangThai,
        nguyenLieu.GhiChu,
        nguyenLieu.TaoLuc,
        nguyenLieu.CapNhatLuc,
    };

    private static object MapPhieuNhap(PhieuNhapKho phieuNhap) => new
    {
        phieuNhap.Id,
        phieuNhap.MaPhieuNhap,
        phieuNhap.NgayNhap,
        phieuNhap.NhaCungCap,
        phieuNhap.GhiChu,
        phieuNhap.TongTien,
        phieuNhap.NguoiTaoId,
        phieuNhap.TaoLuc,
        phieuNhap.CapNhatLuc,
    };

    private static object MapChiTietNhapKho(ChiTietNhapKho chiTiet) => new
    {
        chiTiet.Id,
        chiTiet.PhieuNhapKhoId,
        chiTiet.NguyenLieuId,
        chiTiet.SoLuongNhap,
        chiTiet.DonGiaNhap,
        chiTiet.ThanhTien,
        chiTiet.GhiChu,
    };

    private static object MapCongThuc(CongThucMonAn congThuc) => new
    {
        congThuc.Id,
        congThuc.MonAnId,
        congThuc.NguyenLieuId,
        congThuc.DinhLuong,
        congThuc.DonViTinh,
        congThuc.GhiChu,
        congThuc.TaoLuc,
        congThuc.CapNhatLuc,
    };
}
