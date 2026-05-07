import { Injectable } from '@nestjs/common';
import type { PoolConnection } from 'mysql2/promise';
import { MySqlService } from '../../database/mysql/mysql.service';
import { DonHangPricingService } from './don-hang-pricing.service';
import { DiemTichLuyService } from '../diem-tich-luy/diem-tich-luy.service';
import { taoPhanHoi } from '../../common/phan-hoi';
import { taoMa } from '../../common/tao-ma';
import { BanGhi } from '../../common/types';

@Injectable()
export class DonHangCreateOrderService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly donHangPricingService: DonHangPricingService,
    private readonly diemTichLuyService: DiemTichLuyService,
  ) {}

  private async thucThi(sql: string, thamSo: any[], ketNoi: PoolConnection) {
    await ketNoi.execute(sql, thamSo);
  }

  private async truyVan(sql: string, thamSo: any[], ketNoi: PoolConnection): Promise<any[]> {
    const [kq] = await ketNoi.query(sql, thamSo);
    return kq as any[];
  }

  private chuanHoaDanhSachChiTiet(dsDauVao: unknown, tienToMaChiTiet: string) {
    const danhSach = Array.isArray(dsDauVao) ? dsDauVao : [];
    return danhSach
      .map((muc: BanGhi, chiSo: number) => ({
        maChiTiet: String(muc?.maChiTiet || muc?.MaChiTiet || `${tienToMaChiTiet}_${Date.now()}_${chiSo}`),
        maMon: String(muc?.maMon || muc?.MaMon || ''),
        soLuong: Number(muc?.soLuong || muc?.SoLuong || 0),
        ghiChu: String(muc?.ghiChu || muc?.GhiChu || ''),
      }))
      .filter((muc) => Boolean(muc.maMon));
  }

  async taoDonHang(payload: BanGhi, loaiDon?: string) {
    const maDonHang = String(payload.maDonHang || taoMa('DH'));
    const chiTiet = Array.isArray(payload.chiTiet) ? payload.chiTiet : [];
    const maBan = payload.maBan || payload.maBanAn || null;
    const nguonTao = payload.nguonTao || 'Online';
    const loaiDonHang = loaiDon || payload.loaiDon || 'TAI_QUAN';
    const trangThai = payload.trangThai || 'Pending';
    const soDiem = Number(payload.soDiem || 0);

    const { chiTietDaTinh, tongHopGia, maGiamGia, diemApDung } =
      await this.donHangPricingService.tinhLaiGiaDonHang(payload, chiTiet);

    const nguoiDung = payload.nguoiDung || { maND: payload.maND };

    return this.mysql.giaoDich(async (ketNoi) => {
      let diemDaDoi: any = null;
      if (soDiem > 0) {
        const ketQuaDoiDiem = await this.diemTichLuyService.doiDiem(
          nguoiDung,
          { soDiem, moTa: `Doi diem thanh toan don hang ${maDonHang}` },
          ketNoi,
        );
        diemDaDoi = ketQuaDoiDiem.data || ketQuaDoiDiem;
      }

      await this.thucThi(
        `INSERT INTO DonHang (MaDonHang, MaKH, MaBan, MaNV, MaDatBan, LoaiDon, DiaChiGiao, PhiShip, TongTien, TrangThai, NguonTao, GhiChu)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          maDonHang,
          payload.maKH || null,
          maBan,
          payload.maNV || null,
          payload.maDatBan || null,
          loaiDonHang,
          payload.diaChiGiao || null,
          tongHopGia.phiShip,
          tongHopGia.tongTien,
          trangThai,
          nguonTao,
          payload.ghiChu || null,
        ],
        ketNoi,
      );

      const chiTietPhanHoi: BanGhi[] = [];
      for (const muc of chiTietDaTinh) {
        const maChiTiet = muc.maChiTiet || taoMa('CT');
        await this.thucThi(
          'INSERT INTO ChiTietDonHang (MaChiTiet, MaDonHang, MaMon, SoLuong, DonGia, ThanhTien, GhiChu, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [maChiTiet, maDonHang, muc.maMon, muc.soLuong, muc.donGia, muc.thanhTien, muc.ghiChu || null, 'Pending'],
          ketNoi,
        );
        chiTietPhanHoi.push({
          MaChiTiet: maChiTiet,
          MaMon: muc.maMon,
          TenMon: muc.tenMon || '',
          SoLuong: muc.soLuong,
          DonGia: muc.donGia,
          ThanhTien: muc.thanhTien,
          GhiChu: muc.ghiChu || '',
          TrangThai: 'Pending',
        });
      }

      if (maBan) {
        await this.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Occupied', maBan], ketNoi);
      }

      return taoPhanHoi(
        {
          donHang: {
            maDonHang,
            maKH: payload.maKH || null,
            maBan,
            maNV: payload.maNV || null,
            maDatBan: payload.maDatBan || null,
            tongTien: tongHopGia.tongTien,
            tongHopGia,
            maGiamGia,
            diemApDung,
            trangThai,
            ghiChu: payload.ghiChu || '',
            ngayTao: new Date().toISOString(),
            loaiDon: loaiDonHang,
            thongTinNhanHang: this.donHangPricingService.taoThongTinNhanHang({
              loaiDon: loaiDonHang,
              diaChiGiao: payload.diaChiGiao || '',
              gioLayHang: payload.gioLayHang || payload.thongTinNhanHang?.gioLayHang || '',
              gioGiao: payload.gioGiao || payload.thongTinNhanHang?.gioGiao || '',
            }),
            diaChiGiao: payload.diaChiGiao || '',
            phiShip: tongHopGia.phiShip,
            tenKhachHang: payload.hoTen || payload.tenKhachHang || '',
            soDienThoai: payload.soDienThoai || '',
            email: payload.email || '',
            diaChiKhachHang: payload.diaChiGiao || '',
          },
          chiTiet: chiTietPhanHoi,
          diemDaDoi,
        },
        'Tao don hang thanh cong',
      );
    });
  }

  async taoOrderTaiBan(maBan: string, payload: BanGhi) {
    const chiTiet = this.chuanHoaDanhSachChiTiet(payload.chiTiet, 'CTBAN');
    const danhSachMon = this.chuanHoaDanhSachChiTiet(payload.danhSachMon, 'CTBAN');
    const items = this.chuanHoaDanhSachChiTiet(payload.items, 'CTBAN');

    return this.taoDonHang(
      {
        ...payload,
        maBan,
        maDonHang: payload.maDonHang || taoMa('DH'),
        chiTiet: chiTiet.length ? chiTiet : danhSachMon.length ? danhSachMon : items,
        nguonTao: 'QRCode',
        loaiDon: 'TAI_BAN',
      },
      'TAI_BAN',
    );
  }
}
