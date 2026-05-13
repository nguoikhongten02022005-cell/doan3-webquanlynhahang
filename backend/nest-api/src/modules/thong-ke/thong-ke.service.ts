import { Injectable } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { taoPhanHoi } from '../../common/phan-hoi';

@Injectable()
export class ThongKeService {
  constructor(private readonly mysql: MySqlService) {}

  async layDoanhThuNgay(tuNgay: string, denNgay: string) {
    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM V_DoanhThuNgay WHERE Ngay BETWEEN ? AND ? ORDER BY Ngay ASC',
      [tuNgay, denNgay],
    );
    return taoPhanHoi(danhSach, 'Lấy doanh thu theo ngày thành công');
  }

  async layMonBanChay(limit: number = 10, tuNgay?: string, denNgay?: string) {
    const params: any[] = [];
    let dateFilter = '';

    if (tuNgay && denNgay) {
      dateFilter = 'AND DATE(hd.NgayXuat) BETWEEN ? AND ?';
      params.push(tuNgay, denNgay);
    }

    params.push(limit);

    const danhSach = await this.mysql.truyVan(
      `
      SELECT
        td.MaMon,
        td.TenMon,
        dm.TenDanhMuc,
        SUM(ct.SoLuong) AS TongSoLuong,
        SUM(ct.ThanhTien) AS TongDoanhThu
      FROM ChiTietDonHang ct
      JOIN ThucDon td ON td.MaMon = ct.MaMon
      JOIN DanhMuc dm ON dm.MaDanhMuc = td.MaDanhMuc
      JOIN DonHang dh ON dh.MaDonHang = ct.MaDonHang
      JOIN HoaDon hd ON hd.MaDonHang = dh.MaDonHang
      WHERE dh.TrangThai NOT IN ('Cancelled')
      ${dateFilter}
      GROUP BY td.MaMon, td.TenMon, dm.TenDanhMuc
      ORDER BY TongSoLuong DESC
      LIMIT ?
    `,
      params,
    );

    return taoPhanHoi(danhSach, 'Lấy món bán chạy thành công');
  }

  async layTinhTrangBan() {
    const danhSach = await this.mysql.truyVan('SELECT * FROM V_TinhTrangBan');
    return taoPhanHoi(danhSach, 'Lấy tình trạng bàn thành công');
  }

  async layTongQuan() {
    const homNay = new Date().toLocaleDateString('sv-SE', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });

    const [[doanhThuRow], [donRow], [banRow], [choRow]] = await Promise.all([
      this.mysql.truyVan(
        `SELECT COALESCE(SUM(TongTien), 0) AS tongDoanhThu
         FROM HoaDon
         WHERE DATE(NgayXuat) = ?`,
        [homNay],
      ),
      this.mysql.truyVan(
        `SELECT COUNT(*) AS tongDon
         FROM HoaDon
         WHERE DATE(NgayXuat) = ?`,
        [homNay],
      ),
      this.mysql.truyVan(
        `SELECT COUNT(*) AS soBanBan
         FROM Ban
         WHERE TrangThai = 'Occupied'`,
      ),
      this.mysql.truyVan(
        `SELECT COUNT(*) AS soDonCho
         FROM DonHang
         WHERE TrangThai IN ('Pending', 'Preparing')`,
      ),
    ]);

    return taoPhanHoi(
      {
        tongDoanhThu: Number(doanhThuRow?.tongDoanhThu ?? 0),
        tongDon: Number(donRow?.tongDon ?? 0),
        soBanBan: Number(banRow?.soBanBan ?? 0),
        soDonCho: Number(choRow?.soDonCho ?? 0),
      },
      'Lấy tổng quan thành công',
    );
  }

  async layDoanhThuTheoThang(nam: number) {
    const danhSach = await this.mysql.truyVan(
      `SELECT MONTH(NgayXuat) AS Thang, SUM(TongTien) AS DoanhThu
       FROM HoaDon
       WHERE YEAR(NgayXuat) = ?
       GROUP BY MONTH(NgayXuat)
       ORDER BY Thang ASC`,
      [nam],
    );
    return taoPhanHoi(danhSach, 'Lấy doanh thu theo tháng thành công');
  }

  async layBookingCount(tuNgay: string, denNgay: string) {
    const result = await this.mysql.truyVan(
      `
      SELECT COUNT(*) AS tongBooking
      FROM DatBan
      WHERE NgayDat BETWEEN ? AND ?
      AND TrangThai NOT IN ('Cancelled', 'NoShow')
    `,
      [tuNgay, denNgay],
    );

    return taoPhanHoi(result[0], 'Lấy số booking thành công');
  }
}
