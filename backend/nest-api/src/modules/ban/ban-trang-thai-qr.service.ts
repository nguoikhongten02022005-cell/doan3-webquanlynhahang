import { Injectable, NotFoundException } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { ThucDonService } from '../thuc-don/thuc-don.service';
import { taoPhanHoi } from '../../common/phan-hoi';
import { BanGhi } from '../../common/types';

@Injectable()
export class BanTrangThaiQrService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly thucDonService: ThucDonService,
  ) {}

  private readonly urlFrontend = process.env.FRONTEND_ORIGIN?.trim() || '';

  /**
   * Phan giai tham so nguoi dung nhap: SoBan (1,2,3...) hoac MaBan (B001, B002...).
   * Tra ve MaBan chinh xac hoac null neu khong ton tai.
   */
  private async timMaBan(giaTri: string): Promise<string | null> {
    if (!giaTri) return null;

    // Thu tim truc tiep theo MaBan (B001)
    const [banTheoMa] = await this.mysql.truyVan(
      'SELECT MaBan FROM Ban WHERE MaBan = ? LIMIT 1',
      [giaTri],
    );
    if (banTheoMa) return banTheoMa.MaBan;

    // Neu la so, tim theo SoBan
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

  async capNhatTrangThaiBan(maBan: string, trangThai: string) {
    const ma = await this.timMaBan(maBan);
    if (!ma) throw new NotFoundException('Khong tim thay ban.');
    const map = new Map<string, string>([
      ['TRONG', 'Available'],
      ['CO_KHACH', 'Occupied'],
      ['CHO_THANH_TOAN', 'Reserved'],
      ['Available', 'Available'],
      ['Occupied', 'Occupied'],
      ['Reserved', 'Reserved'],
    ]);

    await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', [
      map.get(trangThai) || trangThai,
      ma,
    ]);
    return taoPhanHoi({ maBan: ma, trangThai }, 'Cap nhat trang thai ban thanh cong');
  }

  async layQrBan(maBan: string) {
    const ma = await this.timMaBan(maBan);
    if (!ma) throw new NotFoundException('Khong tim thay ban.');

    const [ban] = await this.mysql.truyVan(
      'SELECT * FROM Ban WHERE MaBan = ? LIMIT 1',
      [ma],
    );

    const url = `${this.urlFrontend}/ban/${ma}/goi-mon`;
    return taoPhanHoi(
      {
        maBan: ma,
        tenBan: ban.TenBan,
        khuVuc: ban.KhuVuc || ban.ViTri || '',
        url,
        qrBase64: '',
      },
      'Lay QR ban thanh cong',
    );
  }

  async layThucDonTheoBan(maBan: string) {
    const ma = await this.timMaBan(maBan);
    if (!ma) throw new NotFoundException('Ban khong ton tai.');

    const [ban] = await this.mysql.truyVan(
      'SELECT * FROM Ban WHERE MaBan = ? LIMIT 1',
      [ma],
    );

    const monAn = (await this.thucDonService.layThucDon()).data;
    return taoPhanHoi(
      {
        ban: { maBan: ban.MaBan, tenBan: ban.TenBan, soBan: ban.SoBan },
        monAn,
      },
      'Lay thuc don theo ban thanh cong',
    );
  }
}
