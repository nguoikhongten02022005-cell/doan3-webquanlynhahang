import { BadRequestException, Injectable } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { BanGhi } from '../../common/types';
import { tinhGiamGia } from '../../common/tinh-giam-gia.helper';

const TI_LE_QUY_DOI_DIEM = 100;
const GIA_TRI_QUY_DOI = 10000;

@Injectable()
export class DonHangPricingService {
  constructor(private readonly mysql: MySqlService) {}

  taoPhanHoiMaGiam(payload: BanGhi = {}, soTienGiamThucTe = 0) {
    return {
      hopLe: Boolean(payload.maGiamGia || payload.maCode),
      maGiamGia: String(payload.maGiamGia || payload.maCode || '').trim(),
      tenGiamGia: String(payload.tenGiamGia || payload.tenCode || '').trim(),
      loaiGiam: String(payload.loaiGiam || '').trim(),
      giaTriGiam: Number(payload.giaTriGiam || payload.giaTri || 0),
      giamToiDa:
        payload.giamToiDa == null && payload.giaTriToiDa == null
          ? null
          : Number(payload.giamToiDa ?? payload.giaTriToiDa),
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

  taoTongHopGia(tamTinh: number, phiShip = 0, giamGia = 0, phiDichVu = 0) {
    return {
      tamTinh: Number(tamTinh || 0),
      giamGia: Number(giamGia || 0),
      phiDichVu: Number(phiDichVu || 0),
      phiShip: Number(phiShip || 0),
      tongTien: Math.max(0, Number(tamTinh || 0) + Number(phiDichVu || 0) + Number(phiShip || 0) - Number(giamGia || 0)),
    };
  }

  taoTongHopGiaTuDuLieuDonHang(donHang: BanGhi, chiTiet: BanGhi[]) {
    const tamTinh = this.tinhTongTamTinhTuChiTiet(chiTiet);
    const phiShip = Number(donHang.PhiShip || donHang.phiShip || 0);
    const tongTienDaLuu = Number(donHang.TongTien || donHang.tongTien || 0);
    const phiDichVu = this.tinhPhiDichVuTheoTamTinh(tamTinh);
    const tongTruocGiam = tamTinh + phiShip + phiDichVu;
    const giamGia = Math.max(0, tongTruocGiam - tongTienDaLuu);
    return this.taoTongHopGia(tamTinh, phiShip, giamGia, phiDichVu);
  }

  async layThongTinMaGiamApDung(maCodeDauVao: unknown, tongTien: number) {
    const maCode = String(maCodeDauVao || '').trim();
    if (!maCode) {
      return this.taoPhanHoiMaGiam();
    }

    const [ma] = await this.mysql.truyVan('SELECT * FROM MaGiamGia WHERE MaCode = ? LIMIT 1', [maCode]);
    if (!ma) throw new BadRequestException('Ma giam gia khong ton tai.');
    if (String(ma.TrangThai || '') !== 'Active') throw new BadRequestException('Ma giam gia khong con hieu luc.');

    const now = new Date();
    if (ma.NgayBatDau && new Date(ma.NgayBatDau) > now) throw new BadRequestException('Ma giam gia chua den thoi gian ap dung.');
    if (ma.NgayKetThuc && new Date(ma.NgayKetThuc) < now) throw new BadRequestException('Ma giam gia da het han.');

    if (ma.SoLanToiDa != null && Number(ma.SoLanDaDung) >= Number(ma.SoLanToiDa)) {
      throw new BadRequestException('Ma giam gia da dat gioi han su dung.');
    }

    if (tongTien < Number(ma.DonHangToiThieu || 0)) throw new BadRequestException('Don hang chua du dieu kien ap dung ma giam gia.');

    const { giaTriGiam, giamToiDa, soTienGiamThucTe } = tinhGiamGia(tongTien, ma);

    return this.taoPhanHoiMaGiam(
      {
        maGiamGia: ma.MaCode,
        tenGiamGia: ma.TenCode,
        loaiGiam: ma.LoaiGiam,
        giaTriGiam,
        giamToiDa,
        dieuKienToiThieu: Number(ma.DonHangToiThieu || 0),
        thongDiep: '',
      },
      soTienGiamThucTe,
    );
  }

  tinhSoTienGiamTuDiem(soDiem: number): number {
    if (!soDiem || soDiem <= 0) return 0;
    return Math.floor(soDiem / TI_LE_QUY_DOI_DIEM) * GIA_TRI_QUY_DOI;
  }

  taoPhanHoiDiem(soDiem: number, soTienGiam: number) {
    return {
      soDiem: Number(soDiem || 0),
      soTienGiam: Number(soTienGiam || 0),
      tiLeQuyDoi: TI_LE_QUY_DOI_DIEM,
      giaTriQuyDoi: GIA_TRI_QUY_DOI,
      thongDiep: soDiem > 0 ? `Đổi ${soDiem} điểm = ${soTienGiam.toLocaleString('vi-VN')}đ` : '',
    };
  }

  async tinhLaiGiaDonHang(payload: BanGhi, chiTietDauVao: BanGhi[]) {
    const chiTietDaTinh: BanGhi[] = [];
    let tamTinh = 0;

    for (const muc of chiTietDauVao) {
      const [mon] = await this.mysql.truyVan('SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1', [muc.maMon]);
      if (!mon) throw new BadRequestException(`Mon ${muc.maMon} khong ton tai.`);

      const soLuong = Number(muc.soLuong || 0);
      const donGia = Number(mon.Gia || 0);
      const thanhTien = soLuong * donGia;
      tamTinh += thanhTien;
      chiTietDaTinh.push({ ...muc, tenMon: String(mon.TenMon || ''), donGia, soLuong, thanhTien });
    }

    const phiShip = Number(payload.phiShip || 0);
    const phiDichVu = this.tinhPhiDichVuTheoTamTinh(tamTinh);
    const maGiamGia = await this.layThongTinMaGiamApDung(payload.maGiamGia, tamTinh + phiDichVu + phiShip);

    const soDiem = Number(payload.soDiem || 0);
    const giamGiaTuDiem = this.tinhSoTienGiamTuDiem(soDiem);
    const diemApDung = this.taoPhanHoiDiem(soDiem, giamGiaTuDiem);

    const tongGiamGia = maGiamGia.soTienGiamThucTe + giamGiaTuDiem;
    const tongHopGia = this.taoTongHopGia(tamTinh, phiShip, tongGiamGia, phiDichVu);

    return { chiTietDaTinh, tongHopGia, maGiamGia, diemApDung };
  }
}
