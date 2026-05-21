import { Injectable, NotFoundException } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { ThucDonService } from '../thuc-don/thuc-don.service';
import { taoPhanHoi } from '../../common/phan-hoi';
import { resolveMaBan } from '../../common/ban-resolver';
import { chuanHoaTrangThaiBan, TRANG_THAI_BAN } from '../../common/constants';

@Injectable()
export class BanTrangThaiQrService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly thucDonService: ThucDonService,
  ) {}

  private readonly urlFrontend = process.env.FRONTEND_ORIGIN?.trim() || '';

  private async timMaBan(giaTri: string): Promise<string | null> {
    return resolveMaBan(this.mysql, giaTri);
  }

  async capNhatTrangThaiBan(maBan: string, trangThai: string) {
    const ma = await this.timMaBan(maBan);
    if (!ma) throw new NotFoundException('Không tìm thấy bàn.');

    const trangThaiDaChuanHoa = chuanHoaTrangThaiBan(trangThai);

    await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', [
      trangThaiDaChuanHoa,
      ma,
    ]);
    return taoPhanHoi(
      { maBan: ma, trangThai: trangThaiDaChuanHoa },
      'Cap nhat trang thai ban thanh cong',
    );
  }

  async layQrBan(maBan: string) {
    const ma = await this.timMaBan(maBan);
    if (!ma) throw new NotFoundException('Không tìm thấy bàn.');

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
    if (!ma) throw new NotFoundException('Bàn không tồn tại.');

    const [ban] = await this.mysql.truyVan(
      'SELECT * FROM Ban WHERE MaBan = ? LIMIT 1',
      [ma],
    );

    const monAn = (await this.thucDonService.layThucDon(true)).data;
    return taoPhanHoi(
      {
        ban: { maBan: ban.MaBan, tenBan: ban.TenBan, soBan: ban.SoBan },
        monAn,
      },
      'Lay thuc don theo ban thanh cong',
    );
  }
}
