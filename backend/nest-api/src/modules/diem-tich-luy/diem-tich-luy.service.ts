import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PoolConnection } from 'mysql2/promise';
import { MySqlService } from '../../database/mysql/mysql.service';
import { taoPhanHoi } from '../../common/phan-hoi';
import { taoMa } from '../../common/tao-ma';
import { layKhachHangTheoMaNd } from '../../common/khach-hang.helper';
import { BanGhi } from '../../common/types';

@Injectable()
export class DiemTichLuyService {
  constructor(private readonly mysql: MySqlService) {}

  private readonly TI_LE_TICH_DIEM_MAC_DINH = 10000;

  private async thucThi(sql: string, thamSo: any[], ketNoi?: PoolConnection) {
    if (ketNoi) {
      await ketNoi.execute(sql, thamSo);
      return;
    }
    await this.mysql.thucThi(sql, thamSo);
  }

  private async truyVan(sql: string, thamSo: any[], ketNoi?: PoolConnection): Promise<any[]> {
    if (ketNoi) {
      const [kq] = await ketNoi.query(sql, thamSo);
      return kq as any[];
    }
    return this.mysql.truyVan(sql, thamSo);
  }

  private async layKhachHangTheoMaKH(maKH: string, ketNoi?: PoolConnection) {
    const danhSach = await this.truyVan(
      'SELECT * FROM KhachHang WHERE MaKH = ? LIMIT 1',
      [maKH],
      ketNoi,
    );
    return danhSach[0] || null;
  }

