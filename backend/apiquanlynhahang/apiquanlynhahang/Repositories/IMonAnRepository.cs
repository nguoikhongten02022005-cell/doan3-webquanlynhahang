using apiquanlynhahang.Models;

namespace apiquanlynhahang.Repositories;

public interface IMonAnRepository
{
    Task<List<MonAn>> LayDanhSachAsync(CancellationToken cancellationToken = default);
    Task<MonAn?> LayTheoIdAsync(int id, CancellationToken cancellationToken = default);
}
