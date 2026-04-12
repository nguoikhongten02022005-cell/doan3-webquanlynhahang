import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { AuthService } from '../auth/auth.service';
import { DonHangQueryService } from '../don-hang/don-hang-query.service';
import { DonHangCommandService } from '../don-hang/don-hang-command.service';

type BanGhi = Record<string, any>;

@Injectable()
export class MangVeService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly authService: AuthService,
    private readonly donHangQueryService: DonHangQueryService,
    private readonly donHangCommandService: DonHangCommandService,
  ) {}

  private taoPhanHoi(duLieu: unknown, thongDiep = 'Thanh cong', meta: unknown = null) {
    return { success: true, data: duLieu, message: thongDiep, meta };
  }

  private chuanHoaVaiTroNoiBo(vaiTro: string) {
    if (vaiTro === 'Admin') return 'Admin';
    if (vaiTro === 'NhanVien') return 'NhanVien';
    return 'KhachHang';
  }

  private async layKhachHangTheoMaNd(maND: string) {
    const danhSach = await this.mysql.truyVan('SELECT * FROM KhachHang WHERE MaND = ? LIMIT 1', [maND]);
    return danhSach[0] || null;
  }

  taoDonMangVe(authorization: string | undefined, payload: BanGhi) {
    return this.donHangCommandService.taoDonHang(
      {
        ...payload,
        maDonHang: payload.maDonHang || `DHMV_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        loaiDon: payload.loaiDon || 'MANG_VE_PICKUP',
        chiTiet: Array.isArray(payload.chiTiet)
          ? payload.chiTiet
          : Array.isArray(payload.danhSachMon)
            ? payload.danhSachMon
            : Array.isArray(payload.items)
              ? payload.items
              : [],
      },
      payload.loaiDon || 'MANG_VE_PICKUP',
    )
  }

  layDonMangVe(authorization: string | undefined, maDonHang: string) {
    return this.donHangQueryService.layChiTietDonHang(authorization, maDonHang)
  }

  async layDanhSachDonMangVeChoNoiBo(authorization?: string) {
    this.authService.yeuCauQuyenNhanVienHoacQuanTri(authorization);

    const danhSach = await this.mysql.truyVan(
      `SELECT dh.*, kh.TenKH, kh.SDT
       FROM DonHang dh
       LEFT JOIN KhachHang kh ON kh.MaKH = dh.MaKH
       WHERE dh.LoaiDon IN ('MANG_VE_PICKUP', 'MANG_VE_GIAO_HANG')
       ORDER BY dh.NgayTao DESC`,
    );

    const ketQua = await Promise.all(danhSach.map(async (don) => {
      const danhSachMon = await this.donHangQueryService.layChiTietDonHangTheoMa(String(don.MaDonHang));

      return {
        MaDonHang: don.MaDonHang,
        MaKH: don.MaKH,
        HoTen: don.TenKH || '',
        SoDienThoai: don.SDT || '',
        LoaiDon: don.LoaiDon,
        GioLayHang: '',
        GioGiao: '',
        DiaChiGiao: don.DiaChiGiao || '',
        PhiShip: Number(don.PhiShip || 0),
        TongTien: Number(don.TongTien || 0),
        TrangThai: don.TrangThai,
        NgayTao: don.NgayTao,
        DanhSachMon: danhSachMon.map((mon) => ({
          MaChiTiet: mon.MaChiTiet,
          MaMon: mon.MaMon,
          TenMon: mon.TenMon,
          SoLuong: mon.SoLuong,
          DonGia: mon.DonGia,
          ThanhTien: mon.ThanhTien,
          GhiChu: mon.GhiChu,
          TrangThai: mon.TrangThai,
        })),
      };
    }));

    return this.taoPhanHoi(ketQua, 'Lay don mang ve cho noi bo thanh cong');
  }

  capNhatTrangThaiDonMangVe(authorization: string | undefined, maDonHang: string, trangThai: string) {
    return this.donHangCommandService.capNhatTrangThaiDonHang(authorization, maDonHang, trangThai);
  }

  layLichSuDonMangVe(authorization?: string) {
    return this.donHangQueryService.layDonHangCuaToi(authorization);
  }

  async huyDonMangVe(authorization: string | undefined, maDonHang: string) {
    const thongTinToken = this.authService.giaiMaNguoiDung(authorization);
    const vaiTro = this.chuanHoaVaiTroNoiBo(String(thongTinToken.vaiTro || ''));

    if (vaiTro === 'Admin' || vaiTro === 'NhanVien') {
      return this.donHangCommandService.capNhatTrangThaiDonHang(authorization, maDonHang, 'Cancelled');
    }

    const khachHang = await this.layKhachHangTheoMaNd(String(thongTinToken.maND));
    if (!khachHang) {
      throw new ForbiddenException('Ban khong co quyen huy don hang nay.');
    }

    const [donHang] = await this.mysql.truyVan('SELECT * FROM DonHang WHERE MaDonHang = ? LIMIT 1', [maDonHang]);
    if (!donHang) {
      throw new NotFoundException('Khong tim thay don hang.');
    }

    if (String(donHang.MaKH || '') !== String(khachHang.MaKH || '')) {
      throw new ForbiddenException('Ban khong co quyen huy don hang nay.');
    }

    await this.mysql.thucThi('UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?', ['Cancelled', maDonHang]);
    return this.donHangQueryService.layChiTietDonHang(authorization, maDonHang);
  }
}
