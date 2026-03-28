using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using apiquanlynhahang.Common;
using apiquanlynhahang.DAL.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace apiquanlynhahang.BLL.Services;

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
            new(JwtRegisteredClaimNames.Sub, nguoiDung.MaND),
            new(ClaimTypes.NameIdentifier, nguoiDung.MaND),
            new(ClaimTypes.Email, nguoiDung.Email),
            new(ClaimTypes.Name, nguoiDung.TenND),
            new(ClaimTypes.Role, nguoiDung.VaiTro),
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtTuyChon.Secret));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtTuyChon.Issuer,
            audience: _jwtTuyChon.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtTuyChon.AccessTokenExpiresMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
