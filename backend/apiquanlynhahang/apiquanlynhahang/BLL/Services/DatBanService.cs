using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class DatBanService
{
    private readonly UngDungDbContext _dbContext;

    public DatBanService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<DatBan>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.DatBan.AsNoTracking().OrderByDescending(x => x.NgayTao).ToListAsync(cancellationToken);

    public Task<DatBan?> LayTheoMaAsync(string maDatBan, CancellationToken cancellationToken = default)
        => _dbContext.DatBan.AsNoTracking().FirstOrDefaultAsync(x => x.MaDatBan == maDatBan, cancellationToken);

    public Task<List<DatBan>> LayTheoKhachAsync(string maKh, CancellationToken cancellationToken = default)
        => _dbContext.DatBan.AsNoTracking().Where(x => x.MaKH == maKh).OrderByDescending(x => x.NgayTao).ToListAsync(cancellationToken);

    public async Task<DatBan> TaoAsync(TaoDatBanDto dto, CancellationToken cancellationToken = default)
    {
        if (!string.IsNullOrWhiteSpace(dto.MaBan))
        {
            var daCoDatBanHoatDong = await _dbContext.DatBan
                .AsNoTracking()
                .AnyAsync(x => x.MaBan == dto.MaBan && x.TrangThai != "Cancelled" && x.TrangThai != "Completed" && x.TrangThai != "NoShow", cancellationToken);

            if (daCoDatBanHoatDong)
            {
                throw new InvalidOperationException("Bàn này đang được giữ cho booking khác.");
            }
        }

        var entity = new DatBan
        {
            MaDatBan = dto.MaDatBan,
            MaKH = dto.MaKH,
            MaBan = dto.MaBan,
            MaNV = dto.MaNV,
            NgayDat = dto.NgayDat,
            GioDat = dto.GioDat,
            GioKetThuc = dto.GioKetThuc,
            SoNguoi = dto.SoNguoi,
            GhiChu = dto.GhiChu,
            TrangThai = "Pending",
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow,
        };

        _dbContext.DatBan.Add(entity);

        if (!string.IsNullOrWhiteSpace(entity.MaBan))
        {
            var ban = await _dbContext.Ban.FirstOrDefaultAsync(x => x.MaBan == entity.MaBan, cancellationToken);
            if (ban is not null)
            {
                ban.TrangThai = "Reserved";
                ban.NgayCapNhat = DateTime.UtcNow;
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<DatBan?> CapNhatTrangThaiAsync(string maDatBan, string trangThai, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.DatBan.FirstOrDefaultAsync(x => x.MaDatBan == maDatBan, cancellationToken);
        if (entity is null) return null;

        if (!string.IsNullOrWhiteSpace(entity.MaBan))
        {
            var ban = await _dbContext.Ban.FirstOrDefaultAsync(x => x.MaBan == entity.MaBan, cancellationToken);
            if (ban is not null)
            {
                ban.TrangThai = trangThai switch
                {
                    "Confirmed" => "Reserved",
                    "Pending" => "Reserved",
                    "DA_CHECK_IN" => "Occupied",
                    "Completed" => "Available",
                    "Cancelled" => "Available",
                    "NoShow" => "Available",
                    _ => ban.TrangThai,
                };
                ban.NgayCapNhat = DateTime.UtcNow;
            }
        }

        entity.TrangThai = trangThai;
        entity.NgayCapNhat = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
