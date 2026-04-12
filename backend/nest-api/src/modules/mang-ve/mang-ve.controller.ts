import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { MangVeService } from './mang-ve.service';

type BanGhi = Record<string, any>;

@Controller('api/mang-ve')
export class MangVeController {
  constructor(private readonly mangVeService: MangVeService) {}

  @Post('don-hang')
  taoDonMangVe(@Headers('authorization') authorization: string | undefined, @Body() body: BanGhi) {
    return this.mangVeService.taoDonMangVe(authorization, body);
  }

  @Get('don-hang/:maDonHang')
  layDonMangVe(@Headers('authorization') authorization: string | undefined, @Param('maDonHang') maDonHang: string) {
    return this.mangVeService.layDonMangVe(authorization, maDonHang);
  }

  @Get('noi-bo/don-hang')
  layDanhSachDonMangVeChoNoiBo(@Headers('authorization') authorization?: string) {
    return this.mangVeService.layDanhSachDonMangVeChoNoiBo(authorization);
  }

  @Patch('noi-bo/don-hang/:maDonHang/trang-thai')
  capNhatTrangThaiDonMangVe(@Headers('authorization') authorization: string | undefined, @Param('maDonHang') maDonHang: string, @Body() body: BanGhi) {
    return this.mangVeService.capNhatTrangThaiDonMangVe(authorization, maDonHang, String(body.trangThai || ''));
  }

  @Get('lich-su')
  layLichSuDonMangVe(@Headers('authorization') authorization?: string) {
    return this.mangVeService.layLichSuDonMangVe(authorization);
  }

  @Patch('don-hang/:maDonHang/huy')
  huyDonMangVe(@Headers('authorization') authorization: string | undefined, @Param('maDonHang') maDonHang: string) {
    return this.mangVeService.huyDonMangVe(authorization, maDonHang);
  }
}
