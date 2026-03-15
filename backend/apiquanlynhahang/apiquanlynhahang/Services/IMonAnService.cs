using apiquanlynhahang.DTOs;

namespace apiquanlynhahang.Services;

public interface IMonAnService
{
    Task<List<MonAnDto>> LayDanhSachAsync(CancellationToken cancellationToken = default);
    Task<MonAnDto?> LayTheoIdAsync(int id, CancellationToken cancellationToken = default);
}
