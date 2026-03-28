using apiquanlynhahang.DAL.Context;

namespace apiquanlynhahang.DAL.Seeders;

public static class MonAnKhoiTaoDuLieu
{
    public static Task DamBaoDuLieuMauAsync(UngDungDbContext dbContext, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }
}
