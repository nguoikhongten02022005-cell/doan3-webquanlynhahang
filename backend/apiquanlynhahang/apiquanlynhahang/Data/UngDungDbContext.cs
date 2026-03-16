using apiquanlynhahang.Models;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Data;

public class UngDungDbContext : DbContext
{
    public UngDungDbContext(DbContextOptions<UngDungDbContext> options) : base(options)
    {
    }

    public DbSet<NguoiDung> NguoiDung { get; set; }
    public DbSet<MonAn> MonAn { get; set; }
    public DbSet<KhuVucBan> KhuVucBan { get; set; }
    public DbSet<BanAn> BanAn { get; set; }
    public DbSet<DatBan> DatBan { get; set; }
    public DbSet<ChiTietDatBan> ChiTietDatBan { get; set; }
    public DbSet<MaGiamGia> MaGiamGia { get; set; }
    public DbSet<DonHang> DonHang { get; set; }
    public DbSet<ChiTietDonHang> ChiTietDonHang { get; set; }
    public DbSet<NguyenLieu> NguyenLieu { get; set; }
    public DbSet<PhieuNhapKho> PhieuNhapKho { get; set; }
    public DbSet<ChiTietNhapKho> ChiTietNhapKho { get; set; }
    public DbSet<CongThucMonAn> CongThucMonAn { get; set; }
    public DbSet<BienDongKho> BienDongKho { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.ToTable("nguoi_dung");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.HoTen).HasColumnName("ho_ten");
            entity.Property(x => x.TenDangNhap).HasColumnName("ten_dang_nhap");
            entity.Property(x => x.Email).HasColumnName("email");
            entity.Property(x => x.MatKhauMaHoa).HasColumnName("mat_khau_ma_hoa");
            entity.Property(x => x.VaiTro).HasColumnName("vai_tro");
            entity.Property(x => x.TrangThai).HasColumnName("trang_thai");
            entity.Property(x => x.SoDienThoai).HasColumnName("so_dien_thoai");
            entity.Property(x => x.TaoLuc).HasColumnName("tao_luc");
            entity.Property(x => x.CapNhatLuc).HasColumnName("cap_nhat_luc");
        });

        modelBuilder.Entity<MonAn>(entity =>
        {
            entity.ToTable("mon_an");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.TenMon).HasColumnName("ten_mon");
            entity.Property(x => x.Slug).HasColumnName("slug");
            entity.Property(x => x.MoTa).HasColumnName("mo_ta");
            entity.Property(x => x.Gia).HasColumnName("gia").HasPrecision(10, 2);
            entity.Property(x => x.DanhMuc).HasColumnName("danh_muc");
            entity.Property(x => x.NhanMon).HasColumnName("nhan_mon");
            entity.Property(x => x.ToneMau).HasColumnName("tone_mau");
            entity.Property(x => x.HinhAnh).HasColumnName("hinh_anh");
            entity.Property(x => x.DangKinhDoanh).HasColumnName("dang_kinh_doanh");
            entity.Property(x => x.TaoLuc).HasColumnName("tao_luc");
            entity.Property(x => x.CapNhatLuc).HasColumnName("cap_nhat_luc");
        });

        modelBuilder.Entity<KhuVucBan>(entity =>
        {
            entity.ToTable("khu_vuc_ban");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.TenKhuVuc).HasColumnName("ten_khu_vuc");
            entity.Property(x => x.MoTa).HasColumnName("mo_ta");
            entity.Property(x => x.TaoLuc).HasColumnName("tao_luc");
            entity.Property(x => x.CapNhatLuc).HasColumnName("cap_nhat_luc");
        });

        modelBuilder.Entity<BanAn>(entity =>
        {
            entity.ToTable("ban_an");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.MaBan).HasColumnName("ma_ban");
            entity.Property(x => x.MaQr).HasColumnName("ma_qr");
            entity.Property(x => x.TokenQr).HasColumnName("token_qr");
            entity.Property(x => x.KichHoatQr).HasColumnName("kich_hoat_qr");
            entity.Property(x => x.TenBan).HasColumnName("ten_ban");
            entity.Property(x => x.KhuVucId).HasColumnName("khu_vuc_id");
            entity.Property(x => x.SucChua).HasColumnName("suc_chua");
            entity.Property(x => x.TrangThai).HasColumnName("trang_thai");
            entity.Property(x => x.DatBanHienTaiId).HasColumnName("dat_ban_hien_tai_id");
            entity.Property(x => x.MaDatBanHienTai).HasColumnName("ma_dat_ban_hien_tai");
            entity.Property(x => x.DangSuDungLuc).HasColumnName("dang_su_dung_luc");
            entity.Property(x => x.GiaiPhongLuc).HasColumnName("giai_phong_luc");
            entity.Property(x => x.GhiChu).HasColumnName("ghi_chu");
            entity.Property(x => x.TaoLuc).HasColumnName("tao_luc");
            entity.Property(x => x.CapNhatLuc).HasColumnName("cap_nhat_luc");
        });

        modelBuilder.Entity<DatBan>(entity =>
        {
            entity.ToTable("dat_ban");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.MaDatBan).HasColumnName("ma_dat_ban");
            entity.Property(x => x.SoKhach).HasColumnName("so_khach");
            entity.Property(x => x.NgayDat).HasColumnName("ngay_dat");
            entity.Property(x => x.GioDat).HasColumnName("gio_dat");
            entity.Property(x => x.KhuVucUuTien).HasColumnName("khu_vuc_uu_tien");
            entity.Property(x => x.GhiChu).HasColumnName("ghi_chu");
            entity.Property(x => x.TenKhach).HasColumnName("ten_khach");
            entity.Property(x => x.SoDienThoaiKhach).HasColumnName("so_dien_thoai_khach");
            entity.Property(x => x.EmailKhach).HasColumnName("email_khach");
            entity.Property(x => x.TrangThai).HasColumnName("trang_thai");
            entity.Property(x => x.NguonTao).HasColumnName("nguon_tao");
            entity.Property(x => x.EmailNguoiDung).HasColumnName("email_nguoi_dung");
            entity.Property(x => x.DipDacBiet).HasColumnName("dip_dac_biet");
            entity.Property(x => x.KenhXacNhan).HasColumnName("kenh_xac_nhan");
            entity.Property(x => x.GhiChuNoiBo).HasColumnName("ghi_chu_noi_bo");
            entity.Property(x => x.CheckInLuc).HasColumnName("check_in_luc");
            entity.Property(x => x.XepBanLuc).HasColumnName("xep_ban_luc");
            entity.Property(x => x.HoanThanhLuc).HasColumnName("hoan_thanh_luc");
            entity.Property(x => x.HuyLuc).HasColumnName("huy_luc");
            entity.Property(x => x.VangMatLuc).HasColumnName("vang_mat_luc");
            entity.Property(x => x.TaoBoi).HasColumnName("tao_boi");
            entity.Property(x => x.NguoiDungId).HasColumnName("nguoi_dung_id");
            entity.Property(x => x.TaoLuc).HasColumnName("tao_luc");
            entity.Property(x => x.CapNhatLuc).HasColumnName("cap_nhat_luc");
        });

        modelBuilder.Entity<ChiTietDatBan>(entity =>
        {
            entity.ToTable("chi_tiet_dat_ban");
            entity.HasKey(x => new { x.DatBanId, x.BanAnId });

            entity.Property(x => x.DatBanId).HasColumnName("dat_ban_id");
            entity.Property(x => x.BanAnId).HasColumnName("ban_an_id");
            entity.Property(x => x.GanLuc).HasColumnName("gan_luc");
        });

        modelBuilder.Entity<MaGiamGia>(entity =>
        {
            entity.ToTable("ma_giam_gia");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.MaGiam).HasColumnName("ma_giam");
            entity.Property(x => x.TenMaGiam).HasColumnName("ten_ma_giam");
            entity.Property(x => x.MoTa).HasColumnName("mo_ta");
            entity.Property(x => x.LoaiGiam).HasColumnName("loai_giam");
            entity.Property(x => x.GiaTriGiam).HasColumnName("gia_tri_giam").HasPrecision(10, 2);
            entity.Property(x => x.DonToiThieu).HasColumnName("don_toi_thieu").HasPrecision(10, 2);
            entity.Property(x => x.GiamToiDa).HasColumnName("giam_toi_da").HasPrecision(10, 2);
            entity.Property(x => x.BatDauLuc).HasColumnName("bat_dau_luc");
            entity.Property(x => x.KetThucLuc).HasColumnName("ket_thuc_luc");
            entity.Property(x => x.GioiHanSuDung).HasColumnName("gioi_han_su_dung");
            entity.Property(x => x.DaSuDung).HasColumnName("da_su_dung");
            entity.Property(x => x.DangHoatDong).HasColumnName("dang_hoat_dong");
            entity.Property(x => x.TaoLuc).HasColumnName("tao_luc");
            entity.Property(x => x.CapNhatLuc).HasColumnName("cap_nhat_luc");
        });

        modelBuilder.Entity<DonHang>(entity =>
        {
            entity.ToTable("don_hang");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.MaDonHang).HasColumnName("ma_don_hang");
            entity.Property(x => x.TamTinh).HasColumnName("tam_tinh").HasPrecision(10, 2);
            entity.Property(x => x.PhiDichVu).HasColumnName("phi_dich_vu").HasPrecision(10, 2);
            entity.Property(x => x.TienGiam).HasColumnName("tien_giam").HasPrecision(10, 2);
            entity.Property(x => x.MaGiamGiaApDung).HasColumnName("ma_giam_gia_ap_dung");
            entity.Property(x => x.ThanhTien).HasColumnName("thanh_tien").HasPrecision(10, 2);
            entity.Property(x => x.DatLuc).HasColumnName("dat_luc");
            entity.Property(x => x.TrangThai).HasColumnName("trang_thai");
            entity.Property(x => x.TrangThaiThanhToan).HasColumnName("trang_thai_thanh_toan");
            entity.Property(x => x.GhiChu).HasColumnName("ghi_chu");
            entity.Property(x => x.MaBan).HasColumnName("ma_ban");
            entity.Property(x => x.PhuongThucThanhToan).HasColumnName("phuong_thuc_thanh_toan");
            entity.Property(x => x.EmailNguoiDung).HasColumnName("email_nguoi_dung");
            entity.Property(x => x.TenKhachHang).HasColumnName("ten_khach_hang");
            entity.Property(x => x.SoDienThoaiKhachHang).HasColumnName("so_dien_thoai_khach_hang");
            entity.Property(x => x.EmailKhachHang).HasColumnName("email_khach_hang");
            entity.Property(x => x.DiaChiKhachHang).HasColumnName("dia_chi_khach_hang");
            entity.Property(x => x.ThongTinKhachHang).HasColumnName("thong_tin_khach_hang");
            entity.Property(x => x.NguoiDungId).HasColumnName("nguoi_dung_id");
            entity.Property(x => x.TaoLuc).HasColumnName("tao_luc");
            entity.Property(x => x.CapNhatLuc).HasColumnName("cap_nhat_luc");
        });

        modelBuilder.Entity<ChiTietDonHang>(entity =>
        {
            entity.ToTable("chi_tiet_don_hang");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.DonHangId).HasColumnName("don_hang_id");
            entity.Property(x => x.MonAnId).HasColumnName("mon_an_id");
            entity.Property(x => x.TenMon).HasColumnName("ten_mon");
            entity.Property(x => x.DonGia).HasColumnName("don_gia").HasPrecision(10, 2);
            entity.Property(x => x.SoLuong).HasColumnName("so_luong");
            entity.Property(x => x.KichCo).HasColumnName("kich_co");
            entity.Property(x => x.ToppingDaChon).HasColumnName("topping_da_chon");
            entity.Property(x => x.GhiChuMon).HasColumnName("ghi_chu_mon");
            entity.Property(x => x.MaBienThe).HasColumnName("ma_bien_the");
            entity.Property(x => x.ThongTinMon).HasColumnName("thong_tin_mon");
        });

        modelBuilder.Entity<NguyenLieu>(entity =>
        {
            entity.ToTable("nguyen_lieu");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.MaNguyenLieu).HasColumnName("ma_nguyen_lieu");
            entity.Property(x => x.TenNguyenLieu).HasColumnName("ten_nguyen_lieu");
            entity.Property(x => x.DonViTinh).HasColumnName("don_vi_tinh");
            entity.Property(x => x.SoLuongTon).HasColumnName("so_luong_ton").HasPrecision(12, 3);
            entity.Property(x => x.MucCanhBaoToiThieu).HasColumnName("muc_canh_bao_toi_thieu").HasPrecision(12, 3);
            entity.Property(x => x.TrangThai).HasColumnName("trang_thai");
            entity.Property(x => x.GhiChu).HasColumnName("ghi_chu");
            entity.Property(x => x.TaoLuc).HasColumnName("tao_luc");
            entity.Property(x => x.CapNhatLuc).HasColumnName("cap_nhat_luc");
        });

        modelBuilder.Entity<PhieuNhapKho>(entity =>
        {
            entity.ToTable("phieu_nhap_kho");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.MaPhieuNhap).HasColumnName("ma_phieu_nhap");
            entity.Property(x => x.NgayNhap).HasColumnName("ngay_nhap");
            entity.Property(x => x.NhaCungCap).HasColumnName("nha_cung_cap");
            entity.Property(x => x.GhiChu).HasColumnName("ghi_chu");
            entity.Property(x => x.TongTien).HasColumnName("tong_tien").HasPrecision(12, 2);
            entity.Property(x => x.NguoiTaoId).HasColumnName("nguoi_tao_id");
            entity.Property(x => x.TaoLuc).HasColumnName("tao_luc");
            entity.Property(x => x.CapNhatLuc).HasColumnName("cap_nhat_luc");
        });

        modelBuilder.Entity<ChiTietNhapKho>(entity =>
        {
            entity.ToTable("chi_tiet_nhap_kho");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.PhieuNhapKhoId).HasColumnName("phieu_nhap_kho_id");
            entity.Property(x => x.NguyenLieuId).HasColumnName("nguyen_lieu_id");
            entity.Property(x => x.SoLuongNhap).HasColumnName("so_luong_nhap").HasPrecision(12, 3);
            entity.Property(x => x.DonGiaNhap).HasColumnName("don_gia_nhap").HasPrecision(12, 2);
            entity.Property(x => x.ThanhTien).HasColumnName("thanh_tien").HasPrecision(12, 2);
            entity.Property(x => x.GhiChu).HasColumnName("ghi_chu");
        });

        modelBuilder.Entity<CongThucMonAn>(entity =>
        {
            entity.ToTable("cong_thuc_mon_an");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.MonAnId).HasColumnName("mon_an_id");
            entity.Property(x => x.NguyenLieuId).HasColumnName("nguyen_lieu_id");
            entity.Property(x => x.DinhLuong).HasColumnName("dinh_luong").HasPrecision(12, 3);
            entity.Property(x => x.DonViTinh).HasColumnName("don_vi_tinh");
            entity.Property(x => x.GhiChu).HasColumnName("ghi_chu");
            entity.Property(x => x.TaoLuc).HasColumnName("tao_luc");
            entity.Property(x => x.CapNhatLuc).HasColumnName("cap_nhat_luc");
        });

        modelBuilder.Entity<BienDongKho>(entity =>
        {
            entity.ToTable("bien_dong_kho");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.NguyenLieuId).HasColumnName("nguyen_lieu_id");
            entity.Property(x => x.LoaiBienDong).HasColumnName("loai_bien_dong");
            entity.Property(x => x.SoLuongThayDoi).HasColumnName("so_luong_thay_doi").HasPrecision(12, 3);
            entity.Property(x => x.SoLuongTruoc).HasColumnName("so_luong_truoc").HasPrecision(12, 3);
            entity.Property(x => x.SoLuongSau).HasColumnName("so_luong_sau").HasPrecision(12, 3);
            entity.Property(x => x.ThamChieuLoai).HasColumnName("tham_chieu_loai");
            entity.Property(x => x.ThamChieuId).HasColumnName("tham_chieu_id");
            entity.Property(x => x.GhiChu).HasColumnName("ghi_chu");
            entity.Property(x => x.TaoLuc).HasColumnName("tao_luc");
        });
    }
}
