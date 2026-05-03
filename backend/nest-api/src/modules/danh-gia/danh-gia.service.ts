import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { AuthService } from '../auth/auth.service';

type BanGhi = Record<string, any>;

@Injectable()
export class DanhGiaService {
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

  private taoMa(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  private async layKhachHangTheoMaNd(maND: string) {
    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM KhachHang WHERE MaND = ? LIMIT 1',
      [maND],
    );
    return danhSach[0] || null;
  }

  private chuyenDuLieuHinhAnhDanhGia(giaTri: unknown) {
    if (!giaTri) return [];
    if (Array.isArray(giaTri))
      return giaTri.filter(Boolean).map((item) => String(item));

    const chuoi = String(giaTri).trim();
    if (!chuoi) return [];

    try {
      const phanTich = JSON.parse(chuoi);
      return Array.isArray(phanTich)
        ? phanTich.filter(Boolean).map((item) => String(item))
        : [chuoi];
    } catch {
      return [chuoi];
    }
  }

  private chuyenHinhAnhDanhGia(giaTri: unknown) {
    if (giaTri == null) return null;
    if (Array.isArray(giaTri)) {
      const hopLe = giaTri.map((item) => String(item).trim()).filter(Boolean);
      return hopLe.length ? JSON.stringify(hopLe) : null;
    }

    const chuoi = String(giaTri).trim();
    if (!chuoi) return null;

    try {
      const phanTich = JSON.parse(chuoi);
      return Array.isArray(phanTich)
        ? JSON.stringify(phanTich.filter(Boolean).map((item) => String(item)))
        : chuoi;
    } catch {
      return chuoi;
    }
  }

  private async yeuCauKhachHangDanhGiaDonHang(
    dauTrang: string | undefined,
    maKh: string,
    maDonHang: string,
  ) {
    const thongTinToken = this.authService.giaiMaNguoiDung(dauTrang);
    const vaiTro = String(thongTinToken.vaiTro || '');

    const khachHang = await this.layKhachHangTheoMaNd(
      String(thongTinToken.maND),
    );
    if (vaiTro !== 'Admin' && vaiTro !== 'NhanVien') {
      if (
        !khachHang ||
        String(khachHang.MaKH || '') !== String(maKh || '').trim()
      ) {
        throw new BadRequestException(
          'Ban khong co quyen danh gia don hang nay.',
        );
      }
    }

    const [donHang] = await this.mysql.truyVan(
      'SELECT * FROM DonHang WHERE MaDonHang = ? LIMIT 1',
      [maDonHang],
    );
    if (!donHang) {
      throw new NotFoundException('Khong tim thay don hang.');
    }

    if (
      vaiTro !== 'Admin' &&
      vaiTro !== 'NhanVien' &&
      String(donHang.MaKH || '') !== String(khachHang?.MaKH || '')
    ) {
      throw new BadRequestException(
        'Ban khong co quyen danh gia don hang nay.',
      );
    }

    return { khachHang, donHang };
  }

  async layDanhSachDanhGia(authorization?: string) {
    const laYeuCauNoiBo = Boolean(authorization);
    if (laYeuCauNoiBo) {
      this.authService.yeuCauQuyenNhanVienHoacQuanTri(authorization);
    }

    const danhSach = await this.mysql.truyVan(
      `SELECT dg.*, kh.TenKH, nd.Email
       FROM DanhGia dg
       LEFT JOIN KhachHang kh ON kh.MaKH = dg.MaKH
       LEFT JOIN NguoiDung nd ON nd.MaND = kh.MaND
       ${laYeuCauNoiBo ? '' : "WHERE dg.TrangThai = 'Approved'"}
       ORDER BY dg.NgayDanhGia DESC`,
    );

    return this.taoPhanHoi(
      danhSach.map((danhGia) => ({
        maDanhGia: danhGia.MaDanhGia,
        maKH: danhGia.MaKH,
        maDonHang: danhGia.MaDonHang,
        soSao: Number(danhGia.SoSao || 0),
        noiDung: danhGia.NoiDung || '',
        phanHoi: danhGia.PhanHoi || '',
        hinhAnh: this.chuyenDuLieuHinhAnhDanhGia(danhGia.HinhAnh),
        soLuotHuuIch: Number(danhGia.SoLuotHuuIch || 0),
        trangThai: danhGia.TrangThai,
        ngayDanhGia: danhGia.NgayDanhGia,
        tenKhachHang: danhGia.TenKH || '',
        email: danhGia.Email || '',
      })),
      'Lay danh sach danh gia thanh cong',
    );
  }

  async taoDanhGia(authorization: string | undefined, payload: BanGhi) {
    const maDanhGia = String(payload.maDanhGia || this.taoMa('DG'));
    const maKH = String(payload.maKH || '').trim();
    const maDonHang = String(payload.maDonHang || '').trim();
    const hinhAnh = this.chuyenHinhAnhDanhGia(payload.hinhAnh);

    if (!maKH || !maDonHang) {
      throw new BadRequestException(
        'Thieu ma khach hang hoac ma don hang de tao danh gia.',
      );
    }

    await this.yeuCauKhachHangDanhGiaDonHang(authorization, maKH, maDonHang);

    try {
      await this.mysql.thucThi(
        'INSERT INTO DanhGia (MaDanhGia, MaKH, MaDonHang, SoSao, NoiDung, PhanHoi, HinhAnh, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          maDanhGia,
          maKH,
          maDonHang,
          Number(payload.soSao || 0),
          payload.noiDung || null,
          null,
          hinhAnh,
          'Pending',
        ],
      );
    } catch (loi) {
      if (
        loi instanceof ServiceUnavailableException &&
        String(loi.message).includes('Duplicate entry')
      ) {
        throw new ConflictException('Khach hang da danh gia don hang nay roi.');
      }

      throw loi;
    }

    return this.taoPhanHoi(
      { maDanhGia, ...payload, maKH, maDonHang, hinhAnh, trangThai: 'Pending' },
      'Tao danh gia thanh cong',
    );
  }

  async duyetDanhGia(
    authorization: string | undefined,
    maDanhGia: string,
    payload: BanGhi,
  ) {
    this.authService.yeuCauQuyenQuanTri(authorization);

    const [danhGiaHienTai] = await this.mysql.truyVan(
      'SELECT * FROM DanhGia WHERE MaDanhGia = ? LIMIT 1',
      [maDanhGia],
    );
    if (!danhGiaHienTai) {
      throw new NotFoundException('Khong tim thay danh gia.');
    }

    await this.mysql.thucThi(
      'UPDATE DanhGia SET TrangThai = ?, PhanHoi = ? WHERE MaDanhGia = ?',
      [payload.trangThai, payload.phanHoi || null, maDanhGia],
    );
    const [danhGia] = await this.mysql.truyVan(
      'SELECT * FROM DanhGia WHERE MaDanhGia = ? LIMIT 1',
      [maDanhGia],
    );

    return this.taoPhanHoi(
      {
        maDanhGia: danhGia.MaDanhGia,
        maKH: danhGia.MaKH,
        maDonHang: danhGia.MaDonHang,
        soSao: Number(danhGia.SoSao || 0),
        noiDung: danhGia.NoiDung || '',
        phanHoi: danhGia.PhanHoi || '',
        trangThai: danhGia.TrangThai,
        ngayDanhGia: danhGia.NgayDanhGia,
      },
      'Duyet danh gia thanh cong',
    );
  }
}
