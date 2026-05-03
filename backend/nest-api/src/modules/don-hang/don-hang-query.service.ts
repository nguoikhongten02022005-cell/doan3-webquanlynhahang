import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { AuthService } from '../auth/auth.service';
import { DonHangPricingService } from './don-hang-pricing.service';

type BanGhi = Record<string, any>;

@Injectable()
export class DonHangQueryService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly authService: AuthService,
    private readonly donHangPricingService: DonHangPricingService,
  ) {}

  private taoPhanHoi(
    duLieu: unknown,
    thongDiep = 'Thanh cong',
    meta: unknown = null,
  ) {
    return { success: true, data: duLieu, message: thongDiep, meta };
  }

  private chuanHoaVaiTroNoiBo(vaiTro: string) {
    if (vaiTro === 'Admin') return 'Admin';
    if (vaiTro === 'NhanVien') return 'NhanVien';
    return 'KhachHang';
  }

  private async layKhachHangTheoMaNd(maND: string) {
    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM KhachHang WHERE MaND = ? LIMIT 1',
      [maND],
    );
    return danhSach[0] || null;
  }

  async layChiTietDonHangTheoMa(maDonHang: string) {
    const chiTiet = await this.mysql.truyVan(
      `SELECT ct.*, td.TenMon
       FROM ChiTietDonHang ct
       LEFT JOIN ThucDon td ON td.MaMon = ct.MaMon
       WHERE ct.MaDonHang = ?
       ORDER BY ct.NgayTao ASC`,
      [maDonHang],
    );

    return chiTiet.map((dong) => ({
      MaChiTiet: dong.MaChiTiet,
      MaMon: dong.MaMon,
      TenMon: dong.TenMon,
      SoLuong: Number(dong.SoLuong || 0),
      DonGia: Number(dong.DonGia || 0),
      ThanhTien: Number(dong.ThanhTien || 0),
      GhiChu: dong.GhiChu || '',
      TrangThai: dong.TrangThai,
    }));
  }

  async layChiTietDonHangKhongKiemTraQuyen(maDonHang: string) {
    const [donHang] = await this.mysql.truyVan(
      `SELECT dh.*, kh.TenKH, kh.SDT, kh.DiaChi, nd.Email
       FROM DonHang dh
       LEFT JOIN KhachHang kh ON kh.MaKH = dh.MaKH
       LEFT JOIN NguoiDung nd ON nd.MaND = kh.MaND
       WHERE dh.MaDonHang = ?
       LIMIT 1`,
      [maDonHang],
    );
    if (!donHang) {
      throw new NotFoundException('Khong tim thay don hang.');
    }

    const chiTiet = await this.layChiTietDonHangTheoMa(maDonHang);
    const pricingSummary =
      this.donHangPricingService.taoPricingSummaryTuDuLieuDonHang(
        donHang,
        chiTiet,
      );
    return this.taoPhanHoi(
      {
        donHang: {
          maDonHang: donHang.MaDonHang,
          maKH: donHang.MaKH,
          maBan: donHang.MaBan || donHang.MaBanAn,
          maNV: donHang.MaNV,
          maDatBan: donHang.MaDatBan,
          tongTien: Number(donHang.TongTien || 0),
          pricingSummary,
          voucher: this.donHangPricingService.taoVoucherResponse(
            {},
            pricingSummary.giamGia,
          ),
          trangThai: donHang.TrangThai,
          ghiChu: donHang.GhiChu || '',
          ngayTao: donHang.NgayTao,
          loaiDon: donHang.LoaiDon,
          thongTinNhanHang: this.donHangPricingService.taoThongTinNhanHang({
            loaiDon: donHang.LoaiDon,
            diaChiGiao: donHang.DiaChiGiao || '',
            gioLayHang: donHang.GioLayHang || '',
            gioGiao: donHang.GioGiao || '',
          }),
          diaChiGiao: donHang.DiaChiGiao || '',
          phiShip: Number(donHang.PhiShip || 0),
          tenKhachHang: donHang.TenKH || '',
          soDienThoai: donHang.SDT || '',
          email: donHang.Email || '',
          diaChiKhachHang: donHang.DiaChi || '',
        },
        chiTiet,
      },
      'Lay chi tiet don hang thanh cong',
    );
  }

  async layDanhSachDonHang(dauTrang?: string) {
    this.authService.yeuCauQuyenNhanVienHoacQuanTri(dauTrang);

    const danhSach = await this.mysql.truyVan(
      `SELECT dh.*, kh.TenKH, kh.SDT, kh.DiaChi, nd.Email
       FROM DonHang dh
       LEFT JOIN KhachHang kh ON kh.MaKH = dh.MaKH
       LEFT JOIN NguoiDung nd ON nd.MaND = kh.MaND
       ORDER BY dh.NgayTao DESC`,
    );

    const ketQua = await Promise.all(
      danhSach.map(async (don) => {
        const chiTiet = await this.layChiTietDonHangTheoMa(
          String(don.MaDonHang),
        );
        const pricingSummary =
          this.donHangPricingService.taoPricingSummaryTuDuLieuDonHang(
            don,
            chiTiet,
          );
        return {
          maDonHang: don.MaDonHang,
          maKH: don.MaKH,
          maBan: don.MaBan || don.MaBanAn,
          maNV: don.MaNV,
          maDatBan: don.MaDatBan,
          tongTien: Number(don.TongTien || 0),
          pricingSummary,
          voucher: this.donHangPricingService.taoVoucherResponse(
            {},
            pricingSummary.giamGia,
          ),
          trangThai: don.TrangThai,
          ghiChu: don.GhiChu || '',
          ngayTao: don.NgayTao,
          loaiDon: don.LoaiDon,
          thongTinNhanHang: this.donHangPricingService.taoThongTinNhanHang({
            loaiDon: don.LoaiDon,
            diaChiGiao: don.DiaChiGiao || '',
            gioLayHang: don.GioLayHang || '',
            gioGiao: don.GioGiao || '',
          }),
          diaChiGiao: don.DiaChiGiao || '',
          phiShip: Number(don.PhiShip || 0),
          tenKhachHang: don.TenKH || '',
          soDienThoai: don.SDT || '',
          email: don.Email || '',
          diaChiKhachHang: don.DiaChi || '',
          chiTiet,
        };
      }),
    );

    return this.taoPhanHoi(ketQua, 'Lay danh sach don hang thanh cong');
  }

  async layDonHangCuaToi(dauTrang?: string) {
    const thongTinToken = this.authService.giaiMaNguoiDung(dauTrang);
    const khachHang = await this.layKhachHangTheoMaNd(
      String(thongTinToken.maND),
    );
    if (!khachHang) {
      return this.taoPhanHoi([], 'Khong co don hang');
    }

    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM DonHang WHERE MaKH = ? ORDER BY NgayTao DESC',
      [khachHang.MaKH],
    );
    const ketQua = await Promise.all(
      danhSach.map(async (don) => ({
        maDonHang: don.MaDonHang,
        tongTien: Number(don.TongTien || 0),
        trangThai: don.TrangThai,
        ngayTao: don.NgayTao,
        chiTiet: await this.layChiTietDonHangTheoMa(String(don.MaDonHang)),
      })),
    );
    return this.taoPhanHoi(ketQua, 'Lay don hang cua toi thanh cong');
  }

  async layDonHangCoTheDanhGia(dauTrang?: string) {
    const thongTinToken = this.authService.giaiMaNguoiDung(dauTrang);
    const khachHang = await this.layKhachHangTheoMaNd(
      String(thongTinToken.maND),
    );
    if (!khachHang) {
      return this.taoPhanHoi([], 'Khong co don hang co the danh gia');
    }

    const danhSach = await this.mysql.truyVan(
      `SELECT d.*
       FROM DonHang d
       LEFT JOIN DanhGia dg ON dg.MaDonHang = d.MaDonHang AND dg.MaKH = d.MaKH
       WHERE d.MaKH = ?
         AND d.TrangThai IN ('Completed', 'Paid', 'Served')
         AND dg.MaDanhGia IS NULL
       ORDER BY d.NgayTao DESC`,
      [khachHang.MaKH],
    );

    const ketQua = await Promise.all(
      danhSach.map(async (don) => ({
        maDonHang: don.MaDonHang,
        tongTien: Number(don.TongTien || 0),
        trangThai: don.TrangThai,
        ngayTao: don.NgayTao,
        chiTiet: await this.layChiTietDonHangTheoMa(String(don.MaDonHang)),
      })),
    );

    return this.taoPhanHoi(ketQua, 'Lay don hang co the danh gia thanh cong');
  }

  async layChiTietDonHang(dauTrang: string | undefined, maDonHang: string) {
    const thongTinToken = this.authService.giaiMaNguoiDung(dauTrang);
    const vaiTro = this.chuanHoaVaiTroNoiBo(String(thongTinToken.vaiTro || ''));
    const [donHang] = await this.mysql.truyVan(
      'SELECT MaKH FROM DonHang WHERE MaDonHang = ? LIMIT 1',
      [maDonHang],
    );

    if (!donHang) {
      throw new NotFoundException('Khong tim thay don hang.');
    }

    if (vaiTro !== 'Admin' && vaiTro !== 'NhanVien') {
      const khachHang = await this.layKhachHangTheoMaNd(
        String(thongTinToken.maND),
      );
      if (
        !khachHang ||
        String(khachHang.MaKH || '') !== String(donHang.MaKH || '')
      ) {
        throw new ForbiddenException(
          'Ban khong co quyen xem chi tiet don hang nay.',
        );
      }
    }

    return this.layChiTietDonHangKhongKiemTraQuyen(maDonHang);
  }
}
