import { Injectable } from '@nestjs/common';
import { BanCrudService } from './ban-crud.service';
import { BanTrangThaiQrService } from './ban-trang-thai-qr.service';
import { TaiBanService } from '../tai-ban/tai-ban.service';

type BanGhi = Record<string, any>;

@Injectable()
export class BanService {
  constructor(
    private readonly banCrudService: BanCrudService,
    private readonly banTrangThaiQrService: BanTrangThaiQrService,
    private readonly taiBanService: TaiBanService,
  ) {}

  layDanhSachBan() {
    return this.banCrudService.layDanhSachBan();
  }

  taoBan(authorization: string | undefined, body: BanGhi) {
    return this.banCrudService.taoBan(authorization, body);
  }

  capNhatBan(authorization: string | undefined, maBan: string, body: BanGhi) {
    return this.banCrudService.capNhatBan(authorization, maBan, body);
  }

  xoaBan(authorization: string | undefined, maBan: string) {
    return this.banCrudService.xoaBan(authorization, maBan);
  }

  capNhatTrangThaiBan(
    authorization: string | undefined,
    maBan: string,
    trangThai: string,
  ) {
    return this.banTrangThaiQrService.capNhatTrangThaiBan(
      authorization,
      maBan,
      trangThai,
    );
  }

  layQrBan(authorization: string | undefined, maBan: string) {
    return this.banTrangThaiQrService.layQrBan(authorization, maBan);
  }

  layThucDonTheoBan(maBan: string) {
    return this.banTrangThaiQrService.layThucDonTheoBan(maBan);
  }

  taoOrderTaiBan(maBan: string, body: BanGhi) {
    return this.taiBanService.taoOrderTaiBan(maBan, body);
  }

  layOrderDangMoTaiBan(maBan: string) {
    return this.taiBanService.layOrderDangMoTaiBan(maBan);
  }

  yeuCauThanhToanTaiBan(maBan: string) {
    return this.taiBanService.yeuCauThanhToanTaiBan(maBan);
  }

  xacNhanThanhToanTaiBan(maBan: string) {
    return this.taiBanService.xacNhanThanhToanTaiBan(maBan);
  }
}
