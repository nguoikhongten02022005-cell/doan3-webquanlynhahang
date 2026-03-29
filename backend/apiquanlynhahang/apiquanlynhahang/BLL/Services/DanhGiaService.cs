using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace apiquanlynhahang.BLL.Services;

public class DanhGiaService
{
    private readonly UngDungDbContext _dbContext;

    public DanhGiaService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<DanhGia>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.DanhGia.AsNoTracking().OrderByDescending(x => x.NgayDanhGia).ToListAsync(cancellationToken);

    public async Task<DanhGia> TaoAsync(TaoDanhGiaDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.MaKH))
        {
            throw new ValidationException("Thiếu mã khách hàng để gửi đánh giá.");
        }

        if (string.IsNullOrWhiteSpace(dto.MaDonHang))
        {
            throw new ValidationException("Vui lòng nhập mã đơn hàng hợp lệ.");
        }

        var khachHangTonTai = await _dbContext.KhachHang
            .AsNoTracking()
            .AnyAsync(x => x.MaKH == dto.MaKH, cancellationToken);

        if (!khachHangTonTai)
        {
            throw new ValidationException("Không tìm thấy khách hàng gửi đánh giá.");
        }

        var donHangTonTai = await _dbContext.DonHang
            .AsNoTracking()
            .AnyAsync(x => x.MaDonHang == dto.MaDonHang, cancellationToken);

        if (!donHangTonTai)
        {
            throw new ValidationException("Mã đơn hàng không tồn tại trong hệ thống.");
        }

        var daTonTaiDanhGia = await _dbContext.DanhGia
            .AsNoTracking()
            .AnyAsync(x => x.MaKH == dto.MaKH && x.MaDonHang == dto.MaDonHang, cancellationToken);

        if (daTonTaiDanhGia)
        {
            throw new ValidationException("Đơn hàng này đã có đánh giá trước đó.");
        }

        var entity = new DanhGia
        {
            MaDanhGia = dto.MaDanhGia,
            MaKH = dto.MaKH,
            MaDonHang = dto.MaDonHang,
            SoSao = dto.SoSao,
            NoiDung = dto.NoiDung,
            TrangThai = "Pending",
            NgayDanhGia = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow,
        };

        _dbContext.DanhGia.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<DanhGia?> DuyetAsync(string maDanhGia, string trangThai, string? phanHoi, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.DanhGia.FirstOrDefaultAsync(x => x.MaDanhGia == maDanhGia, cancellationToken);
        if (entity is null) return null;
        entity.TrangThai = trangThai;
        entity.PhanHoi = phanHoi;
        entity.NgayCapNhat = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
