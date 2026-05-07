import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { taoPhanHoi } from '../../common/phan-hoi';
import { taoMa } from '../../common/tao-ma';
import { layKhachHangTheoMaNd } from '../../common/khach-hang.helper';
import { BanGhi } from '../../common/types';

@Injectable()
export class DanhGiaService {
  constructor(private readonly mysql: MySqlService) {}

  private chuyenDuLieuHinhAnhDanhGia(giaTri: unknown) {
    if (!giaTri) return [];
    if (Array.isArray(giaTri)) return giaTri.filter(Boolean).map((item) => String(item));

    const chuoi = String(giaTri).trim();
    if (!chuoi) return [];

    try {
      const phanTich = JSON.parse(chuoi);
      return Array.isArray(phanTich) ? phanTich.filter(Boolean).map((item) => String(item)) : [chuoi];
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

  private async kiemTraQuyenDanhGia(nguoiDung: any, maKh: string, maDonHang: string) {
    const vaiTro = String(nguoiDung.vaiTro || '');
    const khachHang = await layKhachHangTheoMaNd(this.mysql, String(nguoiDung.maND));

    if (vaiTro !== 'Admin' && vaiTro !== 'NhanVien') {
      if (!khachHang || String(khachHang.MaKH || '') !== String(maKh || '').trim()) {
        throw new BadRequestException('Ban khong co quyen danh gia don hang nay.');
      }
    }

    const [donHang] = await this.mysql.truyVan('SELECT * FROM DonHang WHERE MaDonHang = ? LIMIT 1', [maDonHang]);
    if (!donHang) throw new NotFoundException('Khong tim thay don hang.');

    if (vaiTro !== 'Admin' && vaiTro !== 'NhanVien' && String(donHang.MaKH || '') !== String(khachHang?.MaKH || '')) {
      throw new BadRequestException('Ban khong co quyen danh gia don hang nay.');
    }

    return { khachHang, donHang };
  }

  async layDanhSachDanhGia(laNoiBo: boolean) {
    const danhSach = await this.mysql.truyVan(
      `SELECT dg.*, kh.TenKH, nd.Email
       FROM DanhGia dg
       LEFT JOIN KhachHang kh ON kh.MaKH = dg.MaKH
       LEFT JOIN NguoiDung nd ON nd.MaND = kh.MaND
       ${laNoiBo ? '' : "WHERE dg.TrangThai = 'Approved'"}
       ORDER BY dg.NgayDanhGia DESC`,
    );

    return taoPhanHoi(
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

  async taoDanhGia(nguoiDung: any, payload: BanGhi) {
    const maDanhGia = String(payload.maDanhGia || taoMa('DG'));
    const maKH = String(payload.maKH || '').trim();
    const maDonHang = String(payload.maDonHang || '').trim();
    const hinhAnh = this.chuyenHinhAnhDanhGia(payload.hinhAnh);

    if (!maKH || !maDonHang) {
      throw new BadRequestException('Thieu ma khach hang hoac ma don hang de tao danh gia.');
    }

    await this.kiemTraQuyenDanhGia(nguoiDung, maKH, maDonHang);

    try {
      await this.mysql.thucThi(
        'INSERT INTO DanhGia (MaDanhGia, MaKH, MaDonHang, SoSao, NoiDung, PhanHoi, HinhAnh, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [maDanhGia, maKH, maDonHang, Number(payload.soSao || 0), payload.noiDung || null, null, hinhAnh, 'Pending'],
      );
    } catch (loi) {
      const err = loi as { errno?: number; code?: string; message?: string };
      if (err.errno === 1062 || err.code === 'ER_DUP_ENTRY' || String(err.message || '').includes('Duplicate entry')) {
        throw new ConflictException('Khach hang da danh gia don hang nay roi.');
      }
      throw loi;
    }

    return taoPhanHoi(
      { maDanhGia, ...payload, maKH, maDonHang, hinhAnh, trangThai: 'Pending' },
      'Tao danh gia thanh cong',
    );
  }

  async duyetDanhGia(maDanhGia: string, payload: BanGhi) {
    const [danhGiaHienTai] = await this.mysql.truyVan('SELECT * FROM DanhGia WHERE MaDanhGia = ? LIMIT 1', [maDanhGia]);
    if (!danhGiaHienTai) throw new NotFoundException('Khong tim thay danh gia.');

    await this.mysql.thucThi('UPDATE DanhGia SET TrangThai = ?, PhanHoi = ? WHERE MaDanhGia = ?', [
      payload.trangThai,
      payload.phanHoi || null,
      maDanhGia,
    ]);
    const [danhGia] = await this.mysql.truyVan('SELECT * FROM DanhGia WHERE MaDanhGia = ? LIMIT 1', [maDanhGia]);

    return taoPhanHoi(
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
