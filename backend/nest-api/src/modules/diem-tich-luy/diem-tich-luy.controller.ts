import { Controller, Get, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DiemTichLuyService } from './diem-tich-luy.service';

@ApiTags('diem-tich-luy')
@ApiBearerAuth('access-token')
@Controller('api/diem-tich-luy')
export class DiemTichLuyController {
  constructor(private readonly diemTichLuyService: DiemTichLuyService) {}

  @Get('me')
  layTongQuanDiemTichLuy(@Headers('authorization') authorization?: string) {
    return this.diemTichLuyService.layTongQuanDiemTichLuy(authorization);
  }

  @Get('me/history')
  layLichSuDiemTichLuy(@Headers('authorization') authorization?: string) {
    return this.diemTichLuyService.layLichSuDiemTichLuy(authorization);
  }
}
