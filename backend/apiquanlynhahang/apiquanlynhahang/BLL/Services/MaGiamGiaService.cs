using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class MaGiamGiaService
{
    private readonly UngDungDbContext _dbContext;

    public MaGiamGiaService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<MaGiamGia>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.MaGiamGia.AsNoTracking().OrderBy(x => x.MaCode).ToListAsync(cancellationToken);

    public Task<MaGiamGia?> LayTheoMaAsync(string maCode, CancellationToken cancellationToken = default)
        => _dbContext.MaGiamGia.AsNoTracking().FirstOrDefaultAsync(x => x.MaCode == maCode, cancellationToken);

    public async Task<(MaGiamGia? Voucher, string? Loi)> KiemTraAsync(string maCode, decimal tongTien, CancellationToken cancellationToken = default)
    {
        var voucher = await _dbContext.MaGiamGia.FirstOrDefaultAsync(x => x.MaCode == maCode, cancellationToken);
        if (voucher is null) return (null, "Khong tim thay ma giam gia");

        var homNay = DateOnly.FromDateTime(DateTime.UtcNow);
        if (voucher.TrangThai != "Active") return (null, "Ma giam gia khong hoat dong");
        if (homNay < voucher.NgayBatDau || homNay > voucher.NgayKetThuc) return (null, "Ma giam gia khong nam trong thoi gian ap dung");
        if (tongTien < voucher.DonHangToiThieu) return (null, "Don hang chua dat gia tri toi thieu");
        if (voucher.SoLanToiDa.HasValue && voucher.SoLanDaDung >= voucher.SoLanToiDa.Value) return (null, "Ma giam gia da het luot dung");

        return (voucher, null);
    }

    public async Task<MaGiamGia> TaoAsync(TaoMaGiamGiaDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new MaGiamGia
        {
            MaCode = dto.MaCode,
            TenCode = dto.TenCode,
            GiaTri = dto.GiaTri,
            LoaiGiam = dto.LoaiGiam,
            GiaTriToiDa = dto.GiaTriToiDa,
            DonHangToiThieu = dto.DonHangToiThieu,
            NgayBatDau = dto.NgayBatDau,
            NgayKetThuc = dto.NgayKetThuc,
            SoLanToiDa = dto.SoLanToiDa,
            SoLanDaDung = 0,
            TrangThai = "Active",
        };

        _dbContext.MaGiamGia.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
