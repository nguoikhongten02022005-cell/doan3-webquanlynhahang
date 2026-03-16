using apiquanlynhahang.Data;
using apiquanlynhahang.Common;
using apiquanlynhahang.DTOs;
using apiquanlynhahang.Models;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Services;

public class BanAnService
{
    private readonly UngDungDbContext _dbContext;

    public BanAnService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<BanAn>> LayDanhSachAsync(string? khuVucId, string? trangThai, uint? sucChuaToiThieu, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.BanAn.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(khuVucId))
        {
            query = query.Where(x => x.KhuVucId == khuVucId);
        }

        if (!string.IsNullOrWhiteSpace(trangThai))
        {
            query = query.Where(x => x.TrangThai == trangThai);
        }

        if (sucChuaToiThieu.HasValue)
        {
            query = query.Where(x => x.SucChua >= sucChuaToiThieu.Value);
        }

        return query.OrderBy(x => x.MaBan).ToListAsync(cancellationToken);
    }

    public Task<BanAn?> LayTheoIdAsync(string id, CancellationToken cancellationToken = default)
        => _dbContext.BanAn.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<BanAn> TaoAsync(TaoBanAnDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Id) || string.IsNullOrWhiteSpace(dto.MaBan) || string.IsNullOrWhiteSpace(dto.TenBan))
        {
            throw new ApiException(400, "Id, ma ban va ten ban la bat buoc");
        }

        if (dto.SucChua == 0)
        {
            throw new ApiException(400, "Suc chua phai lon hon 0");
        }

        var khuVucTonTai = await _dbContext.KhuVucBan.AnyAsync(x => x.Id == dto.KhuVucId, cancellationToken);
        if (!khuVucTonTai)
        {
            throw new ApiException(400, "Khu vuc ban khong ton tai");
        }

        var maBanDaTonTai = await _dbContext.BanAn.AnyAsync(x => x.Id == dto.Id || x.MaBan == dto.MaBan, cancellationToken);
        if (maBanDaTonTai)
        {
            throw new ApiException(409, "Ban an hoac ma ban da ton tai");
        }

        var banAn = new BanAn
        {
            Id = dto.Id,
            MaBan = dto.MaBan,
            TenBan = dto.TenBan,
            KhuVucId = dto.KhuVucId,
            SucChua = dto.SucChua,
            TrangThai = "AVAILABLE",
            GhiChu = dto.GhiChu,
            MaDatBanHienTai = string.Empty,
            TaoLuc = DateTime.UtcNow,
            CapNhatLuc = DateTime.UtcNow,
        };

        _dbContext.BanAn.Add(banAn);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return banAn;
    }

    public async Task<BanAn?> CapNhatAsync(string id, CapNhatBanAnDto dto, CancellationToken cancellationToken = default)
    {
        var banAn = await _dbContext.BanAn.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (banAn is null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(dto.KhuVucId))
        {
            var khuVucTonTai = await _dbContext.KhuVucBan.AnyAsync(x => x.Id == dto.KhuVucId, cancellationToken);
            if (!khuVucTonTai)
            {
                throw new ApiException(400, "Khu vuc ban khong ton tai");
            }
        }

        if (!string.IsNullOrWhiteSpace(dto.MaBan)) banAn.MaBan = dto.MaBan;
        if (!string.IsNullOrWhiteSpace(dto.TenBan)) banAn.TenBan = dto.TenBan;
        if (!string.IsNullOrWhiteSpace(dto.KhuVucId)) banAn.KhuVucId = dto.KhuVucId;
        if (dto.SucChua.HasValue) banAn.SucChua = dto.SucChua.Value;
        if (dto.GhiChu is not null) banAn.GhiChu = dto.GhiChu;
        banAn.CapNhatLuc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return banAn;
    }

    public async Task<BanAn?> CapNhatTrangThaiAsync(string id, string trangThai, CancellationToken cancellationToken = default)
    {
        var banAn = await _dbContext.BanAn.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (banAn is null)
        {
            return null;
        }

        banAn.TrangThai = trangThai;
        if (trangThai == "AVAILABLE")
        {
            banAn.GiaiPhongLuc = DateTime.UtcNow;
        }
        if (trangThai == "OCCUPIED")
        {
            banAn.DangSuDungLuc = DateTime.UtcNow;
        }
        if (trangThai == "DIRTY")
        {
            banAn.DatBanHienTaiId = null;
            banAn.MaDatBanHienTai = string.Empty;
        }
        banAn.CapNhatLuc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return banAn;
    }

    public async Task<List<BanAn>> LayDanhSachKhaDungChoDatBanAsync(int datBanId, CancellationToken cancellationToken = default)
    {
        var datBan = await _dbContext.DatBan.AsNoTracking().FirstOrDefaultAsync(x => x.Id == (uint)datBanId, cancellationToken);
        if (datBan is null)
        {
            return [];
        }

        return await _dbContext.BanAn
            .AsNoTracking()
            .Where(x => x.TrangThai == "AVAILABLE" || x.DatBanHienTaiId == (uint)datBanId)
            .Where(x => x.SucChua >= datBan.SoKhach)
            .OrderBy(x => x.MaBan)
            .ToListAsync(cancellationToken);
    }
}
