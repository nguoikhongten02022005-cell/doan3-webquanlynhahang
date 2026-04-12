import { Injectable } from '@nestjs/common';
import { DonHangQueryService } from './don-hang-query.service';
import { DonHangCommandService } from './don-hang-command.service';

type BanGhi = Record<string, any>;

@Injectable()
export class DonHangService {
  constructor(
    private readonly donHangQueryService: DonHangQueryService,
    private readonly donHangCommandService: DonHangCommandService,
  ) {}

  async layChiTietDonHangTheoMaPublic(maDonHang: string) {
    return this.donHangQueryService.layChiTietDonHangTheoMa(maDonHang);
  }

  layDanhSachDonHang(dauTrang?: string) {
    return this.donHangQueryService.layDanhSachDonHang(dauTrang);
  }

  layDonHangCuaToi(dauTrang?: string) {
    return this.donHangQueryService.layDonHangCuaToi(dauTrang);
  }

  layDonHangCoTheDanhGia(dauTrang?: string) {
    return this.donHangQueryService.layDonHangCoTheDanhGia(dauTrang);
  }

  layChiTietDonHang(dauTrang: string | undefined, maDonHang: string) {
    return this.donHangQueryService.layChiTietDonHang(dauTrang, maDonHang);
  }

  taoDonHang(payload: BanGhi, loaiDon?: string) {
    return this.donHangCommandService.taoDonHang(payload, loaiDon);
  }

  taoOrderTaiBan(maBan: string, payload: BanGhi) {
    return this.donHangCommandService.taoOrderTaiBan(maBan, payload);
  }

  layOrderDangMoTaiBan(maBan: string) {
    return this.donHangCommandService.layOrderDangMoTaiBan(maBan);
  }

  yeuCauThanhToanTaiBan(maBan: string) {
    return this.donHangCommandService.yeuCauThanhToanTaiBan(maBan);
  }

  xacNhanThanhToanTaiBan(maBan: string) {
    return this.donHangCommandService.xacNhanThanhToanTaiBan(maBan);
  }

  capNhatTrangThaiDonHang(dauTrang: string | undefined, maDonHang: string, trangThai: string) {
    return this.donHangCommandService.capNhatTrangThaiDonHang(dauTrang, maDonHang, trangThai);
  }
}
