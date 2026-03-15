using apiquanlynhahang.DTOs;
using apiquanlynhahang.Models;
using apiquanlynhahang.Repositories;

namespace apiquanlynhahang.Services;

public class MonAnService : IMonAnService
{
    private readonly IMonAnRepository _monAnRepository;

    public MonAnService(IMonAnRepository monAnRepository)
    {
        _monAnRepository = monAnRepository;
    }

    public async Task<List<MonAnDto>> LayDanhSachAsync(CancellationToken cancellationToken = default)
    {
        var danhSach = await _monAnRepository.LayDanhSachAsync(cancellationToken);
        return danhSach.Select(ChuyenDto).ToList();
    }

    public async Task<MonAnDto?> LayTheoIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var monAn = await _monAnRepository.LayTheoIdAsync(id, cancellationToken);
        return monAn is null ? null : ChuyenDto(monAn);
    }

    private static MonAnDto ChuyenDto(MonAn monAn)
    {
        return new MonAnDto
        {
            Id = monAn.Id,
            TenMon = monAn.TenMon,
            Slug = monAn.Slug,
            MoTa = monAn.MoTa,
            Gia = monAn.Gia,
            DanhMuc = monAn.DanhMuc,
            NhanMon = monAn.NhanMon,
            ToneMau = monAn.ToneMau,
            HinhAnh = monAn.HinhAnh,
            DangKinhDoanh = monAn.DangKinhDoanh,
            TaoLuc = monAn.TaoLuc,
            CapNhatLuc = monAn.CapNhatLuc,
        };
    }
}
