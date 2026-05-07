import { Injectable } from '@nestjs/common';
import { DatBanQueryService } from './dat-ban-query.service';
import { DatBanCommandService } from './dat-ban-command.service';
import { BanGhi } from '../../common/types';

@Injectable()
export class DatBanService {
  constructor(
    private readonly datBanQueryService: DatBanQueryService,
    private readonly datBanCommandService: DatBanCommandService,
  ) {}

  layDanhSachDatBan() {
    return this.datBanQueryService.layDanhSachDatBan();
  }

  layLichSuDatBan(nguoiDung: any, maKh: string) {
    return this.datBanQueryService.layLichSuDatBan(nguoiDung, maKh);
  }

  layKhaDungDatBan(query: Record<string, unknown>) {
    return this.datBanQueryService.layKhaDungDatBan(query);
  }

  taoDatBan(nguoiDung: any, body: BanGhi) {
    return this.datBanCommandService.taoDatBan(nguoiDung, body);
  }

  capNhatDatBan(maDatBan: string, body: BanGhi) {
    return this.datBanCommandService.capNhatDatBan(maDatBan, body);
  }

  capNhatTrangThaiDatBan(maDatBan: string, trangThai: string) {
    return this.datBanCommandService.capNhatTrangThaiDatBan(maDatBan, trangThai);
  }

  ganBanChoDatBan(maDatBan: string, body: BanGhi) {
    return this.datBanCommandService.ganBanChoDatBan(maDatBan, body);
  }
}
