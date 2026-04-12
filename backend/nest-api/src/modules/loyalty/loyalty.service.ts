import { Injectable } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class LoyaltyService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly authService: AuthService,
  ) {}

  private readonly TI_LE_TICH_DIEM_MAC_DINH = 10000;

  private taoPhanHoi(duLieu: unknown, thongDiep = 'Thanh cong', meta: unknown = null) {
    return { success: true, data: duLieu, message: thongDiep, meta };
  }

  private async layKhachHangTheoMaNd(maND: string) {
    const danhSach = await this.mysql.truyVan('SELECT * FROM KhachHang WHERE MaND = ? LIMIT 1', [maND]);
    return danhSach[0] || null;
  }

  private chuyenLichSuDiemSangResponse(giaoDich: Record<string, any>) {
    return {
      maGiaoDichDiem: giaoDich.MaGiaoDichDiem,
      maKH: giaoDich.MaKH,
      maDonHang: giaoDich.MaDonHang || '',
      loaiBienDong: giaoDich.LoaiBienDong,
      soDiem: Number(giaoDich.SoDiem || 0),
      soDiemTruoc: Number(giaoDich.SoDiemTruoc || 0),
      soDiemSau: Number(giaoDich.SoDiemSau || 0),
      moTa: giaoDich.MoTa || '',
      ngayTao: giaoDich.NgayTao,
    };
  }

  async layTongQuanDiemTichLuy(authorization?: string) {
    const thongTinToken = this.authService.giaiMaNguoiDung(authorization);
    const khachHang = await this.layKhachHangTheoMaNd(String(thongTinToken.maND));

    if (!khachHang) {
      return this.taoPhanHoi({ tongDiem: 0, diemCoTheDoi: 0, tiLeQuyDoi: this.TI_LE_TICH_DIEM_MAC_DINH }, 'Khong tim thay thong tin diem tich luy');
    }

    return this.taoPhanHoi({
      maKH: khachHang.MaKH,
      tongDiem: Number(khachHang.DiemTichLuy || 0),
      diemCoTheDoi: Number(khachHang.DiemTichLuy || 0),
      tiLeQuyDoi: this.TI_LE_TICH_DIEM_MAC_DINH,
    }, 'Lay tong quan diem tich luy thanh cong');
  }

  async layLichSuDiemTichLuy(authorization?: string) {
    const thongTinToken = this.authService.giaiMaNguoiDung(authorization);
    const khachHang = await this.layKhachHangTheoMaNd(String(thongTinToken.maND));

    if (!khachHang) {
      return this.taoPhanHoi([], 'Khong co lich su diem tich luy');
    }

    const lichSu = await this.mysql.truyVan('SELECT * FROM LichSuDiemTichLuy WHERE MaKH = ? ORDER BY NgayTao DESC', [khachHang.MaKH]);
    return this.taoPhanHoi(lichSu.map((giaoDich) => this.chuyenLichSuDiemSangResponse(giaoDich)), 'Lay lich su diem tich luy thanh cong');
  }
}
