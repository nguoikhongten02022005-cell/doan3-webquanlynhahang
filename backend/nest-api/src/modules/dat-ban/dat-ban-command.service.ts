import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { DatBanQueryService } from './dat-ban-query.service';
import { taoPhanHoi } from '../../common/phan-hoi';
import { layKhachHangTheoMaNd } from '../../common/khach-hang.helper';
import { BanGhi } from '../../common/types';

@Injectable()
export class DatBanCommandService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly datBanQueryService: DatBanQueryService,
  ) {}

  private async kiemTraQuyenKhachHang(nguoiDung: any, maKh: string) {
    const vaiTro = String(nguoiDung.vaiTro || '');
    if (vaiTro === 'Admin' || vaiTro === 'NhanVien') return;

    const khachHang = await layKhachHangTheoMaNd(this.mysql, String(nguoiDung.maND));
    if (!khachHang || String(khachHang.MaKH || '') !== String(maKh || '').trim()) {
      throw new ForbiddenException('Ban khong co quyen truy cap du lieu cua khach hang khac.');
    }
  }

  async taoDatBan(nguoiDung: any, body: BanGhi) {
    if (body.maKH) {
      await this.kiemTraQuyenKhachHang(nguoiDung, String(body.maKH || ''));
    }

    const [khachHang] = body.maKH
      ? await this.mysql.truyVan(
          `SELECT kh.*, nd.Email
           FROM KhachHang kh
           LEFT JOIN NguoiDung nd ON nd.MaND = kh.MaND
           WHERE kh.MaKH = ?
           LIMIT 1`,
          [body.maKH],
        )
      : [null];

    await this.mysql.thucThi(
      `INSERT INTO DatBan (MaDatBan, MaKH, MaBan, MaNV, TenKhachDatBan, SDTDatBan, EmailDatBan, NgayDat, GioDat, GioKetThuc, SoNguoi, GhiChu, TrangThai, KhuVucUuTien, ChiTietMonAn)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.maDatBan,
        body.maKH || null,
        body.maBan || null,
        body.maNV || null,
        body.tenKhachDatBan || khachHang?.TenKH || null,
        body.sdtDatBan || khachHang?.SDT || null,
        body.emailDatBan || khachHang?.Email || null,
        body.ngayDat,
        body.gioDat,
        body.gioKetThuc || null,
        Number(body.soNguoi || 0),
        body.ghiChu || null,
        'Pending',
        body.khuVucUuTien || null,
        body.chiTietMonAn ? JSON.stringify(body.chiTietMonAn) : null,
      ],
    );

    const [datBanDaTao] = await this.mysql.truyVan(
      `SELECT db.*, kh.TenKH, kh.SDT, nd.Email
       FROM DatBan db
       LEFT JOIN KhachHang kh ON kh.MaKH = db.MaKH
       LEFT JOIN NguoiDung nd ON nd.MaND = kh.MaND
       WHERE db.MaDatBan = ?
       LIMIT 1`,
      [body.maDatBan],
    );

    return taoPhanHoi(
      this.datBanQueryService.chuyenDatBanSangPhanHoi(
        datBanDaTao || {
          ...body,
          TenKH: khachHang?.TenKH || body.tenKhachDatBan || '',
          SDT: khachHang?.SDT || body.sdtDatBan || '',
          Email: khachHang?.Email || body.emailDatBan || '',
          NgayTao: new Date().toISOString(),
          NgayCapNhat: new Date().toISOString(),
          TrangThai: 'Pending',
        },
      ),
      'Tao dat ban thanh cong',
    );
  }

  async capNhatDatBan(maDatBan: string, body: BanGhi) {
    const [datBanHienTai] = await this.mysql.truyVan(
      'SELECT * FROM DatBan WHERE MaDatBan = ? LIMIT 1',
      [maDatBan],
    );
    if (!datBanHienTai) {
      throw new NotFoundException('Khong tim thay dat ban.');
    }

    const maKH = body.maKH === undefined ? datBanHienTai.MaKH : body.maKH || null;
    const maBan = body.maBan === undefined ? datBanHienTai.MaBan : body.maBan || null;
    const maNV = body.maNV === undefined ? datBanHienTai.MaNV : body.maNV || null;
    const tenKhachDatBan = body.tenKhachDatBan === undefined ? datBanHienTai.TenKhachDatBan : body.tenKhachDatBan ? String(body.tenKhachDatBan).trim() : null;
    const sdtDatBan = body.sdtDatBan === undefined ? datBanHienTai.SDTDatBan : body.sdtDatBan ? String(body.sdtDatBan).trim() : null;
    const emailDatBan = body.emailDatBan === undefined ? datBanHienTai.EmailDatBan : body.emailDatBan ? String(body.emailDatBan).trim() : null;
    const ngayDat = body.ngayDat === undefined ? datBanHienTai.NgayDat : String(body.ngayDat || '').trim();
    const gioDat = body.gioDat === undefined ? datBanHienTai.GioDat : String(body.gioDat || '').trim();
    const gioKetThuc = body.gioKetThuc === undefined ? datBanHienTai.GioKetThuc : body.gioKetThuc ? String(body.gioKetThuc).trim() : null;
    const soNguoi = body.soNguoi === undefined ? Number(datBanHienTai.SoNguoi || 0) : Number(body.soNguoi || 0);
    const ghiChu = body.ghiChu === undefined ? datBanHienTai.GhiChu : body.ghiChu ? String(body.ghiChu).trim() : null;
    const khuVucUuTien = body.khuVucUuTien === undefined ? datBanHienTai.KhuVucUuTien : body.khuVucUuTien ? String(body.khuVucUuTien).trim() : null;
    const ghiChuNoiBo = body.ghiChuNoiBo === undefined ? datBanHienTai.GhiChuNoiBo : body.ghiChuNoiBo ? String(body.ghiChuNoiBo).trim() : null;
    const trangThai = body.trangThai === undefined ? datBanHienTai.TrangThai : String(body.trangThai || '').trim();

    if (!ngayDat) throw new BadRequestException('Ngay dat la bat buoc.');
    if (!gioDat) throw new BadRequestException('Gio dat la bat buoc.');
    if (!Number.isFinite(soNguoi) || soNguoi <= 0) throw new BadRequestException('So nguoi phai lon hon 0.');

    await this.mysql.thucThi(
      `UPDATE DatBan
       SET MaKH = ?, MaBan = ?, MaNV = ?, TenKhachDatBan = ?, SDTDatBan = ?, EmailDatBan = ?, NgayDat = ?, GioDat = ?, GioKetThuc = ?, SoNguoi = ?, GhiChu = ?, KhuVucUuTien = ?, GhiChuNoiBo = ?, TrangThai = ?
       WHERE MaDatBan = ?`,
      [maKH, maBan, maNV, tenKhachDatBan, sdtDatBan, emailDatBan, ngayDat, gioDat, gioKetThuc, soNguoi, ghiChu, khuVucUuTien, ghiChuNoiBo, trangThai || datBanHienTai.TrangThai, maDatBan],
    );

    const [datBanDaCapNhat] = await this.mysql.truyVan(
      'SELECT * FROM DatBan WHERE MaDatBan = ? LIMIT 1',
      [maDatBan],
    );
    return taoPhanHoi(
      this.datBanQueryService.chuyenDatBanSangPhanHoi(datBanDaCapNhat),
      'Cap nhat dat ban thanh cong',
    );
  }

  async capNhatTrangThaiDatBan(maDatBan: string, trangThai: string) {
    const [datBanHienTai] = await this.mysql.truyVan(
      'SELECT * FROM DatBan WHERE MaDatBan = ? LIMIT 1',
      [maDatBan],
    );
    if (!datBanHienTai) {
      throw new NotFoundException('Khong tim thay dat ban.');
    }

    const trangThaiDaChuanHoa = String(trangThai || '').trim();
    if (!trangThaiDaChuanHoa) {
      throw new BadRequestException('Trang thai dat ban la bat buoc.');
    }

    await this.mysql.giaoDich(async (ketNoi) => {
      await ketNoi.execute('UPDATE DatBan SET TrangThai = ? WHERE MaDatBan = ?', [trangThaiDaChuanHoa, maDatBan]);

      const maBan = String(datBanHienTai.MaBan || '').trim();
      if (!maBan) return;

      if (trangThaiDaChuanHoa === 'DA_CHECK_IN' || trangThaiDaChuanHoa === 'DA_XEP_BAN') {
        await ketNoi.execute('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Occupied', maBan]);
        return;
      }

      if (['DA_XAC_NHAN', 'DA_GHI_NHAN', 'CAN_GOI_LAI', 'CHO_XAC_NHAN'].includes(trangThaiDaChuanHoa)) {
        await ketNoi.execute('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Reserved', maBan]);
        return;
      }

      if (['DA_HOAN_THANH', 'KHONG_DEN', 'TU_CHOI_HET_CHO', 'DA_HUY'].includes(trangThaiDaChuanHoa)) {
        await ketNoi.execute('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Available', maBan]);
      }
    });

    const [datBan] = await this.mysql.truyVan(
      'SELECT * FROM DatBan WHERE MaDatBan = ? LIMIT 1',
      [maDatBan],
    );
    return taoPhanHoi(
      this.datBanQueryService.chuyenDatBanSangPhanHoi(datBan),
      'Cap nhat dat ban thanh cong',
    );
  }

  async ganBanChoDatBan(maDatBan: string, body: BanGhi) {
    const [datBan] = await this.mysql.truyVan(
      'SELECT * FROM DatBan WHERE MaDatBan = ? LIMIT 1',
      [maDatBan],
    );
    if (!datBan) {
      throw new NotFoundException('Khong tim thay dat ban.');
    }

    const danhSachMaBan = Array.isArray(body.danhSachMaBan)
      ? body.danhSachMaBan.map((maBan) => String(maBan || '').trim()).filter(Boolean)
      : [];

    if (!danhSachMaBan.length) {
      throw new BadRequestException('Can it nhat mot ban de gan cho booking.');
    }

    const danhSachBanHopLe = await this.mysql.truyVan(
      `SELECT * FROM Ban WHERE MaBan IN (${danhSachMaBan.map(() => '?').join(', ')})`,
      danhSachMaBan,
    );

    if (danhSachBanHopLe.length !== danhSachMaBan.length) {
      throw new BadRequestException('Co ban khong ton tai hoac da bi xoa.');
    }

    const soKhach = Number(datBan.SoNguoi || 0);
    const tongSucChua = danhSachBanHopLe.reduce((tong, ban) => tong + Number(ban.SoChoNgoi || 0), 0);
    if (soKhach > 0 && tongSucChua < soKhach) {
      throw new BadRequestException('Tong suc chua cua cac ban duoc chon khong du cho booking nay.');
    }

    const trangThaiKhongHopLe = danhSachBanHopLe.find((ban) => String(ban.TrangThai || '') === 'Occupied');
    if (trangThaiKhongHopLe) {
      throw new BadRequestException(`Ban ${trangThaiKhongHopLe.MaBan} dang co khach, khong the gan cho booking.`);
    }

    await this.mysql.giaoDich(async (ketNoi) => {
      for (const maBan of danhSachMaBan) {
        await ketNoi.execute('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Reserved', maBan]);
      }
      await ketNoi.execute('UPDATE DatBan SET MaBan = ?, TrangThai = ? WHERE MaDatBan = ?', [danhSachMaBan[0], 'DA_XAC_NHAN', maDatBan]);
    });

    const [datBanDaCapNhat] = await this.mysql.truyVan(
      'SELECT * FROM DatBan WHERE MaDatBan = ? LIMIT 1',
      [maDatBan],
    );
    return taoPhanHoi(
      {
        maDatBan: datBanDaCapNhat.MaDatBan,
        maKH: datBanDaCapNhat.MaKH,
        maBan: datBanDaCapNhat.MaBan,
        maNV: datBanDaCapNhat.MaNV,
        ngayDat: datBanDaCapNhat.NgayDat,
        gioDat: datBanDaCapNhat.GioDat,
        gioKetThuc: datBanDaCapNhat.GioKetThuc,
        soNguoi: Number(datBanDaCapNhat.SoNguoi || 0),
        ghiChu: datBanDaCapNhat.GhiChu || '',
        trangThai: datBanDaCapNhat.TrangThai,
        ngayTao: datBanDaCapNhat.NgayTao,
        ngayCapNhat: datBanDaCapNhat.NgayCapNhat,
        danhSachMaBanDaGan: danhSachBanHopLe.map((ban) => String(ban.MaBan)),
        danhSachBanDaGan: danhSachBanHopLe.map((ban) => ({
          maBan: String(ban.MaBan),
          tenBan: String(ban.TenBan || ''),
        })),
      },
      'Gan ban cho dat ban thanh cong',
    );
  }
}
