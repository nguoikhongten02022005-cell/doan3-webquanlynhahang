using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using apiquanlynhahang.Models;
using apiquanlynhahang.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace apiquanlynhahang.Services;

public class JwtService
{
    private readonly JwtTuyChon _jwtTuyChon;

    public JwtService(IOptions<JwtTuyChon> jwtTuyChon)
    {
        _jwtTuyChon = jwtTuyChon.Value;
    }

    public string TaoAccessToken(NguoiDung nguoiDung)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, nguoiDung.Id.ToString()),
            new(ClaimTypes.NameIdentifier, nguoiDung.Id.ToString()),
            new(ClaimTypes.Email, nguoiDung.Email),
            new(ClaimTypes.Name, nguoiDung.HoTen),
            new(ClaimTypes.Role, nguoiDung.VaiTro),
            new("username", nguoiDung.TenDangNhap),
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtTuyChon.Secret));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(_jwtTuyChon.AccessTokenExpiresMinutes);

        var token = new JwtSecurityToken(
            issuer: _jwtTuyChon.Issuer,
            audience: _jwtTuyChon.Audience,
            claims: claims,
            expires: expires,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
