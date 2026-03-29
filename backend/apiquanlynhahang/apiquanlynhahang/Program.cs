using System.Security.Cryptography;
using System.Text;
using apiquanlynhahang.BLL.Services;
using apiquanlynhahang.Common;
using apiquanlynhahang.DAL.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? ["http://localhost:5173"];
var chuoiKetNoi = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Khong tim thay chuoi ket noi DefaultConnection.");
var jwtSecret = builder.Configuration["Jwt:Secret"];

if (string.IsNullOrWhiteSpace(jwtSecret))
{
    jwtSecret = builder.Environment.IsDevelopment()
        ? Convert.ToBase64String(RandomNumberGenerator.GetBytes(64))
        : throw new InvalidOperationException("Khong tim thay Jwt:Secret.");
}

builder.Services.AddControllers();
builder.Services.Configure<JwtTuyChon>(options =>
{
    builder.Configuration.GetSection("Jwt").Bind(options);
    options.Secret = jwtSecret;
});

builder.Services.AddDbContext<UngDungDbContext>(options =>
    options.UseMySql(chuoiKetNoi, ServerVersion.AutoDetect(chuoiKetNoi)));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            NameClaimType = System.Security.Claims.ClaimTypes.Name,
            RoleClaimType = System.Security.Claims.ClaimTypes.Role,
            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendLocal", policy =>
    {
        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<NguoiDungService>();
builder.Services.AddScoped<NhanVienService>();
builder.Services.AddScoped<KhachHangService>();
builder.Services.AddScoped<BanService>();
builder.Services.AddScoped<QRCodeService>();
builder.Services.AddScoped<DanhMucService>();
builder.Services.AddScoped<ThucDonService>();
builder.Services.AddScoped<MaGiamGiaService>();
builder.Services.AddScoped<DatBanService>();
builder.Services.AddScoped<DonHangService>();
builder.Services.AddScoped<HoaDonService>();
builder.Services.AddScoped<ThanhToanService>();
builder.Services.AddScoped<DanhGiaService>();
builder.Services.AddScoped<LichSuDonHangService>();
builder.Services.AddScoped<ThongBaoService>();
builder.Services.AddScoped<BaoCaoService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ApiExceptionMiddleware>();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("FrontendLocal");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
