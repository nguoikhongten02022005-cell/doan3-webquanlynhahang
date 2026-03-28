using System.Security.Claims;

namespace apiquanlynhahang.Common;

public static class ClaimsPrincipalExtensions
{
    public static CurrentUserInfo? LayNguoiDungHienTai(this ClaimsPrincipal principal)
    {
        var maNd = principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal.FindFirstValue("sub");
        var email = principal.FindFirstValue(ClaimTypes.Email);

        if (string.IsNullOrWhiteSpace(maNd) || string.IsNullOrWhiteSpace(email))
        {
            return null;
        }

        return new CurrentUserInfo
        {
            MaND = maNd,
            Email = email,
            TenND = principal.FindFirstValue(ClaimTypes.Name) ?? string.Empty,
            VaiTro = principal.FindFirstValue(ClaimTypes.Role) ?? string.Empty,
        };
    }
}
