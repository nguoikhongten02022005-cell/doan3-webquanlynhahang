import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DonHangService } from './don-hang.service';

@ApiTags('don-hang')
@Controller('api/don-hang')
export class DonHangController {
  constructor(private readonly donHangService: DonHangService) {}

  @Get()
  layDanhSachDonHang(@Headers('authorization') authorization?: string) {
    return this.donHangService.layDanhSachDonHang(authorization);
  }

  @Get('me')
  layDonHangCuaToi(@Headers('authorization') authorization?: string) {
    return this.donHangService.layDonHangCuaToi(authorization);
  }

  @Get('co-the-danh-gia')
  layDonHangCoTheDanhGia(@Headers('authorization') authorization?: string) {
    return this.donHangService.layDonHangCoTheDanhGia(authorization);
  }

  @Get(':maDonHang')
  layChiTietDonHang(@Headers('authorization') authorization: string | undefined, @Param('maDonHang') maDonHang: string) {
    return this.donHangService.layChiTietDonHang(authorization, maDonHang);
  }

  @Post()
  taoDonHang(@Body() body: Record<string, unknown>) {
    return this.donHangService.taoDonHang(body);
  }

  @Patch(':maDonHang/status')
  capNhatTrangThaiDonHang(
    @Headers('authorization') authorization: string | undefined,
    @Param('maDonHang') maDonHang: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.donHangService.capNhatTrangThaiDonHang(
      authorization,
      maDonHang,
      String(body.trangThai || ''),
    );
  }
}
