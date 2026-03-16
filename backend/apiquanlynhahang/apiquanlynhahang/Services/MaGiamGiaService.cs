using apiquanlynhahang.Data;
using apiquanlynhahang.Common;
using apiquanlynhahang.DTOs;
using apiquanlynhahang.Models;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Services;

public class MaGiamGiaService
{
    private readonly UngDungDbContext _dbContext;

    public MaGiamGiaService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<MaGiamGia>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.MaGiamGia.AsNoTracking().OrderByDescending(x => x.Id).ToListAsync(cancellationToken);

    public Task<MaGiamGia?> LayTheoCodeAsync(string maGiam, CancellationToken cancellationToken = default)
        => _dbContext.MaGiamGia.AsNoTracking().FirstOrDefaultAsync(x => x.MaGiam == maGiam, cancellationToken);

    public async Task<(MaGiamGia? Voucher, string? Loi)> KiemTraAsync(string maGiam, decimal giaTriDonHang, CancellationToken cancellationToken = default)
    {
        var voucher = await _dbContext.MaGiamGia.FirstOrDefaultAsync(x => x.MaGiam == maGiam, cancellationToken);
        if (voucher is null)
        {
            return (null, "Ma giam gia khong hop le");
        }

        var hienTai = DateTime.UtcNow;
        if (!voucher.DangHoatDong)
        {
            return (null, "Ma giam gia dang tam dung");
        }
        if (voucher.BatDauLuc.HasValue && voucher.BatDauLuc.Value > hienTai)
        {
            return (null, "Ma giam gia chua den thoi gian su dung");
        }
        if (voucher.KetThucLuc.HasValue && voucher.KetThucLuc.Value < hienTai)
        {
            return (null, "Ma giam gia da het han");
        }
        if (giaTriDonHang < voucher.DonToiThieu)
        {
            return (null, "Don hang chua dat gia tri toi thieu de ap ma");
        }
        if (voucher.GioiHanSuDung.HasValue && voucher.DaSuDung >= voucher.GioiHanSuDung.Value)
        {
            return (null, "Ma giam gia da het luot su dung");
        }

        return (voucher, null);
    }

    public async Task<MaGiamGia> TaoAsync(TaoMaGiamGiaDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.MaGiam) || string.IsNullOrWhiteSpace(dto.TenMaGiam))
        {
            throw new ApiException(400, "Ma giam va ten ma giam la bat buoc");
        }

        var daTonTai = await _dbContext.MaGiamGia.AnyAsync(x => x.MaGiam == dto.MaGiam, cancellationToken);
        if (daTonTai)
        {
            throw new ApiException(409, "Ma giam gia da ton tai");
        }

        var entity = new MaGiamGia
        {
            MaGiam = dto.MaGiam,
            TenMaGiam = dto.TenMaGiam,
            MoTa = dto.MoTa,
            LoaiGiam = dto.LoaiGiam,
            GiaTriGiam = dto.GiaTriGiam,
            DonToiThieu = dto.DonToiThieu,
            GiamToiDa = dto.GiamToiDa,
            BatDauLuc = dto.BatDauLuc,
            KetThucLuc = dto.KetThucLuc,
            GioiHanSuDung = dto.GioiHanSuDung,
            DaSuDung = 0,
            DangHoatDong = dto.DangHoatDong,
            TaoLuc = DateTime.UtcNow,
            CapNhatLuc = DateTime.UtcNow,
        };

        _dbContext.MaGiamGia.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<MaGiamGia?> CapNhatAsync(int id, CapNhatMaGiamGiaDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.MaGiamGia.FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        if (string.IsNullOrWhiteSpace(dto.MaGiam) || string.IsNullOrWhiteSpace(dto.TenMaGiam))
        {
            throw new ApiException(400, "Ma giam va ten ma giam la bat buoc");
        }

        entity.MaGiam = dto.MaGiam;
        entity.TenMaGiam = dto.TenMaGiam;
        entity.MoTa = dto.MoTa;
        entity.LoaiGiam = dto.LoaiGiam;
        entity.GiaTriGiam = dto.GiaTriGiam;
        entity.DonToiThieu = dto.DonToiThieu;
        entity.GiamToiDa = dto.GiamToiDa;
        entity.BatDauLuc = dto.BatDauLuc;
        entity.KetThucLuc = dto.KetThucLuc;
        entity.GioiHanSuDung = dto.GioiHanSuDung;
        entity.DangHoatDong = dto.DangHoatDong;
        entity.CapNhatLuc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<bool> XoaAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.MaGiamGia.FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        _dbContext.MaGiamGia.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
