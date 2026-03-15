using apiquanlynhahang.Data;
using apiquanlynhahang.Repositories;
using apiquanlynhahang.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
var chuoiKetNoi = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Khong tim thay chuoi ket noi DefaultConnection.");

builder.Services.AddDbContext<UngDungDbContext>(options =>
    options.UseMySql(chuoiKetNoi, ServerVersion.AutoDetect(chuoiKetNoi)));

builder.Services.AddScoped<IMonAnRepository, MonAnRepository>();
builder.Services.AddScoped<IMonAnService, MonAnService>();
builder.Services.AddScoped<BanAnService>();
builder.Services.AddScoped<MaGiamGiaService>();
builder.Services.AddScoped<DatBanService>();
builder.Services.AddScoped<DonHangService>();
builder.Services.AddScoped<NguoiDungService>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
