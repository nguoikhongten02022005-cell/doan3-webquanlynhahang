import { Injectable, NotFoundException } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { taoPhanHoi } from '../../common/phan-hoi';

@Injectable()
export class ThongBaoService {
  constructor(private readonly mysql: MySqlService) {}

  async layDanhSachThongBao(maND: string) {
    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM ThongBao WHERE MaND = ? ORDER BY NgayTao DESC',
      [maND],
    );
    return taoPhanHoi(danhSach, 'Lấy danh sách thông báo thành công');
  }

  async danhDauDaDoc(maThongBao: string, maND: string) {
    const [thongBao] = await this.mysql.truyVan(
      'SELECT * FROM ThongBao WHERE MaThongBao = ? AND MaND = ? LIMIT 1',
      [maThongBao, maND],
    );
    if (!thongBao) {
      throw new NotFoundException('Không tìm thấy thông báo.');
    }
    await this.mysql.thucThi(
      'UPDATE ThongBao SET DaDoc = 1 WHERE MaThongBao = ?',
      [maThongBao],
    );
    return taoPhanHoi({ maThongBao, daDoc: true }, 'Đánh dấu đã đọc thành công');
  }

  async demChuaDoc(maND: string) {
    const [ketQua] = await this.mysql.truyVan(
      'SELECT COUNT(*) AS tong FROM ThongBao WHERE MaND = ? AND DaDoc = 0',
      [maND],
    );
    return taoPhanHoi({ soChuaDoc: Number(ketQua?.tong || 0) }, 'Lấy số thông báo chưa đọc thành công');
  }
}