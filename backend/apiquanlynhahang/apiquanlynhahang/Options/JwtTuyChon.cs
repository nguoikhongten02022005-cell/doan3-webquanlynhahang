namespace apiquanlynhahang.Options;

public class JwtTuyChon
{
    public string Issuer { get; set; } = "apiquanlynhahang";
    public string Audience { get; set; } = "apiquanlynhahang-client";
    public int AccessTokenExpiresMinutes { get; set; } = 120;
    public string Secret { get; set; } = string.Empty;
}
