using apiquanlynhahang.Common;
using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class QRCodeService
{
    private readonly UngDungDbContext _dbContext;

    public QRCodeService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<QRCode>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.QRCode.AsNoTracking().OrderBy(x => x.MaQR).ToListAsync(cancellationToken);

    public Task<QRCode?> LayTheoMaAsync(string maQr, CancellationToken cancellationToken = default)
        => _dbContext.QRCode.AsNoTracking().FirstOrDefaultAsync(x => x.MaQR == maQr, cancellationToken);

    public Task<QRCode?> LayTheoBanAsync(string maBan, CancellationToken cancellationToken = default)
        => _dbContext.QRCode.AsNoTracking().FirstOrDefaultAsync(x => x.MaBan == maBan, cancellationToken);

    public async Task<QRCode> TaoAsync(TaoQRCodeDto dto, CancellationToken cancellationToken = default)
    {
        if (!await _dbContext.Ban.AnyAsync(x => x.MaBan == dto.MaBan, cancellationToken))
        {
            throw new ApiException(400, "Ban khong ton tai");
        }

        var entity = new QRCode
        {
            MaQR = dto.MaQR,
            MaBan = dto.MaBan,
            DuongDanQR = dto.DuongDanQR,
            NgayTao = DateTime.UtcNow,
            NgayHetHan = dto.NgayHetHan,
            TrangThai = "Active",
        };

        _dbContext.QRCode.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
