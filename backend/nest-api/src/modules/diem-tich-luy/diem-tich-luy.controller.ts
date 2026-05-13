import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { DiemTichLuyService } from './diem-tich-luy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class TinhDiemDto {
  @IsString()
  maDonHang: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  tongTien: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  moTa?: string;
}

class DoiDiemDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  soDiem: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  moTa?: string;
}

class HuyDonTichDiemDto {
  @IsString()
  maDonHang: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  soDiem: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  moTa?: string;
}

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
  tinhDiem(@CurrentUser() nguoiDung: any, @Body() body: TinhDiemDto) {
    return this.diemTichLuyService.tinhDiem(nguoiDung, body);
  }

  @Post('doi-diem')
  doiDiem(@CurrentUser() nguoiDung: any, @Body() body: DoiDiemDto) {
    return this.diemTichLuyService.doiDiem(nguoiDung, body);
  }

  @Post('huy-don')
  congDiemHuyDon(
    @CurrentUser() nguoiDung: any,
    @Body() body: HuyDonTichDiemDto,
  ) {
    return this.diemTichLuyService.congDiemHuyDon(nguoiDung, body);
  }
}
