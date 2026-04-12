import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { AuthService } from '../auth/auth.service';

type BanGhi = Record<string, any>;

@Injectable()
export class DatBanQueryService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly authService: AuthService,
  ) {}

  private taoPhanHoi(duLieu: unknown, thongDiep = 'Thanh cong', meta: unknown = null) {
    return { success: true, data: duLieu, message: thongDiep, meta };
  }

  private async layKhachHangTheoMaNd(maND: string) {
    const danhSach = await this.mysql.truyVan('SELECT * FROM KhachHang WHERE MaND = ? LIMIT 1', [maND]);
    return danhSach[0] || null;
  }

  private yeuCauQuyenNhanVienHoacQuanTri(authorization?: string) {
    const thongTinToken = this.authService.yeuCauDangNhapNoiBo(authorization);
    const vaiTro = String(thongTinToken.vaiTro || '');

    if (vaiTro !== 'Admin' && vaiTro !== 'NhanVien') {
      throw new ForbiddenException('Ban khong co quyen thuc hien thao tac noi bo nay.');
    }

    return thongTinToken;
  }

  private async yeuCauKhachHangSoHuuTaiNguyen(authorization: string | undefined, maKh: string) {
    const thongTinToken = this.authService.giaiMaNguoiDung(authorization);
    const vaiTro = String(thongTinToken.vaiTro || '');

    if (vaiTro === 'Admin' || vaiTro === 'NhanVien') {
      return { thongTinToken, vaiTro, khachHang: await this.layKhachHangTheoMaNd(String(thongTinToken.maND)) };
    }

    const khachHang = await this.layKhachHangTheoMaNd(String(thongTinToken.maND));
    if (!khachHang || String(khachHang.MaKH || '') !== String(maKh || '').trim()) {
      throw new ForbiddenException('Ban khong co quyen truy cap du lieu cua khach hang khac.');
    }

    return { thongTinToken, vaiTro, khachHang };
  }

  chuyenDatBanSangResponse(datBan: BanGhi) {
    return {
      maDatBan: datBan.MaDatBan,
      maKH: datBan.MaKH || '',
      maBan: datBan.MaBan || '',
      maNV: datBan.MaNV || '',
      ngayDat: datBan.NgayDat,
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
    };
  }

  async layDanhSachDatBan(authorization?: string) {
    this.yeuCauQuyenNhanVienHoacQuanTri(authorization);
    const danhSach = await this.mysql.truyVan('SELECT * FROM DatBan ORDER BY NgayTao DESC');
    return this.taoPhanHoi(danhSach.map((datBan) => this.chuyenDatBanSangResponse(datBan)), 'Lay danh sach dat ban thanh cong');
  }

  async layLichSuDatBan(authorization: string | undefined, maKh: string) {
    await this.yeuCauKhachHangSoHuuTaiNguyen(authorization, maKh);

    const danhSach = await this.mysql.truyVan('SELECT * FROM DatBan WHERE MaKH = ? ORDER BY NgayTao DESC', [maKh]);
    return this.taoPhanHoi(danhSach.map((datBan) => this.chuyenDatBanSangResponse(datBan)), 'Lay lich su dat ban thanh cong');
  }

  async layKhaDungDatBan(query: Record<string, unknown>) {
    const ngayDat = String(query.ngayDat || '').trim();
    const gioDat = String(query.gioDat || '').trim();
    const soNguoi = Number(query.soNguoi || 0);
    const khuVuc = String(query.khuVuc || '').trim();

    if (!ngayDat || !gioDat) {
      throw new BadRequestException('Ngay dat va gio dat la bat buoc.');
    }

    const danhSachBan = await this.mysql.truyVan('SELECT * FROM Ban ORDER BY SoBan ASC');
    const danhSachDatBan = await this.mysql.truyVan(
      `SELECT * FROM DatBan
       WHERE NgayDat = ? AND GioDat = ? AND TrangThai NOT IN ('Cancelled', 'NoShow', 'Completed')`,
      [ngayDat, gioDat],
    );

    const tapBanDaDuocDung = new Set(
      danhSachDatBan.map((datBan) => String(datBan.MaBan || '').trim()).filter(Boolean),
    );

    const danhSachBanKhaDung = danhSachBan
      .filter((ban) => !tapBanDaDuocDung.has(String(ban.MaBan || '').trim()))
      .filter((ban) => String(ban.TrangThai || '') !== 'Occupied' && String(ban.TrangThai || '') !== 'Maintenance')
      .filter((ban) => {
        if (!khuVuc || khuVuc === 'KHONG_UU_TIEN') {
          return true;
        }

        const giaTriKhuVuc = String(ban.KhuVuc || ban.ViTri || '').toLowerCase();
        if (khuVuc === 'PHONG_VIP') return giaTriKhuVuc.includes('vip') || giaTriKhuVuc.includes('riêng') || giaTriKhuVuc.includes('rieng');
        if (khuVuc === 'BAN_CONG') return giaTriKhuVuc.includes('ngoài') || giaTriKhuVuc.includes('ngoai') || giaTriKhuVuc.includes('ban công') || giaTriKhuVuc.includes('ban cong');
        if (khuVuc === 'SANH_CHINH') return !giaTriKhuVuc.includes('vip') && !giaTriKhuVuc.includes('ngoài') && !giaTriKhuVuc.includes('ngoai') && !giaTriKhuVuc.includes('ban cong');
        return true;
      });

    const danhSachBanPhuHop = soNguoi > 0 ? danhSachBanKhaDung.filter((ban) => Number(ban.SoChoNgoi || 0) >= soNguoi) : danhSachBanKhaDung;
    const tongBanConTrong = danhSachBanKhaDung.length;
    const tongBanPhuHop = danhSachBanPhuHop.length;
    const mucKhaDung = tongBanPhuHop <= 0 ? 'FULL' : tongBanPhuHop <= 2 ? 'LIMITED' : 'AVAILABLE';

    return this.taoPhanHoi(
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
