import { BadRequestException, Injectable } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';

type BanGhi = Record<string, any>;

@Injectable()
export class DonHangPricingService {
  constructor(private readonly mysql: MySqlService) {}

  taoVoucherResponse(payload: BanGhi = {}, soTienGiamThucTe = 0) {
    return {
      hopLe: Boolean(payload.maGiamGia || payload.maCode),
      maGiamGia: String(payload.maGiamGia || payload.maCode || '').trim(),
      tenGiamGia: String(payload.tenGiamGia || payload.tenCode || '').trim(),
      loaiGiam: String(payload.loaiGiam || '').trim(),
      giaTriGiam: Number(payload.giaTriGiam || payload.giaTri || 0),
      giamToiDa: payload.giamToiDa == null && payload.giaTriToiDa == null ? null : Number(payload.giamToiDa ?? payload.giaTriToiDa),
      dieuKienToiThieu: Number(payload.dieuKienToiThieu || payload.donHangToiThieu || 0),
      soTienGiamThucTe: Number(soTienGiamThucTe || 0),
      thongDiep: String(payload.thongDiep || payload.moTa || '').trim(),
    };
  }

  taoThongTinNhanHang(donHang: BanGhi) {
    return {
      loaiDon: String(donHang.loaiDon || donHang.LoaiDon || '').trim(),
      diaChiGiao: String(donHang.diaChiGiao || donHang.DiaChiGiao || '').trim(),
      gioLayHang: String(donHang.gioLayHang || donHang.GioLayHang || '').trim(),
      gioGiao: String(donHang.gioGiao || donHang.GioGiao || '').trim(),
    };
  }

  tinhPhiDichVuTheoTamTinh(tamTinh: number) {
    return tamTinh > 0 ? Math.round((Number(tamTinh || 0) * 0.05) / 1000) * 1000 : 0;
  }

  tinhTongTamTinhTuChiTiet(chiTiet: BanGhi[]) {
    return chiTiet.reduce((tong, muc) => tong + Number(muc.ThanhTien || muc.thanhTien || 0), 0);
  }

  taoPricingSummary(tamTinh: number, phiShip = 0, giamGia = 0, phiDichVu = 0) {
    return {
      tamTinh: Number(tamTinh || 0),
      giamGia: Number(giamGia || 0),
      phiDichVu: Number(phiDichVu || 0),
      phiShip: Number(phiShip || 0),
      tongTien: Math.max(0, Number(tamTinh || 0) + Number(phiDichVu || 0) + Number(phiShip || 0) - Number(giamGia || 0)),
    };
  }

  taoPricingSummaryTuDuLieuDonHang(donHang: BanGhi, chiTiet: BanGhi[]) {
    const tamTinh = this.tinhTongTamTinhTuChiTiet(chiTiet);
    const phiShip = Number(donHang.PhiShip || donHang.phiShip || 0);
    const tongTienDaLuu = Number(donHang.TongTien || donHang.tongTien || 0);
    const phiDichVu = this.tinhPhiDichVuTheoTamTinh(tamTinh);
    const tongTruocGiam = tamTinh + phiShip + phiDichVu;
    const giamGia = Math.max(0, tongTruocGiam - tongTienDaLuu);
    return this.taoPricingSummary(tamTinh, phiShip, giamGia, phiDichVu);
  }

  async layThongTinVoucherApDung(maCodeDauVao: unknown, tongTien: number) {
    const maCode = String(maCodeDauVao || '').trim();
    if (!maCode) {
      return this.taoVoucherResponse();
    }

    const [ma] = await this.mysql.truyVan('SELECT * FROM MaGiamGia WHERE MaCode = ? LIMIT 1', [maCode]);
    if (!ma) {
      throw new BadRequestException('Ma giam gia khong ton tai.');
    }
    if (String(ma.TrangThai || '') !== 'Active') {
      throw new BadRequestException('Ma giam gia khong con hieu luc.');
    }
    if (tongTien < Number(ma.DonHangToiThieu || 0)) {
      throw new BadRequestException('Don hang chua du dieu kien ap dung ma giam gia.');
    }

    const laPhanTram = String(ma.LoaiGiam || '').toLowerCase() === 'phantram';
    const giaTriGiam = Number(ma.GiaTri || 0);
    const giamToiDa = ma.GiaTriToiDa == null ? null : Number(ma.GiaTriToiDa);
    const soTienGiamTamTinh = laPhanTram ? Math.round((tongTien * giaTriGiam) / 100) : giaTriGiam;
    const soTienGiamThucTe = giamToiDa == null ? soTienGiamTamTinh : Math.min(soTienGiamTamTinh, giamToiDa);

    return this.taoVoucherResponse({
      maGiamGia: ma.MaCode,
      tenGiamGia: ma.TenCode,
      loaiGiam: ma.LoaiGiam,
      giaTriGiam,
      giamToiDa,
      dieuKienToiThieu: Number(ma.DonHangToiThieu || 0),
      thongDiep: '',
    }, soTienGiamThucTe);
  }

  async recalculateOrderPricing(payload: BanGhi, chiTietDauVao: BanGhi[]) {
    const chiTietDaTinh: BanGhi[] = [];
    let tamTinh = 0;

    for (const muc of chiTietDauVao) {
      const [mon] = await this.mysql.truyVan('SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1', [muc.maMon]);
      if (!mon) {
        throw new BadRequestException(`Mon ${muc.maMon} khong ton tai.`);
      }

      const soLuong = Number(muc.soLuong || 0);
      const donGia = Number(mon.Gia || 0);
      const thanhTien = soLuong * donGia;
      tamTinh += thanhTien;
      chiTietDaTinh.push({
        ...muc,
        tenMon: String(mon.TenMon || ''),
        donGia,
        soLuong,
        thanhTien,
      });
    }

    const phiShip = Number(payload.phiShip || 0);
    const phiDichVu = this.tinhPhiDichVuTheoTamTinh(tamTinh);
    const voucher = await this.layThongTinVoucherApDung(payload.maGiamGia, tamTinh + phiDichVu + phiShip);
    const pricingSummary = this.taoPricingSummary(tamTinh, phiShip, voucher.soTienGiamThucTe, phiDichVu);

    return { chiTietDaTinh, pricingSummary, voucher };
  }
}
