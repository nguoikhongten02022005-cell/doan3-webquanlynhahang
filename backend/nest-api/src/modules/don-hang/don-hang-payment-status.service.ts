import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { DonHangQueryService } from './don-hang-query.service';
import { DiemTichLuyService } from '../diem-tich-luy/diem-tich-luy.service';
import { taoPhanHoi } from '../../common/phan-hoi';

const TRANG_THAI_DON_HANG_HOP_LE = new Set([
  'Pending', 'Confirmed', 'Preparing', 'Ready', 'Served', 'Paid', 'Cancelled',
]);

@Injectable()
export class DonHangPaymentStatusService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly donHangQueryService: DonHangQueryService,
    private readonly diemTichLuyService: DiemTichLuyService,
  ) {}

  /**
   * Phan giai tham so nguoi dung nhap: SoBan (1,2,3...) hoac MaBan (B001, B002...).
   * Tra ve MaBan chinh xac hoac null neu khong ton tai.
   */
  private async timMaBan(giaTri: string): Promise<string | null> {
    if (!giaTri) return null;
    const [banTheoMa] = await this.mysql.truyVan(
      'SELECT MaBan FROM Ban WHERE MaBan = ? LIMIT 1',
      [giaTri],
    );
    if (banTheoMa) return banTheoMa.MaBan;
    const so = Number(giaTri);
    if (Number.isFinite(so) && so > 0) {
      const [banTheoSo] = await this.mysql.truyVan(
        'SELECT MaBan FROM Ban WHERE SoBan = ? LIMIT 1',
        [so],
      );
      if (banTheoSo) return banTheoSo.MaBan;
    }
    return null;
  }

  async capNhatTrangThaiDonHang(maDonHang: string, trangThai: string) {
    if (!TRANG_THAI_DON_HANG_HOP_LE.has(trangThai)) {
      throw new BadRequestException(`Trang thai '${trangThai}' khong hop le.`);
    }
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
        await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Available', don.MaBan]);
      }
      if (don.MaKH) {
        await this.diemTichLuyService.tinhDiemTuDonHang(don.MaKH, maDonHang, Number(don.TongTien || 0));
      }
    }
    return this.donHangQueryService.layChiTietDonHangKhongKiemTraQuyen(maDonHang);
  }

  async yeuCauThanhToanTaiBan(maBan: string) {
    const ma = await this.timMaBan(maBan);
    if (!ma) throw new NotFoundException('Khong tim thay ban.');
    const danhSach = await this.mysql.truyVan(
      "SELECT * FROM DonHang WHERE MaBan = ? AND TrangThai NOT IN ('Paid', 'Cancelled') ORDER BY NgayTao DESC LIMIT 1",
      [ma],
    );
    if (!danhSach[0]) {
      throw new NotFoundException('Ban chua co order de thanh toan.');
    }
    await this.mysql.thucThi('UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?', ['Ready', danhSach[0].MaDonHang]);
    await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Reserved', ma]);
    return this.donHangQueryService.layChiTietDonHangKhongKiemTraQuyen(String(danhSach[0].MaDonHang));
  }

  async xacNhanThanhToanTaiBan(maBan: string) {
    const ma = await this.timMaBan(maBan);
    if (!ma) throw new NotFoundException('Khong tim thay ban.');
    const danhSach = await this.mysql.truyVan(
      "SELECT * FROM DonHang WHERE MaBan = ? AND TrangThai NOT IN ('Paid', 'Cancelled') ORDER BY NgayTao DESC LIMIT 1",
      [ma],
    );
    if (!danhSach[0]) {
      throw new NotFoundException('Ban chua co order de xac nhan thanh toan.');
    }

    const donHang = danhSach[0];
    await this.mysql.thucThi('UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?', ['Paid', donHang.MaDonHang]);
    await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Available', ma]);

    if (donHang.MaKH) {
      await this.diemTichLuyService.tinhDiemTuDonHang(donHang.MaKH, donHang.MaDonHang, Number(donHang.TongTien || 0));
    }

    return this.donHangQueryService.layChiTietDonHangKhongKiemTraQuyen(String(donHang.MaDonHang));
  }

  async layOrderDangMoTaiBan(maBan: string) {
    const ma = await this.timMaBan(maBan);
    if (!ma) throw new NotFoundException('Khong tim thay ban.');
    const danhSach = await this.mysql.truyVan(
      "SELECT * FROM DonHang WHERE MaBan = ? AND TrangThai NOT IN ('Paid', 'Cancelled') ORDER BY NgayTao DESC LIMIT 1",
      [ma],
    );
    if (!danhSach[0]) {
      return taoPhanHoi(null, 'Ban chua co order dang mo');
    }
    return this.donHangQueryService.layChiTietDonHangKhongKiemTraQuyen(String(danhSach[0].MaDonHang));
  }
}
