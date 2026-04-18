import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';

type BanGhi = Record<string, any>;

@Injectable()
export class MaGiamGiaService {
  constructor(private readonly mysql: MySqlService) {}

  private taoPhanHoi(duLieu: unknown, thongDiep = 'Thanh cong', meta: unknown = null) {
    return { success: true, data: duLieu, message: thongDiep, meta };
  }

  kiemTraMaGiamGia(payload: BanGhi) {
    return this.thucHienKiemTraMaGiamGia(payload);
  }

  private async thucHienKiemTraMaGiamGia(payload: BanGhi) {
    const maCode = String(payload.maCode || '').trim();
    const tongTien = Number(payload.tongTien || 0);
    const [ma] = await this.mysql.truyVan('SELECT * FROM MaGiamGia WHERE MaCode = ? LIMIT 1', [maCode]);
    if (!ma) {
      throw new NotFoundException('Khong tim thay ma giam gia.');
    }
    if (tongTien < Number(ma.DonHangToiThieu || 0)) {
      throw new BadRequestException('Don hang chua du dieu kien ap dung ma giam gia.');
    }

    const laPhanTram = String(ma.LoaiGiam || '').toLowerCase() === 'phantram';
    const giaTriGiam = Number(ma.GiaTri || 0);
    const giamToiDa = ma.GiaTriToiDa == null ? null : Number(ma.GiaTriToiDa);
    const soTienGiamTamTinh = laPhanTram ? Math.round((tongTien * giaTriGiam) / 100) : giaTriGiam;
    const soTienGiamThucTe = giamToiDa == null ? soTienGiamTamTinh : Math.min(soTienGiamTamTinh, giamToiDa);

    return this.taoPhanHoi({
      hopLe: true,
      maGiamGia: ma.MaCode,
      tenGiamGia: ma.TenCode,
      loaiGiam: ma.LoaiGiam,
      giaTriGiam,
      giamToiDa,
      dieuKienToiThieu: Number(ma.DonHangToiThieu || 0),
      soTienGiamThucTe,
      thongDiep: '',
      maCode: ma.MaCode,
      tenCode: ma.TenCode,
      giaTri: giaTriGiam,
      giaTriToiDa: giamToiDa,
      donHangToiThieu: Number(ma.DonHangToiThieu || 0),
      moTa: '',
    }, 'Kiem tra ma giam gia thanh cong');
  }
}
