using apiquanlynhahang.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.DAL.Context;

public class UngDungDbContext : DbContext
{
    public UngDungDbContext(DbContextOptions<UngDungDbContext> options) : base(options)
    {
    }

    public DbSet<NguoiDung> NguoiDung => Set<NguoiDung>();
    public DbSet<NhanVien> NhanVien => Set<NhanVien>();
    public DbSet<KhachHang> KhachHang => Set<KhachHang>();
    public DbSet<Ban> Ban => Set<Ban>();
    public DbSet<QRCode> QRCode => Set<QRCode>();
    public DbSet<DanhMuc> DanhMuc => Set<DanhMuc>();
    public DbSet<ThucDon> ThucDon => Set<ThucDon>();
    public DbSet<MaGiamGia> MaGiamGia => Set<MaGiamGia>();
    public DbSet<DatBan> DatBan => Set<DatBan>();
    public DbSet<DonHang> DonHang => Set<DonHang>();
    public DbSet<ChiTietDonHang> ChiTietDonHang => Set<ChiTietDonHang>();
    public DbSet<HoaDon> HoaDon => Set<HoaDon>();
    public DbSet<ThanhToan> ThanhToan => Set<ThanhToan>();
    public DbSet<DanhGia> DanhGia => Set<DanhGia>();
    public DbSet<LichSuDonHang> LichSuDonHang => Set<LichSuDonHang>();
    public DbSet<ThongBao> ThongBao => Set<ThongBao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<NguoiDung>(e =>
        {
            e.ToTable("NguoiDung");
            e.HasKey(x => x.MaND);
            e.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<NhanVien>(e =>
        {
            e.ToTable("NhanVien");
            e.HasKey(x => x.MaNV);
            e.HasIndex(x => x.MaND).IsUnique();
        });

        modelBuilder.Entity<KhachHang>(e =>
        {
            e.ToTable("KhachHang");
            e.HasKey(x => x.MaKH);
            e.HasIndex(x => x.MaND).IsUnique();
        });

        modelBuilder.Entity<Ban>(e =>
        {
            e.ToTable("Ban");
            e.HasKey(x => x.MaBan);
        });

        modelBuilder.Entity<QRCode>(e =>
        {
            e.ToTable("QRCode");
            e.HasKey(x => x.MaQR);
            e.HasIndex(x => x.MaBan).IsUnique();
        });

        modelBuilder.Entity<DanhMuc>(e =>
        {
            e.ToTable("DanhMuc");
            e.HasKey(x => x.MaDanhMuc);
        });

        modelBuilder.Entity<ThucDon>(e =>
        {
            e.ToTable("ThucDon");
            e.HasKey(x => x.MaMon);
        });

        modelBuilder.Entity<MaGiamGia>(e =>
        {
            e.ToTable("MaGiamGia");
            e.HasKey(x => x.MaCode);
        });

        modelBuilder.Entity<DatBan>(e =>
        {
            e.ToTable("DatBan");
            e.HasKey(x => x.MaDatBan);
        });

        modelBuilder.Entity<DonHang>(e =>
        {
            e.ToTable("DonHang");
            e.HasKey(x => x.MaDonHang);
        });

        modelBuilder.Entity<ChiTietDonHang>(e =>
        {
            e.ToTable("ChiTietDonHang");
            e.HasKey(x => x.MaChiTiet);
        });

        modelBuilder.Entity<HoaDon>(e =>
        {
            e.ToTable("HoaDon");
            e.HasKey(x => x.MaHoaDon);
            e.HasIndex(x => x.MaDonHang).IsUnique();
        });

        modelBuilder.Entity<ThanhToan>(e =>
        {
            e.ToTable("ThanhToan");
            e.HasKey(x => x.MaThanhToan);
        });

        modelBuilder.Entity<DanhGia>(e =>
        {
            e.ToTable("DanhGia");
            e.HasKey(x => x.MaDanhGia);
            e.HasIndex(x => new { x.MaKH, x.MaDonHang }).IsUnique();
        });

        modelBuilder.Entity<LichSuDonHang>(e =>
        {
            e.ToTable("LichSuDonHang");
            e.HasKey(x => x.MaLichSu);
        });

        modelBuilder.Entity<ThongBao>(e =>
        {
            e.ToTable("ThongBao");
            e.HasKey(x => x.MaThongBao);
        });
    }
}
