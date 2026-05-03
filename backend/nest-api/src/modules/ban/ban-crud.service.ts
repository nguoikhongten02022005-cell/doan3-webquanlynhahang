import { Injectable } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { AuthService } from '../auth/auth.service';

type BanGhi = Record<string, any>;

@Injectable()
export class BanCrudService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly authService: AuthService,
  ) {}

  private taoPhanHoi(
    duLieu: unknown,
    thongDiep = 'Thanh cong',
    meta: unknown = null,
  ) {
    return { success: true, data: duLieu, message: thongDiep, meta };
  }

  layDanhSachBan() {
    return this.thucHienLayDanhSachBan();
  }

  async thucHienLayDanhSachBan() {
    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM Ban ORDER BY SoBan ASC, NgayCapNhat DESC',
    );
    return this.taoPhanHoi(
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

  async taoBan(authorization: string | undefined, body: BanGhi) {
    this.authService.yeuCauQuyenQuanTri(authorization);

    await this.mysql.thucThi(
      'INSERT INTO Ban (MaBan, TenBan, KhuVuc, SoBan, SoChoNgoi, ViTri, GhiChu, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        body.maBan,
        body.tenBan,
        body.khuVuc || null,
        Number(body.soBan || 0),
        Number(body.soChoNgoi || 0),
        body.viTri || null,
        body.ghiChu || null,
        'Available',
      ],
    );

    return this.taoPhanHoi({ maBan: body.maBan }, 'Tao ban thanh cong');
  }

  async capNhatBan(
    authorization: string | undefined,
    maBan: string,
    body: BanGhi,
  ) {
    this.authService.yeuCauQuyenQuanTri(authorization);

    await this.mysql.thucThi(
      'UPDATE Ban SET TenBan = ?, KhuVuc = ?, SoBan = ?, SoChoNgoi = ?, ViTri = ?, GhiChu = ? WHERE MaBan = ?',
      [
        body.tenBan,
        body.khuVuc || null,
        Number(body.soBan || 0),
        Number(body.soChoNgoi || 0),
        body.viTri || null,
        body.ghiChu || null,
        maBan,
      ],
    );

    return this.taoPhanHoi({ maBan }, 'Cap nhat ban thanh cong');
  }

  async xoaBan(authorization: string | undefined, maBan: string) {
    this.authService.yeuCauQuyenQuanTri(authorization);

    await this.mysql.thucThi('DELETE FROM Ban WHERE MaBan = ?', [maBan]);
    return this.taoPhanHoi(null, 'Xoa ban thanh cong');
  }
}
