using apiquanlynhahang.Common;
using apiquanlynhahang.DAL.Context;
using apiquanlynhahang.DAL.Entities;
using apiquanlynhahang.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.BLL.Services;

public class NhanVienService
{
    private readonly UngDungDbContext _dbContext;

    public NhanVienService(UngDungDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<NhanVien>> LayDanhSachAsync(CancellationToken cancellationToken = default)
        => _dbContext.NhanVien.AsNoTracking().OrderBy(x => x.MaNV).ToListAsync(cancellationToken);

    public Task<NhanVien?> LayTheoMaAsync(string maNv, CancellationToken cancellationToken = default)
        => _dbContext.NhanVien.AsNoTracking().FirstOrDefaultAsync(x => x.MaNV == maNv, cancellationToken);

    public async Task<NhanVien> TaoAsync(TaoNhanVienDto dto, CancellationToken cancellationToken = default)
    {
        if (!await _dbContext.NguoiDung.AnyAsync(x => x.MaND == dto.MaND, cancellationToken))
        {
            throw new ApiException(400, "MaND khong ton tai");
        }

        var entity = new NhanVien
        {
            MaNV = dto.MaNV,
            MaND = dto.MaND,
            HoTen = dto.HoTen,
            GioiTinh = dto.GioiTinh,
            SDT = dto.SDT,
            DiaChi = dto.DiaChi,
            ChucVu = dto.ChucVu,
            LuongCoBan = dto.LuongCoBan,
            NgayVaoLam = dto.NgayVaoLam,
            TinhTrang = "Active",
            NgayCapNhat = DateTime.UtcNow,
        };

        _dbContext.NhanVien.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
