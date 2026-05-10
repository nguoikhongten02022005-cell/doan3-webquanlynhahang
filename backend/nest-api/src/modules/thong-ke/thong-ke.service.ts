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

  async layMonBanChay(limit: number = 10) {
    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM V_MonBanChay LIMIT ?',
      [limit],
    );
    return taoPhanHoi(danhSach, 'Lấy món bán chạy thành công');
  }

  async layTinhTrangBan() {
    const danhSach = await this.mysql.truyVan('SELECT * FROM V_TinhTrangBan');
    return taoPhanHoi(danhSach, 'Lấy tình trạng bàn thành công');
  }

  async layTongQuan() {
    const homNay = new Date().toISOString().split('T')[0];

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
}