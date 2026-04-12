import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { AuthService } from '../auth/auth.service';
import { ThucDonService } from '../thuc-don/thuc-don.service';

type BanGhi = Record<string, any>;

@Injectable()
export class BanTrangThaiQrService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly authService: AuthService,
    private readonly thucDonService: ThucDonService,
  ) {}

  private readonly urlFrontend = process.env.FRONTEND_ORIGIN?.trim() || '';

  private taoPhanHoi(duLieu: unknown, thongDiep = 'Thanh cong', meta: unknown = null) {
    return { success: true, data: duLieu, message: thongDiep, meta };
  }

  private yeuCauQuyenNhanVienHoacQuanTri(authorization?: string) {
    const thongTinToken = this.authService.yeuCauDangNhapNoiBo(authorization);
    const vaiTro = String(thongTinToken.vaiTro || '');

    if (vaiTro !== 'Admin' && vaiTro !== 'NhanVien') {
      throw new ForbiddenException('Ban khong co quyen thuc hien thao tac noi bo nay.');
    }

    return thongTinToken;
  }

  async capNhatTrangThaiBan(authorization: string | undefined, maBan: string, trangThai: string) {
    this.yeuCauQuyenNhanVienHoacQuanTri(authorization);

    const map = new Map<string, string>([
      ['TRONG', 'Available'],
      ['CO_KHACH', 'Occupied'],
      ['CHO_THANH_TOAN', 'Reserved'],
      ['Available', 'Available'],
      ['Occupied', 'Occupied'],
      ['Reserved', 'Reserved'],
    ]);

    await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', [map.get(trangThai) || trangThai, maBan]);
    return this.taoPhanHoi({ maBan, trangThai }, 'Cap nhat trang thai ban thanh cong');
  }

  async layQrBan(authorization: string | undefined, maBan: string) {
    this.yeuCauQuyenNhanVienHoacQuanTri(authorization);

    const danhSach = await this.mysql.truyVan('SELECT * FROM Ban WHERE MaBan = ? LIMIT 1', [maBan]);
    const ban = danhSach[0];
    if (!ban) {
      throw new NotFoundException('Khong tim thay ban.');
    }

    const url = `${this.urlFrontend}/ban/${maBan}/goi-mon`;
    return this.taoPhanHoi(
      {
        maBan,
        tenBan: ban.TenBan,
        khuVuc: ban.KhuVuc || ban.ViTri || '',
        url,
        qrBase64: '',
      },
      'Lay QR ban thanh cong',
    );
  }

  async layThucDonTheoBan(maBan: string) {
    const [ban] = await this.mysql.truyVan('SELECT * FROM Ban WHERE MaBan = ? LIMIT 1', [maBan]);
    if (!ban) {
      throw new NotFoundException('Ban khong ton tai.');
    }

    const monAn = (await this.thucDonService.layThucDon()).data;
    return this.taoPhanHoi({ ban: { maBan: ban.MaBan, tenBan: ban.TenBan, soBan: ban.SoBan }, monAn }, 'Lay thuc don theo ban thanh cong');
  }
}
