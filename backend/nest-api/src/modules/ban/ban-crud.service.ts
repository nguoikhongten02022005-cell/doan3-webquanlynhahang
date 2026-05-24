import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { taoPhanHoi } from '../../common/phan-hoi';
import { BanGhi } from '../../common/types';
import { resolveMaBan } from '../../common/ban-resolver';
import { TRANG_THAI_BAN } from '../../common/constants';

@Injectable()
export class BanCrudService {
  constructor(private readonly mysql: MySqlService) {}

  async layDanhSachBan() {
    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM Ban ORDER BY SoBan ASC, NgayCapNhat DESC',
    );
    return taoPhanHoi(
      danhSach.map((ban: BanGhi) => ({
        maBan: ban.MaBan,
        tenBan: ban.TenBan,
        soBan: Number(ban.SoBan || 0),
        soChoNgoi: Number(ban.SoChoNgoi || 0),
        khuVuc: ban.KhuVuc,
        viTri: ban.ViTri,
        ghiChu: ban.GhiChu,
        trangThai: ban.TrangThai,
      })),
      'Lay danh sach ban thanh cong',
    );
  }

  async taoBan(body: BanGhi) {
    const soBan = Number(body.soBan || 0);
    const [banTrungSo] = await this.mysql.truyVan(
      'SELECT MaBan FROM Ban WHERE SoBan = ? LIMIT 1',
      [soBan],
    );
    if (banTrungSo) {
      throw new BadRequestException(`Số bàn ${soBan} đã tồn tại.`);
    }

    await this.mysql.thucThi(
      'INSERT INTO Ban (MaBan, TenBan, KhuVuc, SoBan, SoChoNgoi, ViTri, GhiChu, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        body.maBan,
        body.tenBan,
        body.khuVuc || null,
        soBan,
        Number(body.soChoNgoi || 0),
        body.viTri || null,
        body.ghiChu || null,
        TRANG_THAI_BAN.TRONG,
      ],
    );
    return taoPhanHoi({ maBan: body.maBan }, 'Tao ban thanh cong');
  }

  async capNhatBan(maBan: string, body: BanGhi) {
    const ma = await resolveMaBan(this.mysql, maBan);
    if (!ma) throw new NotFoundException('Không tìm thấy bàn.');
    const soBan = Number(body.soBan || 0);
    const [banTrungSo] = await this.mysql.truyVan(
      'SELECT MaBan FROM Ban WHERE SoBan = ? AND MaBan <> ? LIMIT 1',
      [soBan, ma],
    );
    if (banTrungSo) {
      throw new BadRequestException(`Số bàn ${soBan} đã tồn tại.`);
    }

    await this.mysql.thucThi(
      'UPDATE Ban SET TenBan = ?, KhuVuc = ?, SoBan = ?, SoChoNgoi = ?, ViTri = ?, GhiChu = ? WHERE MaBan = ?',
      [
        body.tenBan,
        body.khuVuc || null,
        soBan,
        Number(body.soChoNgoi || 0),
        body.viTri || null,
        body.ghiChu || null,
        ma,
      ],
    );
    return taoPhanHoi({ maBan: ma }, 'Cap nhat ban thanh cong');
  }

  async xoaBan(maBan: string) {
    const ma = await resolveMaBan(this.mysql, maBan);
    if (!ma) throw new NotFoundException('Không tìm thấy bàn.');
    await this.mysql.thucThi('DELETE FROM Ban WHERE MaBan = ?', [ma]);
    return taoPhanHoi(null, 'Xoa ban thanh cong');
  }
}
