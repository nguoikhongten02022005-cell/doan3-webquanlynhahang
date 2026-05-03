import { BadRequestException, Injectable } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { DonHangPricingService } from './don-hang-pricing.service';
import { DiemTichLuyService } from '../diem-tich-luy/diem-tich-luy.service';

type BanGhi = Record<string, any>;

@Injectable()
export class DonHangCreateOrderService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly donHangPricingService: DonHangPricingService,
    private readonly diemTichLuyService: DiemTichLuyService,
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

  private chuanHoaDanhSachChiTiet(dsDauVao: unknown, tienToMaChiTiet: string) {
    const danhSach = Array.isArray(dsDauVao) ? dsDauVao : [];
    return danhSach
      .map((muc: BanGhi, chiSo: number) => ({
        maChiTiet: String(
          muc?.maChiTiet ||
            muc?.MaChiTiet ||
            `${tienToMaChiTiet}_${Date.now()}_${chiSo}`,
        ),
        maMon: String(muc?.maMon || muc?.MaMon || ''),
        soLuong: Number(muc?.soLuong || muc?.SoLuong || 0),
        ghiChu: String(muc?.ghiChu || muc?.GhiChu || ''),
      }))
      .filter((muc) => Boolean(muc.maMon));
  }

async taoDonHang(payload: BanGhi, loaiDon?: string) {
    const maDonHang = String(payload.maDonHang || this.taoMa('DH'));
    const chiTiet = Array.isArray(payload.chiTiet) ? payload.chiTiet : [];
    const maBan = payload.maBan || payload.maBanAn || null;
    const nguonTao = payload.nguonTao || 'Online';
    const loaiDonHang = loaiDon || payload.loaiDon || 'TAI_QUAN';
    const trangThai = payload.trangThai || 'Pending';
    const soDiem = Number(payload.soDiem || 0);

    const { chiTietDaTinh, pricingSummary, voucher, diemApDung } =
      await this.donHangPricingService.recalculateOrderPricing(payload, chiTiet);

    let diemDaDoi = null;
    if (soDiem > 0) {
      try {
        const ketQuaDoiDiem = await this.diemTichLuyService.doiDiem(
          payload.authorization,
          { soDiem, moTa: `Doi diem thanh toan don hang ${maDonHang}` },
        );
        diemDaDoi = ketQuaDoiDiem.data || ketQuaDoiDiem;
      } catch (loiDoiDiem) {
        throw new BadRequestException(
          `Khong the doi diem: ${loiDoiDiem.message || 'Khong du diem hoac loi he thong'}`,
        );
      }
    }

    try {
      await this.mysql.thucThi(
        `INSERT INTO DonHang (MaDonHang, MaKH, MaBan, MaBanAn, MaNV, MaDatBan, LoaiDon, DiaChiGiao, PhiShip, TongTien, TrangThai, NguonTao, GhiChu)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          maDonHang,
          payload.maKH || null,
          maBan,
          maBan,
          payload.maNV || null,
          payload.maDatBan || null,
          loaiDonHang,
          payload.diaChiGiao || null,
          pricingSummary.phiShip,
          pricingSummary.tongTien,
          trangThai,
          nguonTao,
          payload.ghiChu || null,
        ],
      );

      const chiTietPhanHoi: BanGhi[] = [];
      for (const muc of chiTietDaTinh) {
        const maChiTiet = muc.maChiTiet || this.taoMa('CT');
        await this.mysql.thucThi(
          'INSERT INTO ChiTietDonHang (MaChiTiet, MaDonHang, MaMon, SoLuong, DonGia, ThanhTien, GhiChu, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            maChiTiet,
            maDonHang,
            muc.maMon,
            muc.soLuong,
            muc.donGia,
            muc.thanhTien,
            muc.ghiChu || null,
            'Pending',
          ],
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
        await this.mysql.thucThi(
          'UPDATE Ban SET TrangThai = ? WHERE MaBan = ?',
          ['Occupied', maBan],
        );
      }

      return this.taoPhanHoi(
        {
          donHang: {
            maDonHang,
            maKH: payload.maKH || null,
            maBan,
            maNV: payload.maNV || null,
            maDatBan: payload.maDatBan || null,
            tongTien: pricingSummary.tongTien,
            pricingSummary,
            voucher,
            diemApDung,
            trangThai,
            ghiChu: payload.ghiChu || '',
            ngayTao: new Date().toISOString(),
            loaiDon: loaiDonHang,
            thongTinNhanHang: this.donHangPricingService.taoThongTinNhanHang({
              loaiDon: loaiDonHang,
              diaChiGiao: payload.diaChiGiao || '',
              gioLayHang:
                payload.gioLayHang || payload.thongTinNhanHang?.gioLayHang || '',
              gioGiao: payload.gioGiao || payload.thongTinNhanHang?.gioGiao || '',
            }),
            diaChiGiao: payload.diaChiGiao || '',
            phiShip: pricingSummary.phiShip,
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
    } catch (loiTaoDon) {
      if (soDiem > 0 && diemDaDoi) {
        try {
          await this.diemTichLuyService.congDiemHuyDon(payload.authorization, {
            maDonHang,
            soDiem,
            moTa: `Hoan diem do loi tao don hang ${maDonHang}`,
          });
        } catch (loiHoanDiem) {
          console.error('Loi khi hoan diem:', loiHoanDiem);
        }
      }
      throw loiTaoDon;
    }
  }

  async taoOrderTaiBan(maBan: string, payload: BanGhi) {
    const chiTiet = this.chuanHoaDanhSachChiTiet(payload.chiTiet, 'CTBAN');
    const danhSachMon = this.chuanHoaDanhSachChiTiet(
      payload.danhSachMon,
      'CTBAN',
    );
    const items = this.chuanHoaDanhSachChiTiet(payload.items, 'CTBAN');

    return this.taoDonHang(
      {
        ...payload,
        maBan,
        maDonHang: payload.maDonHang || this.taoMa('DH'),
        chiTiet: chiTiet.length
          ? chiTiet
          : danhSachMon.length
            ? danhSachMon
            : items,
        nguonTao: 'QRCode',
        loaiDon: 'TAI_BAN',
      },
      'TAI_BAN',
    );
  }
}
