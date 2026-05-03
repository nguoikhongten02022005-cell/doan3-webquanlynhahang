import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { AuthService } from '../auth/auth.service';

type BanGhi = Record<string, any>;

@Injectable()
export class MaGiamGiaService {
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

  yeuCauQuyenQuanTri(authorization: string | undefined) {
    return this.authService.yeuCauQuyenQuanTri(authorization);
  }

  kiemTraMaGiamGia(payload: BanGhi) {
    return this.thucHienKiemTraMaGiamGia(payload);
  }

  private async thucHienKiemTraMaGiamGia(payload: BanGhi) {
    const maCode = String(payload.maCode || '').trim();
    const tongTien = Number(payload.tongTien || 0);
    const [ma] = await this.mysql.truyVan(
      'SELECT * FROM MaGiamGia WHERE MaCode = ? LIMIT 1',
      [maCode],
    );
    if (!ma) {
      throw new NotFoundException('Khong tim thay ma giam gia.');
    }
    if (tongTien < Number(ma.DonHangToiThieu || 0)) {
      throw new BadRequestException(
        'Don hang chua du dieu kien ap dung ma giam gia.',
      );
    }

    const laPhanTram = String(ma.LoaiGiam || '').toLowerCase() === 'phantram';
    const giaTriGiam = Number(ma.GiaTri || 0);
    const giamToiDa = ma.GiaTriToiDa == null ? null : Number(ma.GiaTriToiDa);
    const soTienGiamTamTinh = laPhanTram
      ? Math.round((tongTien * giaTriGiam) / 100)
      : giaTriGiam;
    const soTienGiamThucTe =
      giamToiDa == null
        ? soTienGiamTamTinh
        : Math.min(soTienGiamTamTinh, giamToiDa);

    return this.taoPhanHoi(
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
    return this.taoPhanHoi(danhSach, 'Lay danh sach ma giam gia thanh cong');
  }

  async layChiTiet(maCode: string) {
    const [ma] = await this.mysql.truyVan(
      'SELECT * FROM MaGiamGia WHERE MaCode = ? LIMIT 1',
      [maCode],
    );
    if (!ma) {
      throw new NotFoundException('Khong tim thay ma giam gia.');
    }
    return this.taoPhanHoi(ma, 'Lay chi tiet ma giam gia thanh cong');
  }

  async taoMa(authorization: string | undefined, payload: BanGhi) {
    this.yeuCauQuyenQuanTri(authorization);

    const {
      maCode,
      tenCode,
      giaTri,
      loaiGiam,
      giaTriToiDa,
      donHangToiThieu,
      ngayBatDau,
      ngayKetThuc,
      soLanToiDa,
      trangThai,
    } = payload;

    if (
      !maCode ||
      !tenCode ||
      giaTri == null ||
      !loaiGiam ||
      !ngayBatDau ||
      !ngayKetThuc
    ) {
      throw new BadRequestException('Thieu thong tin bat buoc.');
    }

    const [tonTai] = await this.mysql.truyVan(
      'SELECT MaCode FROM MaGiamGia WHERE MaCode = ? LIMIT 1',
      [maCode],
    );
    if (tonTai) {
      throw new BadRequestException('Ma code da ton tai.');
    }

    await this.mysql.thucThi(
      `INSERT INTO MaGiamGia
        (MaCode, TenCode, GiaTri, LoaiGiam, GiaTriToiDa, DonHangToiThieu,
         NgayBatDau, NgayKetThuc, SoLanToiDa, SoLanDaDung, TrangThai)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        maCode,
        tenCode,
        giaTri,
        loaiGiam,
        giaTriToiDa == null ? null : giaTriToiDa,
        donHangToiThieu == null ? null : donHangToiThieu,
        ngayBatDau,
        ngayKetThuc,
        soLanToiDa == null ? null : soLanToiDa,
        trangThai || 'Active',
      ],
    );

    return this.taoPhanHoi({ maCode }, 'Tao ma giam gia thanh cong');
  }

  async capNhatMa(
    authorization: string | undefined,
    maCode: string,
    payload: BanGhi,
  ) {
    this.yeuCauQuyenQuanTri(authorization);

    const [tonTai] = await this.mysql.truyVan(
      'SELECT MaCode FROM MaGiamGia WHERE MaCode = ? LIMIT 1',
      [maCode],
    );
    if (!tonTai) {
      throw new NotFoundException('Khong tim thay ma giam gia.');
    }

    const {
      tenCode,
      giaTri,
      loaiGiam,
      giaTriToiDa,
      donHangToiThieu,
      ngayBatDau,
      ngayKetThuc,
      soLanToiDa,
      trangThai,
    } = payload;

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

    return this.taoPhanHoi({ maCode }, 'Cap nhat ma giam gia thanh cong');
  }

  async xoaMa(authorization: string | undefined, maCode: string) {
    this.yeuCauQuyenQuanTri(authorization);

    const [tonTai] = await this.mysql.truyVan(
      'SELECT MaCode FROM MaGiamGia WHERE MaCode = ? LIMIT 1',
      [maCode],
    );
    if (!tonTai) {
      throw new NotFoundException('Khong tim thay ma giam gia.');
    }

    await this.mysql.thucThi('DELETE FROM MaGiamGia WHERE MaCode = ?', [
      maCode,
    ]);

    return this.taoPhanHoi({ maCode }, 'Xoa ma giam gia thanh cong');
  }
}
