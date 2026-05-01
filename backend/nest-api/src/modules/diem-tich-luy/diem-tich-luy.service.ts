import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { AuthService } from '../auth/auth.service';
import { taoPhanHoi } from '../../common/phan-hoi';

type BanGhi = Record<string, any>;

@Injectable()
export class DiemTichLuyService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly authService: AuthService,
  ) {}

  private readonly TI_LE_TICH_DIEM_MAC_DINH = 10000;

  private taoMa(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  private async layKhachHangTheoMaNd(maND: string) {
    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM KhachHang WHERE MaND = ? LIMIT 1',
      [maND],
    );
    return danhSach[0] || null;
  }

  private async layKhachHangTheoMaKH(maKH: string) {
    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM KhachHang WHERE MaKH = ? LIMIT 1',
      [maKH],
    );
    return danhSach[0] || null;
  }

  private chuyenLichSuDiemSangResponse(giaoDich: BanGhi) {
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

  private async ghiLichSuDiem(
    maKH: string,
    maDonHang: string,
    loaiBienDong: string,
    soDiem: number,
    soDiemTruoc: number,
    soDiemSau: number,
    moTa: string,
  ) {
    const maGiaoDich = this.taoMa('GDDL');
    await this.mysql.thucThi(
      `INSERT INTO LichSuDiemTichLuy (MaGiaoDichDiem, MaKH, MaDonHang, LoaiBienDong, SoDiem, SoDiemTruoc, SoDiemSau, MoTa)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        maGiaoDich,
        maKH,
        maDonHang || null,
        loaiBienDong,
        soDiem,
        soDiemTruoc,
        soDiemSau,
        moTa,
      ],
    );
    return maGiaoDich;
  }

  async layTongQuanDiemTichLuy(authorization?: string) {
    const thongTinToken = this.authService.giaiMaNguoiDung(authorization);
    const khachHang = await this.layKhachHangTheoMaNd(
      String(thongTinToken.maND),
    );

    if (!khachHang) {
      return taoPhanHoi(
        {
          tongDiem: 0,
          diemCoTheDoi: 0,
          tiLeQuyDoi: this.TI_LE_TICH_DIEM_MAC_DINH,
        },
        'Khong tim thay thong tin diem tich luy',
      );
    }

    return taoPhanHoi(
      {
        maKH: khachHang.MaKH,
        tongDiem: Number(khachHang.DiemTichLuy || 0),
        diemCoTheDoi: Number(khachHang.DiemTichLuy || 0),
        tiLeQuyDoi: this.TI_LE_TICH_DIEM_MAC_DINH,
      },
      'Lay tong quan diem tich luy thanh cong',
    );
  }

  async layLichSuDiemTichLuy(authorization?: string) {
    const thongTinToken = this.authService.giaiMaNguoiDung(authorization);
    const khachHang = await this.layKhachHangTheoMaNd(
      String(thongTinToken.maND),
    );

    if (!khachHang) {
      return taoPhanHoi([], 'Khong co lich su diem tich luy');
    }

    const lichSu = await this.mysql.truyVan(
      'SELECT * FROM LichSuDiemTichLuy WHERE MaKH = ? ORDER BY NgayTao DESC',
      [khachHang.MaKH],
    );
    return taoPhanHoi(
      lichSu.map((giaoDich) => this.chuyenLichSuDiemSangResponse(giaoDich)),
      'Lay lich su diem tich luy thanh cong',
    );
  }

  async tinhDiemTuDonHang(
    maKH: string,
    maDonHang: string,
    tongTien: number,
    moTa?: string,
  ) {
    const khachHang = await this.layKhachHangTheoMaKH(maKH);
    if (!khachHang) {
      return taoPhanHoi(null, 'Khong tim thay khach hang');
    }

    const tongTienSo = Number(tongTien);
    if (isNaN(tongTienSo) || tongTienSo < 0) {
      return taoPhanHoi(null, 'Tong tien khong hop le');
    }

    const soDiemTichDuoc = Math.floor(
      tongTienSo / this.TI_LE_TICH_DIEM_MAC_DINH,
    );
    const diemTruoc = Number(khachHang.DiemTichLuy || 0);
    const diemSau = diemTruoc + soDiemTichDuoc;

    await this.mysql.thucThi(
      'UPDATE KhachHang SET DiemTichLuy = ? WHERE MaKH = ?',
      [diemSau, khachHang.MaKH],
    );

    const maGiaoDich = await this.ghiLichSuDiem(
      khachHang.MaKH,
      maDonHang,
      'TichDiem',
      soDiemTichDuoc,
      diemTruoc,
      diemSau,
      moTa || `Tich diem tu don hang ${maDonHang}`,
    );

    return taoPhanHoi(
      {
        maGiaoDichDiem: maGiaoDich,
        maKH: khachHang.MaKH,
        maDonHang: maDonHang,
        tongTien: tongTienSo,
        soDiemTichDuoc: soDiemTichDuoc,
        diemTruoc: diemTruoc,
        diemSau: diemSau,
        tiLeQuyDoi: this.TI_LE_TICH_DIEM_MAC_DINH,
      },
      'Tich diem tu don hang thanh cong',
    );
  }

  async tinhDiem(
    authorization: string | undefined,
    body: { maDonHang: string; tongTien: number; moTa?: string },
  ) {
    const thongTinToken = this.authService.giaiMaNguoiDung(authorization);
    const khachHang = await this.layKhachHangTheoMaNd(
      String(thongTinToken.maND),
    );

    if (!khachHang) {
      throw new NotFoundException('Khong tim thay khach hang.');
    }

    const tongTien = Number(body.tongTien);
    if (isNaN(tongTien) || tongTien < 0) {
      throw new BadRequestException('Tong tien khong hop le.');
    }

    const soDiemTichDuoc = Math.floor(tongTien / this.TI_LE_TICH_DIEM_MAC_DINH);
    const diemTruoc = Number(khachHang.DiemTichLuy || 0);
    const diemSau = diemTruoc + soDiemTichDuoc;

    await this.mysql.thucThi(
      'UPDATE KhachHang SET DiemTichLuy = ? WHERE MaKH = ?',
      [diemSau, khachHang.MaKH],
    );

    const maGiaoDich = await this.ghiLichSuDiem(
      khachHang.MaKH,
      body.maDonHang,
      'TichDiem',
      soDiemTichDuoc,
      diemTruoc,
      diemSau,
      body.moTa || `Tich diem tu don hang ${body.maDonHang}`,
    );

    return taoPhanHoi(
      {
        maGiaoDichDiem: maGiaoDich,
        maKH: khachHang.MaKH,
        maDonHang: body.maDonHang,
        tongTien: tongTien,
        soDiemTichDuoc: soDiemTichDuoc,
        diemTruoc: diemTruoc,
        diemSau: diemSau,
        tiLeQuyDoi: this.TI_LE_TICH_DIEM_MAC_DINH,
      },
      'Tinh diem tich luy thanh cong',
    );
  }

  async doiDiem(
    authorization: string | undefined,
    body: { soDiem: number; moTa?: string },
  ) {
    const thongTinToken = this.authService.giaiMaNguoiDung(authorization);
    const khachHang = await this.layKhachHangTheoMaNd(
      String(thongTinToken.maND),
    );

    if (!khachHang) {
      throw new NotFoundException('Khong tim thay khach hang.');
    }

    const soDiem = Number(body.soDiem);
    if (isNaN(soDiem) || soDiem <= 0) {
      throw new BadRequestException('So diem khong hop le.');
    }

    const diemTruoc = Number(khachHang.DiemTichLuy || 0);
    const diemSau = diemTruoc - soDiem;

    if (diemSau < 0) {
      throw new BadRequestException('Diem tich luy khong du de doi.');
    }

    await this.mysql.thucThi(
      'UPDATE KhachHang SET DiemTichLuy = ? WHERE MaKH = ?',
      [diemSau, khachHang.MaKH],
    );

    const maGiaoDich = await this.ghiLichSuDiem(
      khachHang.MaKH,
      '',
      'DoiDiem',
      -soDiem,
      diemTruoc,
      diemSau,
      body.moTa || 'Doi diem tich luy lay qua',
    );

    return taoPhanHoi(
      {
        maGiaoDichDiem: maGiaoDich,
        maKH: khachHang.MaKH,
        soDiemDaDoi: soDiem,
        diemTruoc: diemTruoc,
        diemSau: diemSau,
      },
      'Doi diem thanh cong',
    );
  }

  async congDiemHuyDon(
    authorization: string | undefined,
    body: { maDonHang: string; soDiem: number; moTa?: string },
  ) {
    const thongTinToken = this.authService.giaiMaNguoiDung(authorization);
    const khachHang = await this.layKhachHangTheoMaNd(
      String(thongTinToken.maND),
    );

    if (!khachHang) {
      throw new NotFoundException('Khong tim thay khach hang.');
    }

    const soDiem = Number(body.soDiem);
    if (isNaN(soDiem) || soDiem <= 0) {
      throw new BadRequestException('So diem khong hop le.');
    }

    const diemTruoc = Number(khachHang.DiemTichLuy || 0);
    const diemSau = diemTruoc + soDiem;

    await this.mysql.thucThi(
      'UPDATE KhachHang SET DiemTichLuy = ? WHERE MaKH = ?',
      [diemSau, khachHang.MaKH],
    );

    const maGiaoDich = await this.ghiLichSuDiem(
      khachHang.MaKH,
      body.maDonHang,
      'HuyDon',
      soDiem,
      diemTruoc,
      diemSau,
      body.moTa || `Hoan diem tu don hang bi huy ${body.maDonHang}`,
    );

    return taoPhanHoi(
      {
        maGiaoDichDiem: maGiaoDich,
        maKH: khachHang.MaKH,
        maDonHang: body.maDonHang,
        soDiemHoan: soDiem,
        diemTruoc: diemTruoc,
        diemSau: diemSau,
      },
      'Hoan diem thanh cong',
    );
  }
}
