import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { taoPhanHoi } from '../../common/phan-hoi';
import { layKhachHangTheoMaNd } from '../../common/khach-hang.helper';
import { BanGhi } from '../../common/types';

@Injectable()
export class DatBanQueryService {
  constructor(private readonly mysql: MySqlService) {}

  private chuanNgayThanhChuoi(ngay: unknown): string {
    if (!ngay) return '';
    if (ngay instanceof Date) {
      const nam = ngay.getFullYear();
      const thang = String(ngay.getMonth() + 1).padStart(2, '0');
      const ngayTrongThang = String(ngay.getDate()).padStart(2, '0');
      return `${nam}-${thang}-${ngayTrongThang}`;
    }
    if (typeof ngay === 'string' && ngay.match(/^\d{4}-\d{2}-\d{2}/)) {
      return ngay.substring(0, 10);
    }
    return String(ngay);
  }

  chuyenDatBanSangPhanHoi(datBan: BanGhi) {
    let chiTietMonAn = [];
    try {
      if (datBan.ChiTietMonAn) {
        chiTietMonAn = typeof datBan.ChiTietMonAn === 'string'
          ? JSON.parse(datBan.ChiTietMonAn)
          : datBan.ChiTietMonAn;
      }
    } catch {
      chiTietMonAn = [];
    }
    const maBan = datBan.MaBan || '';
    const danhSachMaBanDaGan = maBan ? [String(maBan)] : [];
    
    return {
      maDatBan: datBan.MaDatBan,
      maKH: datBan.MaKH || '',
      maBan: maBan,
      maNV: datBan.MaNV || '',
      ngayDat: this.chuanNgayThanhChuoi(datBan.NgayDat),
      gioDat: datBan.GioDat,
      gioKetThuc: datBan.GioKetThuc || '',
      soNguoi: Number(datBan.SoNguoi || 0),
      ghiChu: datBan.GhiChu || '',
      ghiChuNoiBo: datBan.GhiChuNoiBo || '',
      khuVucUuTien: datBan.KhuVucUuTien || '',
      trangThai: datBan.TrangThai,
      ngayTao: datBan.NgayTao,
      ngayCapNhat: datBan.NgayCapNhat,
      tenKhachDatBan: datBan.TenKhachDatBan || datBan.TenKH || '',
      sdtDatBan: datBan.SDTDatBan || datBan.SDT || '',
      emailDatBan: datBan.EmailDatBan || datBan.Email || '',
      chiTietMonAn,
      danhSachMaBanDaGan,
      danhSachBanDaGan: maBan ? [{ maBan, tenBan: datBan.TenBan || maBan }] : [],
    };
  }

  async layDanhSachDatBan() {
    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM DatBan ORDER BY NgayTao DESC',
    );
    return taoPhanHoi(
      danhSach.map((datBan) => this.chuyenDatBanSangPhanHoi(datBan)),
      'Lay danh sach dat ban thanh cong',
    );
  }

  async layLichSuDatBan(nguoiDung: any, maKh: string) {
    const vaiTro = String(nguoiDung.vaiTro || '');

    if (vaiTro !== 'Admin' && vaiTro !== 'NhanVien') {
      const khachHang = await layKhachHangTheoMaNd(this.mysql, String(nguoiDung.maND));
      if (!khachHang || String(khachHang.MaKH || '') !== String(maKh || '').trim()) {
        throw new ForbiddenException('Ban khong co quyen truy cap du lieu cua khach hang khac.');
      }
    }

    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM DatBan WHERE MaKH = ? ORDER BY NgayTao DESC',
      [maKh],
    );
    return taoPhanHoi(
      danhSach.map((datBan) => this.chuyenDatBanSangPhanHoi(datBan)),
      'Lay lich su dat ban thanh cong',
    );
  }

  async layKhaDungDatBan(query: Record<string, unknown>) {
    const ngayDat = String(query.ngayDat || '').trim();
    const gioDat = String(query.gioDat || '').trim();
    const soNguoi = Number(query.soNguoi || 0);
    const khuVuc = String(query.khuVuc || '').trim();

    if (!ngayDat || !gioDat) {
      throw new BadRequestException('Ngay dat va gio dat la bat buoc.');
    }

    const danhSachBan = await this.mysql.truyVan(
      'SELECT * FROM Ban ORDER BY SoBan ASC',
    );
    const danhSachDatBan = await this.mysql.truyVan(
      `SELECT * FROM DatBan
       WHERE NgayDat = ? AND GioDat = ? AND TrangThai NOT IN ('Cancelled', 'NoShow', 'Completed')`,
      [ngayDat, gioDat],
    );

    const tapBanDaDuocDung = new Set(
      danhSachDatBan
        .map((datBan) => String(datBan.MaBan || '').trim())
        .filter(Boolean),
    );

    const danhSachBanKhaDung = danhSachBan
      .filter((ban) => !tapBanDaDuocDung.has(String(ban.MaBan || '').trim()))
      .filter(
        (ban) =>
          String(ban.TrangThai || '') !== 'Occupied' &&
          String(ban.TrangThai || '') !== 'Maintenance',
      )
      .filter((ban) => {
        if (!khuVuc || khuVuc === 'KHONG_UU_TIEN') return true;

        const giaTriKhuVuc = String(ban.KhuVuc || ban.ViTri || '').toLowerCase();
        if (khuVuc === 'PHONG_VIP')
          return giaTriKhuVuc.includes('vip') || giaTriKhuVuc.includes('riêng') || giaTriKhuVuc.includes('rieng');
        if (khuVuc === 'BAN_CONG')
          return giaTriKhuVuc.includes('ngoài') || giaTriKhuVuc.includes('ngoai') || giaTriKhuVuc.includes('ban công') || giaTriKhuVuc.includes('ban cong');
        if (khuVuc === 'SANH_CHINH')
          return !giaTriKhuVuc.includes('vip') && !giaTriKhuVuc.includes('ngoài') && !giaTriKhuVuc.includes('ngoai') && !giaTriKhuVuc.includes('ban cong');
        return true;
      });

    const danhSachBanPhuHop =
      soNguoi > 0
        ? danhSachBanKhaDung.filter((ban) => Number(ban.SoChoNgoi || 0) >= soNguoi)
        : danhSachBanKhaDung;
    const tongBanConTrong = danhSachBanKhaDung.length;
    const tongBanPhuHop = danhSachBanPhuHop.length;
    const mucKhaDung =
      tongBanPhuHop <= 0 ? 'FULL' : tongBanPhuHop <= 2 ? 'LIMITED' : 'AVAILABLE';

    return taoPhanHoi(
      {
        ngayDat,
        gioDat,
        soNguoi,
        khuVuc: khuVuc || 'KHONG_UU_TIEN',
        tongBanConTrong,
        tongBanPhuHop,
        mucKhaDung,
        danhSachBan: danhSachBanPhuHop.map((ban) => ({
          maBan: ban.MaBan,
          tenBan: ban.TenBan,
          khuVuc: ban.KhuVuc,
          viTri: ban.ViTri,
          soBan: Number(ban.SoBan || 0),
          soChoNgoi: Number(ban.SoChoNgoi || 0),
          trangThai: ban.TrangThai,
        })),
      },
      'Lay kha dung dat ban thanh cong',
    );
  }
}
