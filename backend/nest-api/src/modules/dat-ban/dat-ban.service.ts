import { Injectable } from '@nestjs/common';
import { DatBanQueryService } from './dat-ban-query.service';
import { DatBanCommandService } from './dat-ban-command.service';

type BanGhi = Record<string, any>;

@Injectable()
export class DatBanService {
  constructor(
    private readonly datBanQueryService: DatBanQueryService,
    private readonly datBanCommandService: DatBanCommandService,
  ) {}

  layDanhSachDatBan(authorization?: string) {
    return this.datBanQueryService.layDanhSachDatBan(authorization);
  }

  layLichSuDatBan(authorization: string | undefined, maKh: string) {
    return this.datBanQueryService.layLichSuDatBan(authorization, maKh);
  }

  layKhaDungDatBan(query: Record<string, unknown>) {
    return this.datBanQueryService.layKhaDungDatBan(query);
  }

  taoDatBan(authorization: string | undefined, body: BanGhi) {
    return this.datBanCommandService.taoDatBan(authorization, body);
  }

  capNhatDatBan(authorization: string | undefined, maDatBan: string, body: BanGhi) {
    return this.datBanCommandService.capNhatDatBan(authorization, maDatBan, body);
  }

  capNhatTrangThaiDatBan(authorization: string | undefined, maDatBan: string, trangThai: string) {
    return this.datBanCommandService.capNhatTrangThaiDatBan(authorization, maDatBan, trangThai);
  }

  ganBanChoDatBan(authorization: string | undefined, maDatBan: string, body: BanGhi) {
    return this.datBanCommandService.ganBanChoDatBan(authorization, maDatBan, body);
  }
}
