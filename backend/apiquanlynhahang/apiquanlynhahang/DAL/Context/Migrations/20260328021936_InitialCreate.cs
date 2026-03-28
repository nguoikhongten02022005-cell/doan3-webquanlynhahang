using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apiquanlynhahang.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ban_an",
                columns: table => new
                {
                    id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ma_ban = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ma_qr = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    token_qr = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    kich_hoat_qr = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ten_ban = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    khu_vuc_id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    suc_chua = table.Column<uint>(type: "int unsigned", nullable: false),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dat_ban_hien_tai_id = table.Column<uint>(type: "int unsigned", nullable: true),
                    ma_dat_ban_hien_tai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dang_su_dung_luc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    giai_phong_luc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tao_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    cap_nhat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ban_an", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "bien_dong_kho",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nguyen_lieu_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    loai_bien_dong = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_luong_thay_doi = table.Column<decimal>(type: "decimal(12,3)", precision: 12, scale: 3, nullable: false),
                    so_luong_truoc = table.Column<decimal>(type: "decimal(12,3)", precision: 12, scale: 3, nullable: false),
                    so_luong_sau = table.Column<decimal>(type: "decimal(12,3)", precision: 12, scale: 3, nullable: false),
                    tham_chieu_loai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tham_chieu_id = table.Column<uint>(type: "int unsigned", nullable: true),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tao_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bien_dong_kho", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "chi_tiet_dat_ban",
                columns: table => new
                {
                    dat_ban_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    ban_an_id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    gan_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chi_tiet_dat_ban", x => new { x.dat_ban_id, x.ban_an_id });
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "chi_tiet_don_hang",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    don_hang_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    mon_an_id = table.Column<uint>(type: "int unsigned", nullable: true),
                    ten_mon = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    don_gia = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    so_luong = table.Column<uint>(type: "int unsigned", nullable: false),
                    kich_co = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    topping_da_chon = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ghi_chu_mon = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ma_bien_the = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    thong_tin_mon = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chi_tiet_don_hang", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "chi_tiet_nhap_kho",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    phieu_nhap_kho_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    nguyen_lieu_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    so_luong_nhap = table.Column<decimal>(type: "decimal(12,3)", precision: 12, scale: 3, nullable: false),
                    don_gia_nhap = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    thanh_tien = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chi_tiet_nhap_kho", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "cong_thuc_mon_an",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    mon_an_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    nguyen_lieu_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    dinh_luong = table.Column<decimal>(type: "decimal(12,3)", precision: 12, scale: 3, nullable: false),
                    don_vi_tinh = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tao_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    cap_nhat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cong_thuc_mon_an", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "dat_ban",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ma_dat_ban = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_khach = table.Column<uint>(type: "int unsigned", nullable: false),
                    ngay_dat = table.Column<DateOnly>(type: "date", nullable: false),
                    gio_dat = table.Column<TimeOnly>(type: "time(6)", nullable: false),
                    khu_vuc_uu_tien = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_khach = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_dien_thoai_khach = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email_khach = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nguon_tao = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email_nguoi_dung = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dip_dac_biet = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    kenh_xac_nhan = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ghi_chu_noi_bo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    check_in_luc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    xep_ban_luc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    hoan_thanh_luc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    huy_luc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    vang_mat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    tao_boi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nguoi_dung_id = table.Column<uint>(type: "int unsigned", nullable: true),
                    tao_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    cap_nhat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dat_ban", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "don_hang",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ma_don_hang = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tam_tinh = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    phi_dich_vu = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    tien_giam = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    ma_giam_gia_ap_dung = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    thanh_tien = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    dat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    trang_thai_thanh_toan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ma_ban = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    phuong_thuc_thanh_toan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email_nguoi_dung = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_khach_hang = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_dien_thoai_khach_hang = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email_khach_hang = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dia_chi_khach_hang = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    thong_tin_khach_hang = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nguoi_dung_id = table.Column<uint>(type: "int unsigned", nullable: true),
                    tao_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    cap_nhat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_don_hang", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "khu_vuc_ban",
                columns: table => new
                {
                    id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_khu_vuc = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mo_ta = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tao_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    cap_nhat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_khu_vuc_ban", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ma_giam_gia",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ma_giam = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_ma_giam = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mo_ta = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    loai_giam = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    gia_tri_giam = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    don_toi_thieu = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    giam_toi_da = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: true),
                    bat_dau_luc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ket_thuc_luc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    gioi_han_su_dung = table.Column<uint>(type: "int unsigned", nullable: true),
                    da_su_dung = table.Column<uint>(type: "int unsigned", nullable: false),
                    dang_hoat_dong = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    tao_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    cap_nhat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ma_giam_gia", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "mon_an",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ten_mon = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    slug = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mo_ta = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    gia = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    danh_muc = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nhan_mon = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tone_mau = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    hinh_anh = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dang_kinh_doanh = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    tao_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    cap_nhat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mon_an", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "nguoi_dung",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ho_ten = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_dang_nhap = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mat_khau_ma_hoa = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vai_tro = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_dien_thoai = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tao_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    cap_nhat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nguoi_dung", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "nguyen_lieu",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ma_nguyen_lieu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_nguyen_lieu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    don_vi_tinh = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_luong_ton = table.Column<decimal>(type: "decimal(12,3)", precision: 12, scale: 3, nullable: false),
                    muc_canh_bao_toi_thieu = table.Column<decimal>(type: "decimal(12,3)", precision: 12, scale: 3, nullable: false),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tao_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    cap_nhat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nguyen_lieu", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "phieu_nhap_kho",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ma_phieu_nhap = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_nhap = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    nha_cung_cap = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tong_tien = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    nguoi_tao_id = table.Column<uint>(type: "int unsigned", nullable: true),
                    tao_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    cap_nhat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_phieu_nhap_kho", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "token_lam_moi",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nguoi_dung_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    ma_bam_token = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    het_han_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    thu_hoi_luc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    tao_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    cap_nhat_luc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_token_lam_moi", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ban_an_khu_vuc_id",
                table: "ban_an",
                column: "khu_vuc_id");

            migrationBuilder.CreateIndex(
                name: "IX_ban_an_ma_ban",
                table: "ban_an",
                column: "ma_ban",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ban_an_ma_qr",
                table: "ban_an",
                column: "ma_qr",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ban_an_token_qr",
                table: "ban_an",
                column: "token_qr",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_bien_dong_kho_nguyen_lieu_id",
                table: "bien_dong_kho",
                column: "nguyen_lieu_id");

            migrationBuilder.CreateIndex(
                name: "IX_chi_tiet_don_hang_don_hang_id",
                table: "chi_tiet_don_hang",
                column: "don_hang_id");

            migrationBuilder.CreateIndex(
                name: "IX_chi_tiet_don_hang_mon_an_id",
                table: "chi_tiet_don_hang",
                column: "mon_an_id");

            migrationBuilder.CreateIndex(
                name: "IX_chi_tiet_nhap_kho_nguyen_lieu_id",
                table: "chi_tiet_nhap_kho",
                column: "nguyen_lieu_id");

            migrationBuilder.CreateIndex(
                name: "IX_chi_tiet_nhap_kho_phieu_nhap_kho_id",
                table: "chi_tiet_nhap_kho",
                column: "phieu_nhap_kho_id");

            migrationBuilder.CreateIndex(
                name: "IX_cong_thuc_mon_an_mon_an_id_nguyen_lieu_id",
                table: "cong_thuc_mon_an",
                columns: new[] { "mon_an_id", "nguyen_lieu_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_dat_ban_ma_dat_ban",
                table: "dat_ban",
                column: "ma_dat_ban",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_dat_ban_nguoi_dung_id",
                table: "dat_ban",
                column: "nguoi_dung_id");

            migrationBuilder.CreateIndex(
                name: "IX_don_hang_ma_don_hang",
                table: "don_hang",
                column: "ma_don_hang",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_don_hang_nguoi_dung_id",
                table: "don_hang",
                column: "nguoi_dung_id");

            migrationBuilder.CreateIndex(
                name: "IX_ma_giam_gia_ma_giam",
                table: "ma_giam_gia",
                column: "ma_giam",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_mon_an_slug",
                table: "mon_an",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_nguoi_dung_email",
                table: "nguoi_dung",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_nguoi_dung_ten_dang_nhap",
                table: "nguoi_dung",
                column: "ten_dang_nhap",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_phieu_nhap_kho_ma_phieu_nhap",
                table: "phieu_nhap_kho",
                column: "ma_phieu_nhap",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_phieu_nhap_kho_nguoi_tao_id",
                table: "phieu_nhap_kho",
                column: "nguoi_tao_id");

            migrationBuilder.CreateIndex(
                name: "IX_token_lam_moi_ma_bam_token",
                table: "token_lam_moi",
                column: "ma_bam_token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_token_lam_moi_nguoi_dung_id",
                table: "token_lam_moi",
                column: "nguoi_dung_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ban_an");

            migrationBuilder.DropTable(
                name: "bien_dong_kho");

            migrationBuilder.DropTable(
                name: "chi_tiet_dat_ban");

            migrationBuilder.DropTable(
                name: "chi_tiet_don_hang");

            migrationBuilder.DropTable(
                name: "chi_tiet_nhap_kho");

            migrationBuilder.DropTable(
                name: "cong_thuc_mon_an");

            migrationBuilder.DropTable(
                name: "dat_ban");

            migrationBuilder.DropTable(
                name: "don_hang");

            migrationBuilder.DropTable(
                name: "khu_vuc_ban");

            migrationBuilder.DropTable(
                name: "ma_giam_gia");

            migrationBuilder.DropTable(
                name: "mon_an");

            migrationBuilder.DropTable(
                name: "nguoi_dung");

            migrationBuilder.DropTable(
                name: "nguyen_lieu");

            migrationBuilder.DropTable(
                name: "phieu_nhap_kho");

            migrationBuilder.DropTable(
                name: "token_lam_moi");
        }
    }
}
