import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
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

  @Post('tinh-diem')
  tinhDiem(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: { maDonHang: string; tongTien: number; moTa?: string },
  ) {
    return this.diemTichLuyService.tinhDiem(authorization, body);
  }

  @Post('doi-diem')
  doiDiem(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: { soDiem: number; moTa?: string },
  ) {
    return this.diemTichLuyService.doiDiem(authorization, body);
  }

  @Post('huy-don')
  congDiemHuyDon(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: { maDonHang: string; soDiem: number; moTa?: string },
  ) {
    return this.diemTichLuyService.congDiemHuyDon(authorization, body);
  }
}