import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { taoPhanHoi } from '../../common/phan-hoi';
import { tinhGiamGia } from '../../common/tinh-giam-gia.helper';
import { BanGhi } from '../../common/types';

@Injectable()
export class MaGiamGiaService {
  constructor(private readonly mysql: MySqlService) {}

  async kiemTraMaGiamGia(payload: BanGhi) {
    const maCode = String(payload.maCode || '').trim();
    const tongTien = Number(payload.tongTien || 0);
    const [ma] = await this.mysql.truyVan('SELECT * FROM MaGiamGia WHERE MaCode = ? LIMIT 1', [maCode]);
    if (!ma) throw new NotFoundException('Khong tim thay ma giam gia.');
    if (String(ma.TrangThai || '') !== 'Active') throw new BadRequestException('Ma giam gia khong con hieu luc.');

    const now = new Date();
    if (ma.NgayBatDau && new Date(ma.NgayBatDau) > now) throw new BadRequestException('Ma giam gia chua den thoi gian ap dung.');
    if (ma.NgayKetThuc && new Date(ma.NgayKetThuc) < now) throw new BadRequestException('Ma giam gia da het han.');

    if (ma.SoLanToiDa != null && Number(ma.SoLanDaDung) >= Number(ma.SoLanToiDa)) {
      throw new BadRequestException('Ma giam gia da dat gioi han su dung.');
    }

    if (tongTien < Number(ma.DonHangToiThieu || 0)) {
      throw new BadRequestException('Don hang chua du dieu kien ap dung ma giam gia.');
    }

    const { laPhanTram, giaTriGiam, giamToiDa, soTienGiamThucTe } = tinhGiamGia(tongTien, ma);

    return taoPhanHoi(
      {
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
      },
      'Kiem tra ma giam gia thanh cong',
    );
  }

  async layDanhSach() {
    const danhSach = await this.mysql.truyVan(
      `SELECT MaCode, TenCode, GiaTri, LoaiGiam, GiaTriToiDa, DonHangToiThieu,
              NgayBatDau, NgayKetThuc, SoLanToiDa, SoLanDaDung, TrangThai
       FROM MaGiamGia
       ORDER BY NgayBatDau DESC`,
    );
    return taoPhanHoi(danhSach, 'Lay danh sach ma giam gia thanh cong');
  }

  async layChiTiet(maCode: string) {
    const [ma] = await this.mysql.truyVan('SELECT * FROM MaGiamGia WHERE MaCode = ? LIMIT 1', [maCode]);
    if (!ma) throw new NotFoundException('Khong tim thay ma giam gia.');
    return taoPhanHoi(ma, 'Lay chi tiet ma giam gia thanh cong');
  }

  async taoMaGiamGia(payload: BanGhi) {
    const { maCode, tenCode, giaTri, loaiGiam, giaTriToiDa, donHangToiThieu, ngayBatDau, ngayKetThuc, soLanToiDa, trangThai } = payload;

    if (!maCode || !tenCode || giaTri == null || !loaiGiam || !ngayBatDau || !ngayKetThuc) {
      throw new BadRequestException('Thieu thong tin bat buoc.');
    }

    const [tonTai] = await this.mysql.truyVan('SELECT MaCode FROM MaGiamGia WHERE MaCode = ? LIMIT 1', [maCode]);
    if (tonTai) throw new BadRequestException('Ma code da ton tai.');

    await this.mysql.thucThi(
      `INSERT INTO MaGiamGia
        (MaCode, TenCode, GiaTri, LoaiGiam, GiaTriToiDa, DonHangToiThieu,
         NgayBatDau, NgayKetThuc, SoLanToiDa, SoLanDaDung, TrangThai)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        maCode, tenCode, giaTri, loaiGiam,
        giaTriToiDa == null ? null : giaTriToiDa,
        donHangToiThieu == null ? null : donHangToiThieu,
        ngayBatDau, ngayKetThuc,
        soLanToiDa == null ? null : soLanToiDa,
        trangThai || 'Active',
      ],
    );

    return taoPhanHoi({ maCode }, 'Tao ma giam gia thanh cong');
  }

  async capNhatMa(maCode: string, payload: BanGhi) {
    const [tonTai] = await this.mysql.truyVan('SELECT MaCode FROM MaGiamGia WHERE MaCode = ? LIMIT 1', [maCode]);
    if (!tonTai) throw new NotFoundException('Khong tim thay ma giam gia.');

    const { tenCode, giaTri, loaiGiam, giaTriToiDa, donHangToiThieu, ngayBatDau, ngayKetThuc, soLanToiDa, trangThai } = payload;

    await this.mysql.thucThi(
      `UPDATE MaGiamGia SET
        TenCode = COALESCE(?, TenCode),
        GiaTri = COALESCE(?, GiaTri),
        LoaiGiam = COALESCE(?, LoaiGiam),
        GiaTriToiDa = ?,
        DonHangToiThieu = COALESCE(?, DonHangToiThieu),
        NgayBatDau = COALESCE(?, NgayBatDau),
        NgayKetThuc = COALESCE(?, NgayKetThuc),
        SoLanToiDa = ?,
        TrangThai = COALESCE(?, TrangThai)
       WHERE MaCode = ?`,
      [
        tenCode == null ? null : tenCode,
        giaTri == null ? null : giaTri,
        loaiGiam == null ? null : loaiGiam,
        giaTriToiDa == null ? null : giaTriToiDa,
        donHangToiThieu == null ? null : donHangToiThieu,
        ngayBatDau == null ? null : ngayBatDau,
        ngayKetThuc == null ? null : ngayKetThuc,
        soLanToiDa == null ? null : soLanToiDa,
        trangThai == null ? null : trangThai,
        maCode,
      ],
    );

    return taoPhanHoi({ maCode }, 'Cap nhat ma giam gia thanh cong');
  }

  async xoaMa(maCode: string) {
    const [tonTai] = await this.mysql.truyVan('SELECT MaCode FROM MaGiamGia WHERE MaCode = ? LIMIT 1', [maCode]);
    if (!tonTai) throw new NotFoundException('Khong tim thay ma giam gia.');

    await this.mysql.thucThi('DELETE FROM MaGiamGia WHERE MaCode = ?', [maCode]);
    return taoPhanHoi({ maCode }, 'Xoa ma giam gia thanh cong');
  }
}
