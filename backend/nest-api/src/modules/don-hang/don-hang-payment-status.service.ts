import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { DonHangQueryService } from './don-hang-query.service';
import { DiemTichLuyService } from '../diem-tich-luy/diem-tich-luy.service';
import { taoPhanHoi } from '../../common/phan-hoi';
import { taoMa } from '../../common/tao-ma';
import { resolveMaBan } from '../../common/ban-resolver';

const TRANG_THAI_DON_HANG_HOP_LE = new Set([
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Served',
  'Paid',
  'Cancelled',
]);

@Injectable()
export class DonHangPaymentStatusService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly donHangQueryService: DonHangQueryService,
    private readonly diemTichLuyService: DiemTichLuyService,
  ) {}

  private async timMaBan(giaTri: string): Promise<string | null> {
    return resolveMaBan(this.mysql, giaTri);
  }

  async capNhatTrangThaiDonHang(maDonHang: string, trangThai: string) {
    if (!TRANG_THAI_DON_HANG_HOP_LE.has(trangThai)) {
      throw new BadRequestException(`Trạng thái '${trangThai}' không hợp lệ.`);
    }
    const [don] = await this.mysql.truyVan(
      'SELECT * FROM DonHang WHERE MaDonHang = ? LIMIT 1',
      [maDonHang],
    );
    if (!don) {
      throw new NotFoundException('Không tìm thấy đơn hàng.');
    }

    return this.mysql.giaoDich(async (ketNoi) => {
      await ketNoi.execute(
        'UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?',
        [trangThai, maDonHang],
      );

      if (trangThai === 'Paid') {
        if (don.MaBan) {
          await ketNoi.execute('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', [
            'Available',
            don.MaBan,
          ]);
        }
        if (don.MaKH) {
          await this.diemTichLuyService.tinhDiemTuDonHang(
            don.MaKH,
            maDonHang,
            Number(don.TongTien || 0),
            undefined,
            ketNoi,
          );
        }

        const [chiTietRows] = await ketNoi.query(
          'SELECT * FROM ChiTietDonHang WHERE MaDonHang = ?',
          [maDonHang],
        );
        const chiTiet = chiTietRows as any[];
        const tongTienHang = chiTiet.reduce(
          (sum: number, ct: any) => sum + Number(ct.ThanhTien || 0),
          0,
        );
        const tienGiam =
          Number(don.TongTien || 0) > 0
            ? Math.max(0, tongTienHang - Number(don.TongTien || 0))
            : 0;
        const thanhToan = Number(don.TongTien || 0);
        const maHoaDon = taoMa('HD');

        await ketNoi.execute(
          'INSERT INTO HoaDon (MaHoaDon, MaDonHang, MaNV, TongTien, GiamGia, ThanhTien, GhiChu, NgayXuat) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
          [
            maHoaDon,
            maDonHang,
            don.MaNV || null,
            tongTienHang,
            tienGiam,
            thanhToan,
            '',
          ],
        );

        await ketNoi.execute(
          'INSERT INTO ThanhToan (MaThanhToan, MaHoaDon, PhuongThuc, SoTien, TrangThai, ThoiGian) VALUES (?, ?, ?, ?, ?, NOW())',
          [taoMa('TT'), maHoaDon, 'TienMat', thanhToan, 'Success'],
        );
      }

      return this.donHangQueryService.layChiTietDonHangKhongKiemTraQuyen(
        maDonHang,
      );
    });
  }

  async yeuCauThanhToanTaiBan(maBan: string) {
    const ma = await this.timMaBan(maBan);
    if (!ma) throw new NotFoundException('Không tìm thấy bàn.');
    const danhSach = await this.mysql.truyVan(
      "SELECT * FROM DonHang WHERE MaBan = ? AND TrangThai NOT IN ('Paid', 'Cancelled') ORDER BY NgayTao DESC LIMIT 1",
      [ma],
    );
    if (!danhSach[0]) {
      throw new NotFoundException('Bàn chưa có order để thanh toán.');
    }
    await this.mysql.thucThi(
      'UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?',
      ['Ready', danhSach[0].MaDonHang],
    );
    await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', [
      'Reserved',
      ma,
    ]);
    return this.donHangQueryService.layChiTietDonHangKhongKiemTraQuyen(
      String(danhSach[0].MaDonHang),
    );
  }

  async xacNhanThanhToanTaiBan(maBan: string) {
    const ma = await this.timMaBan(maBan);
    if (!ma) throw new NotFoundException('Không tìm thấy bàn.');
    const danhSach = await this.mysql.truyVan(
      "SELECT * FROM DonHang WHERE MaBan = ? AND TrangThai NOT IN ('Paid', 'Cancelled') ORDER BY NgayTao DESC LIMIT 1",
      [ma],
    );
    if (!danhSach[0]) {
      throw new NotFoundException('Bàn chưa có order để xác nhận thanh toán.');
    }

    const donHang = danhSach[0];

    return this.mysql.giaoDich(async (ketNoi) => {
      await ketNoi.execute(
        'UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?',
        ['Paid', donHang.MaDonHang],
      );
      await ketNoi.execute('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', [
        'Available',
        ma,
      ]);

      if (donHang.MaKH) {
        await this.diemTichLuyService.tinhDiemTuDonHang(
          donHang.MaKH,
          donHang.MaDonHang,
          Number(donHang.TongTien || 0),
          undefined,
          ketNoi,
        );
      }

      // Tạo HoaDon + ThanhToan để V_DoanhThuNgay tính đúng doanh thu
      const [chiTietRows] = await ketNoi.query(
        'SELECT * FROM ChiTietDonHang WHERE MaDonHang = ?',
        [donHang.MaDonHang],
      );
      const chiTiet = chiTietRows as any[];
      const tongTienHang = chiTiet.reduce(
        (sum: number, ct: any) => sum + Number(ct.ThanhTien || 0),
        0,
      );
      const tienGiam =
        Number(donHang.TongTien || 0) > 0
          ? Math.max(0, tongTienHang - Number(donHang.TongTien || 0))
          : 0;
      const thanhToan = Number(donHang.TongTien || 0);
      const maHoaDon = taoMa('HD');

      await ketNoi.execute(
        'INSERT INTO HoaDon (MaHoaDon, MaDonHang, MaNV, TongTien, GiamGia, ThanhTien, GhiChu, NgayXuat) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [
          maHoaDon,
          donHang.MaDonHang,
          donHang.MaNV || null,
          tongTienHang,
          tienGiam,
          thanhToan,
          '',
        ],
      );

      await ketNoi.execute(
        'INSERT INTO ThanhToan (MaThanhToan, MaHoaDon, PhuongThuc, SoTien, TrangThai, ThoiGian) VALUES (?, ?, ?, ?, ?, NOW())',
        [taoMa('TT'), maHoaDon, 'TienMat', thanhToan, 'Success'],
      );

      return this.donHangQueryService.layChiTietDonHangKhongKiemTraQuyen(
        String(donHang.MaDonHang),
      );
    });
  }

  async capNhatTrangThaiChiTietMon(
    maDonHang: string,
    maChiTiet: string,
    trangThai: string,
  ) {
    const trangThaiHopLe = new Set(['Preparing', 'Ready', 'Served']);
    if (!trangThaiHopLe.has(trangThai)) {
      throw new BadRequestException(
        `Trạng thái '${trangThai}' không hợp lệ. Chỉ chấp nhận: Preparing, Ready, Served.`,
      );
    }

    return this.mysql.giaoDich(async (ketNoi) => {
      await ketNoi.execute(
        'UPDATE ChiTietDonHang SET TrangThai = ? WHERE MaChiTiet = ? AND MaDonHang = ?',
        [trangThai, maChiTiet, maDonHang],
      );

      const [tatCaRows] = await ketNoi.query(
        'SELECT TrangThai FROM ChiTietDonHang WHERE MaDonHang = ?',
        [maDonHang],
      );
      const tatCa = tatCaRows as any[];

      if (tatCa.length === 0) {
        throw new NotFoundException('Không tìm thấy chi tiết đơn hàng.');
      }

      const tatCaDeuReady = tatCa.every(
        (ct: any) => ct.TrangThai === 'Ready' || ct.TrangThai === 'Served',
      );
      const coMonDangLam = tatCa.some(
        (ct: any) => ct.TrangThai === 'Preparing',
      );

      if (tatCaDeuReady) {
        await ketNoi.execute(
          'UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?',
          ['Ready', maDonHang],
        );
      } else if (coMonDangLam) {
        await ketNoi.execute(
          'UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?',
          ['Preparing', maDonHang],
        );
      }

      return this.donHangQueryService.layChiTietDonHangKhongKiemTraQuyen(
        maDonHang,
      );
    });
  }

  async layOrderDangMoTaiBan(maBan: string) {
    const ma = await this.timMaBan(maBan);
    if (!ma) throw new NotFoundException('Không tìm thấy bàn.');
    const danhSach = await this.mysql.truyVan(
      "SELECT * FROM DonHang WHERE MaBan = ? AND TrangThai NOT IN ('Paid', 'Cancelled') ORDER BY NgayTao DESC LIMIT 1",
      [ma],
    );
    if (!danhSach[0]) {
      return taoPhanHoi(null, 'Bàn chưa có order đang mở');
    }
    return this.donHangQueryService.layChiTietDonHangKhongKiemTraQuyen(
      String(danhSach[0].MaDonHang),
    );
  }
}
