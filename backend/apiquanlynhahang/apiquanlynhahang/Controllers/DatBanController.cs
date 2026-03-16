using apiquanlynhahang.DTOs;
using apiquanlynhahang.Common;
using apiquanlynhahang.Models;
using apiquanlynhahang.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace apiquanlynhahang.Controllers;

[ApiController]
[Route("api/dat-ban")]
public class DatBanController : ControllerBase
{
    private readonly DatBanService _service;

    public DatBanController(DatBanService service)
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
    [HttpGet("history")]
    public async Task<IActionResult> LayLichSu(CancellationToken cancellationToken)
    {
        var currentUser = User.LayNguoiDungHienTai();
        if (currentUser is null)
        {
            return Unauthorized(new { message = "Khong xac dinh duoc nguoi dung hien tai" });
        }

        var danhSach = await _service.LayLichSuTheoEmailAsync(currentUser.Email, cancellationToken);
        return Ok(new { data = danhSach.Select(Map), meta = new { total = danhSach.Count } });
    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> LayTheoId(int id, CancellationToken cancellationToken)
    {
        var entity = await _service.LayTheoIdAsync(id, cancellationToken);
        return entity is null ? NotFound(new { message = "Khong tim thay dat ban" }) : Ok(new { data = Map(entity) });
    }

    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoDatBanDto dto, CancellationToken cancellationToken)
    {
        var entity = await _service.TaoAsync(dto, cancellationToken);
        return StatusCode(201, new { message = "Tao dat ban thanh cong", data = Map(entity) });
    }

    [Authorize(Roles = "admin,staff")]
    [HttpPatch("{id:int}")]
    public async Task<IActionResult> CapNhat(int id, [FromBody] CapNhatDatBanDto dto, CancellationToken cancellationToken)
    {
        var entity = await _service.CapNhatAsync(id, dto, cancellationToken);
        return entity is null ? NotFound(new { message = "Khong tim thay dat ban" }) : Ok(new { message = "Cap nhat dat ban thanh cong", data = Map(entity) });
    }

    [Authorize]
    [HttpPatch("{id:int}/cancel")]
    public async Task<IActionResult> Huy(int id, CancellationToken cancellationToken)
    {
        var entity = await _service.HuyBoAsync(id, cancellationToken);
        return entity is null ? NotFound(new { message = "Khong tim thay dat ban" }) : Ok(new { message = "Huy dat ban thanh cong", data = Map(entity) });
    }

    [Authorize(Roles = "admin,staff")]
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> CapNhatTrangThai(int id, [FromBody] CapNhatTrangThaiDatBanDto dto, CancellationToken cancellationToken)
    {
        var entity = await _service.CapNhatTrangThaiAsync(id, dto.TrangThai, cancellationToken);
        return entity is null ? NotFound(new { message = "Khong tim thay dat ban" }) : Ok(new { message = "Cap nhat trang thai dat ban thanh cong", data = Map(entity) });
    }

    [Authorize(Roles = "admin,staff")]
    [HttpPatch("{id:int}/assign-tables")]
    public async Task<IActionResult> GanBan(int id, [FromBody] GanBanChoDatBanDto dto, CancellationToken cancellationToken)
    {
        var entity = await _service.GanBanAsync(id, dto.DanhSachBanAnId, cancellationToken);
        return entity is null ? NotFound(new { message = "Khong tim thay dat ban" }) : Ok(new { message = "Gan ban thanh cong", data = Map(entity) });
    }

    [Authorize(Roles = "admin,staff")]
    [HttpPatch("{id:int}/check-in")]
    public Task<IActionResult> CheckIn(int id, CancellationToken cancellationToken)
        => CapNhatTrangThai(id, new CapNhatTrangThaiDatBanDto { TrangThai = "DA_CHECK_IN" }, cancellationToken);

    [Authorize(Roles = "admin,staff")]
    [HttpPatch("{id:int}/complete")]
    public Task<IActionResult> HoanThanh(int id, CancellationToken cancellationToken)
        => CapNhatTrangThai(id, new CapNhatTrangThaiDatBanDto { TrangThai = "DA_HOAN_THANH" }, cancellationToken);

    [Authorize(Roles = "admin,staff")]
    [HttpPatch("{id:int}/no-show")]
    public Task<IActionResult> KhongDen(int id, CancellationToken cancellationToken)
        => CapNhatTrangThai(id, new CapNhatTrangThaiDatBanDto { TrangThai = "KHONG_DEN" }, cancellationToken);

    private static object Map(DatBan entity) => new
    {
        entity.Id,
        entity.MaDatBan,
        entity.SoKhach,
        entity.NgayDat,
        entity.GioDat,
        entity.KhuVucUuTien,
        entity.GhiChu,
        entity.TenKhach,
        entity.SoDienThoaiKhach,
        entity.EmailKhach,
        entity.TrangThai,
        entity.NguonTao,
        entity.EmailNguoiDung,
        entity.DipDacBiet,
        entity.KenhXacNhan,
        entity.GhiChuNoiBo,
        entity.CheckInLuc,
        entity.XepBanLuc,
        entity.HoanThanhLuc,
        entity.HuyLuc,
        entity.VangMatLuc,
        entity.TaoBoi,
        entity.NguoiDungId,
        entity.TaoLuc,
        entity.CapNhatLuc,
    };
}
