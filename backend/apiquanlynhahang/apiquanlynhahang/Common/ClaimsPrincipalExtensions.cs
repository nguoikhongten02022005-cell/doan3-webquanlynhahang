using System.Security.Claims;

namespace apiquanlynhahang.Common;

public static class ClaimsPrincipalExtensions
{
    public static CurrentUserInfo? LayNguoiDungHienTai(this ClaimsPrincipal principal)
    {
        var idText = principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal.FindFirstValue("sub");
        var email = principal.FindFirstValue(ClaimTypes.Email);

        if (!int.TryParse(idText, out var id) || string.IsNullOrWhiteSpace(email))
        {
            return null;
        }

        return new CurrentUserInfo
        {
            Id = id,
            Email = email,
            Username = principal.FindFirstValue("username") ?? string.Empty,
            Role = principal.FindFirstValue(ClaimTypes.Role) ?? string.Empty,
        };
    }
}
