import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { DonHangPricingService } from './don-hang-pricing.service';
import { taoPhanHoi } from '../../common/phan-hoi';
import { chuanHoaVaiTroNoiBo } from '../../common/vai-tro';
import { layKhachHangTheoMaNd } from '../../common/khach-hang.helper';
import { BanGhi } from '../../common/types';

@Injectable()
export class DonHangQueryService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly donHangPricingService: DonHangPricingService,
  ) {}

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
    return taoPhanHoi(
      { donHang: this.taoThongTinDonHang(donHang, chiTiet) },
      'Lay chi tiet don hang thanh cong',
    );
  }

  private taoThongTinDonHang(don: BanGhi, chiTiet: BanGhi[]) {
    const tongHopGia = this.donHangPricingService.taoTongHopGiaTuDuLieuDonHang(don, chiTiet);
    return {
      maDonHang: don.MaDonHang,
      maKH: don.MaKH,
      maBan: don.MaBan || don.MaBanAn,
      maNV: don.MaNV,
      maDatBan: don.MaDatBan,
      tongTien: Number(don.TongTien || 0),
      tongHopGia,
      maGiamGia: this.donHangPricingService.taoPhanHoiMaGiam({}, tongHopGia.giamGia),
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
  }

  async layDanhSachDonHang() {
    const danhSach = await this.mysql.truyVan(
      `SELECT dh.*, kh.TenKH, kh.SDT, kh.DiaChi, nd.Email
       FROM DonHang dh
       LEFT JOIN KhachHang kh ON kh.MaKH = dh.MaKH
       LEFT JOIN NguoiDung nd ON nd.MaND = kh.MaND
       ORDER BY dh.NgayTao DESC`,
    );

    const ketQua = await Promise.all(
      danhSach.map(async (don) => {
        const chiTiet = await this.layChiTietDonHangTheoMa(String(don.MaDonHang));
        return this.taoThongTinDonHang(don, chiTiet);
      }),
    );

    return taoPhanHoi(ketQua, 'Lay danh sach don hang thanh cong');
  }

  async layDonHangCuaToi(nguoiDung: any) {
    const khachHang = await layKhachHangTheoMaNd(this.mysql, String(nguoiDung.maND));
    if (!khachHang) {
      return taoPhanHoi([], 'Khong co don hang');
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
    return taoPhanHoi(ketQua, 'Lay don hang cua toi thanh cong');
  }

  async layDonHangCoTheDanhGia(nguoiDung: any) {
    const khachHang = await layKhachHangTheoMaNd(this.mysql, String(nguoiDung.maND));
    if (!khachHang) {
      return taoPhanHoi([], 'Khong co don hang co the danh gia');
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

    return taoPhanHoi(ketQua, 'Lay don hang co the danh gia thanh cong');
  }

  async layChiTietDonHang(nguoiDung: any, maDonHang: string) {
    const vaiTro = chuanHoaVaiTroNoiBo(String(nguoiDung.vaiTro || ''));
    const [donHang] = await this.mysql.truyVan(
      'SELECT MaKH FROM DonHang WHERE MaDonHang = ? LIMIT 1',
      [maDonHang],
    );

    if (!donHang) {
      throw new NotFoundException('Khong tim thay don hang.');
    }

    if (vaiTro !== 'Admin' && vaiTro !== 'NhanVien') {
      const khachHang = await layKhachHangTheoMaNd(this.mysql, String(nguoiDung.maND));
      if (!khachHang || String(khachHang.MaKH || '') !== String(donHang.MaKH || '')) {
        throw new ForbiddenException('Ban khong co quyen xem chi tiet don hang nay.');
      }
    }

    return this.layChiTietDonHangKhongKiemTraQuyen(maDonHang);
  }
}
