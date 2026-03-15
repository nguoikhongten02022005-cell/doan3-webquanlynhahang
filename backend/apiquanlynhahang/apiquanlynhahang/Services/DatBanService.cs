using apiquanlynhahang.Data;
using apiquanlynhahang.DTOs;
using apiquanlynhahang.Models;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Services;

public class DatBanService
{
    private readonly UngDungDbContext _dbContext;

    public DatBanService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<DatBan>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.DatBan.AsNoTracking().OrderByDescending(x => x.Id).ToListAsync(cancellationToken);

    public Task<List<DatBan>> LayLichSuTheoEmailAsync(string email, CancellationToken cancellationToken = default)
        => _dbContext.DatBan.AsNoTracking().Where(x => x.EmailKhach == email || x.EmailNguoiDung == email).OrderByDescending(x => x.Id).ToListAsync(cancellationToken);

    public Task<DatBan?> LayTheoIdAsync(int id, CancellationToken cancellationToken = default)
        => _dbContext.DatBan.AsNoTracking().FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);

    public async Task<DatBan> TaoAsync(TaoDatBanDto dto, CancellationToken cancellationToken = default)
    {
        var ma = $"BK-{DateTime.UtcNow:yyyyMMddHHmmss}";
        var entity = new DatBan
        {
            MaDatBan = ma,
            SoKhach = dto.SoKhach,
            NgayDat = dto.NgayDat,
            GioDat = dto.GioDat,
            KhuVucUuTien = dto.KhuVucUuTien,
            GhiChu = dto.GhiChu,
            TenKhach = dto.TenKhach,
            SoDienThoaiKhach = dto.SoDienThoaiKhach,
            EmailKhach = dto.EmailKhach,
            TrangThai = dto.TrangThai,
            NguonTao = dto.NguonTao,
            EmailNguoiDung = dto.EmailNguoiDung,
            DipDacBiet = dto.DipDacBiet,
            KenhXacNhan = dto.KenhXacNhan,
            GhiChuNoiBo = dto.GhiChuNoiBo,
            TaoBoi = string.IsNullOrWhiteSpace(dto.TaoBoi) ? dto.EmailNguoiDung ?? "web" : dto.TaoBoi,
            NguoiDungId = dto.NguoiDungId,
            TaoLuc = DateTime.UtcNow,
            CapNhatLuc = DateTime.UtcNow,
        };

        _dbContext.DatBan.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<DatBan?> CapNhatAsync(int id, CapNhatDatBanDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.DatBan.FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        if (dto.SoKhach.HasValue) entity.SoKhach = dto.SoKhach.Value;
        if (dto.NgayDat.HasValue) entity.NgayDat = dto.NgayDat.Value;
        if (dto.GioDat.HasValue) entity.GioDat = dto.GioDat.Value;
        if (!string.IsNullOrWhiteSpace(dto.KhuVucUuTien)) entity.KhuVucUuTien = dto.KhuVucUuTien;
        if (dto.GhiChu is not null) entity.GhiChu = dto.GhiChu;
        if (!string.IsNullOrWhiteSpace(dto.TenKhach)) entity.TenKhach = dto.TenKhach;
        if (!string.IsNullOrWhiteSpace(dto.SoDienThoaiKhach)) entity.SoDienThoaiKhach = dto.SoDienThoaiKhach;
        if (dto.EmailKhach is not null) entity.EmailKhach = dto.EmailKhach;
        if (dto.DipDacBiet is not null) entity.DipDacBiet = dto.DipDacBiet;
        if (dto.GhiChuNoiBo is not null) entity.GhiChuNoiBo = dto.GhiChuNoiBo;
        entity.CapNhatLuc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<DatBan?> CapNhatTrangThaiAsync(int id, string trangThai, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.DatBan.FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        entity.TrangThai = trangThai;
        var hienTai = DateTime.UtcNow;
        if (trangThai == "DA_CHECK_IN") entity.CheckInLuc = hienTai;
        if (trangThai == "DA_XEP_BAN") entity.XepBanLuc = hienTai;
        if (trangThai == "DA_HOAN_THANH") entity.HoanThanhLuc = hienTai;
        if (trangThai == "DA_HUY") entity.HuyLuc = hienTai;
        if (trangThai == "KHONG_DEN") entity.VangMatLuc = hienTai;
        entity.CapNhatLuc = hienTai;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public Task<DatBan?> HuyBoAsync(int id, CancellationToken cancellationToken = default)
        => CapNhatTrangThaiAsync(id, "DA_HUY", cancellationToken);

    public async Task<DatBan?> GanBanAsync(int id, List<string> danhSachBanAnId, CancellationToken cancellationToken = default)
    {
        var datBan = await _dbContext.DatBan.FirstOrDefaultAsync(x => x.Id == (uint)id, cancellationToken);
        if (datBan is null)
        {
            return null;
        }

        var chiTietCu = await _dbContext.ChiTietDatBan.Where(x => x.DatBanId == datBan.Id).ToListAsync(cancellationToken);
        _dbContext.ChiTietDatBan.RemoveRange(chiTietCu);

        var danhSachBan = await _dbContext.BanAn.Where(x => danhSachBanAnId.Contains(x.Id)).ToListAsync(cancellationToken);
        foreach (var ban in danhSachBan)
        {
            _dbContext.ChiTietDatBan.Add(new ChiTietDatBan
            {
                DatBanId = datBan.Id,
                BanAnId = ban.Id,
                GanLuc = DateTime.UtcNow,
            });

            ban.DatBanHienTaiId = datBan.Id;
            ban.MaDatBanHienTai = datBan.MaDatBan;
            ban.TrangThai = "HELD";
            ban.CapNhatLuc = DateTime.UtcNow;
        }

        datBan.TrangThai = "DA_XEP_BAN";
        datBan.XepBanLuc = DateTime.UtcNow;
        datBan.CapNhatLuc = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return datBan;
    }
}
