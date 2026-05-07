import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DiemTichLuyService } from './diem-tich-luy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('diem-tich-luy')
@ApiBearerAuth('access-token')
@Controller('api/diem-tich-luy')
@UseGuards(JwtAuthGuard)
export class DiemTichLuyController {
  constructor(private readonly diemTichLuyService: DiemTichLuyService) {}

  @Get('me')
  layTongQuanDiemTichLuy(@CurrentUser() nguoiDung: any) {
    return this.diemTichLuyService.layTongQuanDiemTichLuy(nguoiDung);
  }

  @Get('me/history')
  layLichSuDiemTichLuy(@CurrentUser() nguoiDung: any) {
    return this.diemTichLuyService.layLichSuDiemTichLuy(nguoiDung);
  }

  @Post('tinh-diem')
  tinhDiem(
    @CurrentUser() nguoiDung: any,
    @Body() body: { maDonHang: string; tongTien: number; moTa?: string },
  ) {
    return this.diemTichLuyService.tinhDiem(nguoiDung, body);
  }

  @Post('doi-diem')
  doiDiem(
    @CurrentUser() nguoiDung: any,
    @Body() body: { soDiem: number; moTa?: string },
  ) {
    return this.diemTichLuyService.doiDiem(nguoiDung, body);
  }

  @Post('huy-don')
  congDiemHuyDon(
    @CurrentUser() nguoiDung: any,
    @Body() body: { maDonHang: string; soDiem: number; moTa?: string },
  ) {
    return this.diemTichLuyService.congDiemHuyDon(nguoiDung, body);
  }
}