  private chuyenLichSuDiemSangPhanHoi(giaoDich: BanGhi) {
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
    ketNoi?: PoolConnection,
  ) {
    const maGiaoDich = taoMa('GDDL');
    await this.thucThi(
      `INSERT INTO LichSuDiemTichLuy (MaGiaoDichDiem, MaKH, MaDonHang, LoaiBienDong, SoDiem, SoDiemTruoc, SoDiemSau, MoTa)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [maGiaoDich, maKH, maDonHang || null, loaiBienDong, soDiem, soDiemTruoc, soDiemSau, moTa],
      ketNoi,
    );
    return maGiaoDich;
  }

  async layTongQuanDiemTichLuy(nguoiDung: any) {
    const khachHang = await layKhachHangTheoMaNd(this.mysql, String(nguoiDung.maND));

    if (!khachHang) {
      return taoPhanHoi(
        { tongDiem: 0, diemCoTheDoi: 0, tiLeQuyDoi: this.TI_LE_TICH_DIEM_MAC_DINH },
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

  async layLichSuDiemTichLuy(nguoiDung: any) {
    const khachHang = await layKhachHangTheoMaNd(this.mysql, String(nguoiDung.maND));

    if (!khachHang) {
      return taoPhanHoi([], 'Khong co lich su diem tich luy');
    }

    const lichSu = await this.mysql.truyVan(
      'SELECT * FROM LichSuDiemTichLuy WHERE MaKH = ? ORDER BY NgayTao DESC',
      [khachHang.MaKH],
    );
    return taoPhanHoi(
      lichSu.map((giaoDich) => this.chuyenLichSuDiemSangPhanHoi(giaoDich)),
      'Lay lich su diem tich luy thanh cong',
    );
  }

  async tinhDiemTuDonHang(maKH: string, maDonHang: string, tongTien: number, moTa?: string) {
    const khachHang = await this.layKhachHangTheoMaKH(maKH);
    if (!khachHang) return taoPhanHoi(null, 'Khong tim thay khach hang');

    const tongTienSo = Number(tongTien);
    if (isNaN(tongTienSo) || tongTienSo < 0) return taoPhanHoi(null, 'Tong tien khong hop le');

    const soDiemTichDuoc = Math.floor(tongTienSo / this.TI_LE_TICH_DIEM_MAC_DINH);
    const diemTruoc = Number(khachHang.DiemTichLuy || 0);
    const diemSau = diemTruoc + soDiemTichDuoc;

    await this.mysql.thucThi('UPDATE KhachHang SET DiemTichLuy = ? WHERE MaKH = ?', [diemSau, khachHang.MaKH]);

    const maGiaoDich = await this.ghiLichSuDiem(
      khachHang.MaKH, maDonHang, 'CONG', soDiemTichDuoc, diemTruoc, diemSau,
      moTa || `Tich diem tu don hang ${maDonHang}`,
    );

    return taoPhanHoi(
      { maGiaoDichDiem: maGiaoDich, maKH: khachHang.MaKH, maDonHang, tongTien: tongTienSo, soDiemTichDuoc, diemTruoc, diemSau, tiLeQuyDoi: this.TI_LE_TICH_DIEM_MAC_DINH },
      'Tich diem tu don hang thanh cong',
    );
  }

  async tinhDiem(nguoiDung: any, body: { maDonHang: string; tongTien: number; moTa?: string }) {
    const khachHang = await layKhachHangTheoMaNd(this.mysql, String(nguoiDung.maND));
    if (!khachHang) throw new NotFoundException('Khong tim thay khach hang.');

    const tongTien = Number(body.tongTien);
    if (isNaN(tongTien) || tongTien < 0) throw new BadRequestException('Tong tien khong hop le.');

    const soDiemTichDuoc = Math.floor(tongTien / this.TI_LE_TICH_DIEM_MAC_DINH);
    const diemTruoc = Number(khachHang.DiemTichLuy || 0);
    const diemSau = diemTruoc + soDiemTichDuoc;

    await this.mysql.thucThi('UPDATE KhachHang SET DiemTichLuy = ? WHERE MaKH = ?', [diemSau, khachHang.MaKH]);

    const maGiaoDich = await this.ghiLichSuDiem(
      khachHang.MaKH, body.maDonHang, 'CONG', soDiemTichDuoc, diemTruoc, diemSau,
      body.moTa || `Tich diem tu don hang ${body.maDonHang}`,
    );

    return taoPhanHoi(
      { maGiaoDichDiem: maGiaoDich, maKH: khachHang.MaKH, maDonHang: body.maDonHang, tongTien, soDiemTichDuoc, diemTruoc, diemSau, tiLeQuyDoi: this.TI_LE_TICH_DIEM_MAC_DINH },
      'Tinh diem tich luy thanh cong',
    );
  }

  async doiDiem(nguoiDung: any, body: { soDiem: number; moTa?: string }, ketNoi?: PoolConnection) {
    const khachHang = await layKhachHangTheoMaNd(this.mysql, String(nguoiDung.maND));
    if (!khachHang) throw new NotFoundException('Khong tim thay khach hang.');

    const soDiem = Number(body.soDiem);
    if (isNaN(soDiem) || soDiem <= 0) throw new BadRequestException('So diem khong hop le.');

    const diemTruoc = Number(khachHang.DiemTichLuy || 0);
    const diemSau = diemTruoc - soDiem;
    if (diemSau < 0) throw new BadRequestException('Diem tich luy khong du de doi.');

    await this.thucThi('UPDATE KhachHang SET DiemTichLuy = ? WHERE MaKH = ?', [diemSau, khachHang.MaKH], ketNoi);

    const maGiaoDich = await this.ghiLichSuDiem(
      khachHang.MaKH, '', 'TRU', -soDiem, diemTruoc, diemSau,
      body.moTa || 'Doi diem tich luy lay qua',
      ketNoi,
    );

    return taoPhanHoi(
      { maGiaoDichDiem: maGiaoDich, maKH: khachHang.MaKH, soDiemDaDoi: soDiem, diemTruoc, diemSau },
      'Doi diem thanh cong',
    );
  }

  async congDiemHuyDon(nguoiDung: any, body: { maDonHang: string; soDiem: number; moTa?: string }, ketNoi?: PoolConnection) {
    const khachHang = await layKhachHangTheoMaNd(this.mysql, String(nguoiDung.maND));
    if (!khachHang) throw new NotFoundException('Khong tim thay khach hang.');

    const soDiem = Number(body.soDiem);
    if (isNaN(soDiem) || soDiem <= 0) throw new BadRequestException('So diem khong hop le.');

    const diemTruoc = Number(khachHang.DiemTichLuy || 0);
    const diemSau = diemTruoc + soDiem;

    await this.thucThi('UPDATE KhachHang SET DiemTichLuy = ? WHERE MaKH = ?', [diemSau, khachHang.MaKH], ketNoi);

    const maGiaoDich = await this.ghiLichSuDiem(
      khachHang.MaKH, body.maDonHang, 'CONG', soDiem, diemTruoc, diemSau,
      body.moTa || `Hoan diem tu don hang bi huy ${body.maDonHang}`,
      ketNoi,
    );

    return taoPhanHoi(
      { maGiaoDichDiem: maGiaoDich, maKH: khachHang.MaKH, maDonHang: body.maDonHang, soDiemHoan: soDiem, diemTruoc, diemSau },
      'Hoan diem thanh cong',
    );
  }
}
