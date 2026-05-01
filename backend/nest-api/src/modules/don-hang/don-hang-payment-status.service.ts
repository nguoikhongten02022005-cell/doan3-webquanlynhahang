import { Injectable, NotFoundException } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { AuthService } from '../auth/auth.service';
import { DonHangQueryService } from './don-hang-query.service';
import { DiemTichLuyService } from '../diem-tich-luy/diem-tich-luy.service';

@Injectable()
export class DonHangPaymentStatusService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly authService: AuthService,
    private readonly donHangQueryService: DonHangQueryService,
    private readonly diemTichLuyService: DiemTichLuyService,
  ) {}

  async capNhatTrangThaiDonHang(
    dauTrang: string | undefined,
    maDonHang: string,
    trangThai: string,
  ) {
    this.authService.yeuCauQuyenNhanVienHoacQuanTri(dauTrang);

    const [don] = await this.mysql.truyVan(
      'SELECT * FROM DonHang WHERE MaDonHang = ? LIMIT 1',
      [maDonHang],
    );
    if (!don) {
      throw new NotFoundException('Khong tim thay don hang.');
    }

    await this.mysql.thucThi(
      'UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?',
      [trangThai, maDonHang],
    );

    if (trangThai === 'Paid') {
      if (don.MaBan) {
        await this.mysql.thucThi(
          'UPDATE Ban SET TrangThai = ? WHERE MaBan = ?',
          ['Available', don.MaBan],
        );
      }
      if (don.MaKH) {
        await this.diemTichLuyService.tinhDiemTuDonHang(
          don.MaKH,
          maDonHang,
          Number(don.TongTien || 0),
        );
      }
    }
    return this.donHangQueryService.layChiTietDonHang(dauTrang, maDonHang);
  }

  async yeuCauThanhToanTaiBan(maBan: string) {
    const danhSach = await this.mysql.truyVan(
      "SELECT * FROM DonHang WHERE (MaBan = ? OR MaBanAn = ?) AND TrangThai NOT IN ('Paid', 'Cancelled') ORDER BY NgayTao DESC LIMIT 1",
      [maBan, maBan],
    );
    if (!danhSach[0]) {
      throw new NotFoundException('Ban chua co order de thanh toan.');
    }
    await this.mysql.thucThi(
      'UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?',
      ['Ready', danhSach[0].MaDonHang],
    );
    await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', [
      'Reserved',
      maBan,
    ]);
    return this.donHangQueryService.layChiTietDonHangKhongKiemTraQuyen(
      String(danhSach[0].MaDonHang),
    );
  }

  async xacNhanThanhToanTaiBan(maBan: string) {
    const danhSach = await this.mysql.truyVan(
      "SELECT * FROM DonHang WHERE (MaBan = ? OR MaBanAn = ?) AND TrangThai NOT IN ('Paid', 'Cancelled') ORDER BY NgayTao DESC LIMIT 1",
      [maBan, maBan],
    );
    if (!danhSach[0]) {
      throw new NotFoundException('Ban chua co order de xac nhan thanh toan.');
    }

    const donHang = danhSach[0];
    await this.mysql.thucThi(
      'UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?',
      ['Paid', donHang.MaDonHang],
    );
    await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', [
      'Available',
      maBan,
    ]);

    if (donHang.MaKH) {
      await this.diemTichLuyService.tinhDiemTuDonHang(
        donHang.MaKH,
        donHang.MaDonHang,
        Number(donHang.TongTien || 0),
      );
    }

    return this.donHangQueryService.layChiTietDonHangKhongKiemTraQuyen(
      String(donHang.MaDonHang),
    );
  }

  async layOrderDangMoTaiBan(maBan: string) {
    const danhSach = await this.mysql.truyVan(
      "SELECT * FROM DonHang WHERE (MaBan = ? OR MaBanAn = ?) AND TrangThai NOT IN ('Paid', 'Cancelled') ORDER BY NgayTao DESC LIMIT 1",
      [maBan, maBan],
    );
    if (!danhSach[0]) {
      return {
        success: true,
        data: null,
        message: 'Ban chua co order dang mo',
        meta: null,
      };
    }
    return this.donHangQueryService.layChiTietDonHangKhongKiemTraQuyen(
      String(danhSach[0].MaDonHang),
    );
  }
}
