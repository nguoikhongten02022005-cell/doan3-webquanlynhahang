import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DonHangService } from './don-hang.service';
import { TaoDonHangDto } from './dto/tao-don-hang.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('don-hang')
@Controller('api/don-hang')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DonHangController {
  constructor(private readonly donHangService: DonHangService) {}

  @Roles('Admin', 'NhanVien')
  @Get()
  layDanhSachDonHang() {
    return this.donHangService.layDanhSachDonHang();
  }

  @Get('me')
  layDonHangCuaToi(@CurrentUser() nguoiDung: any) {
    return this.donHangService.layDonHangCuaToi(nguoiDung);
  }

  @Get('co-the-danh-gia')
  layDonHangCoTheDanhGia(@CurrentUser() nguoiDung: any) {
    return this.donHangService.layDonHangCoTheDanhGia(nguoiDung);
  }

  @Get(':maDonHang')
  layChiTietDonHang(
    @CurrentUser() nguoiDung: any,
    @Param('maDonHang') maDonHang: string,
  ) {
    return this.donHangService.layChiTietDonHang(nguoiDung, maDonHang);
  }

  @Post()
  taoDonHang(@Body() body: TaoDonHangDto) {
    return this.donHangService.taoDonHang(body);
  }

  @Roles('Admin', 'NhanVien')
  @Patch(':maDonHang/status')
  capNhatTrangThaiDonHang(
    @Param('maDonHang') maDonHang: string,
    @Body() body: { trangThai: string },
  ) {
    return this.donHangService.capNhatTrangThaiDonHang(
      maDonHang,
      String(body.trangThai || ''),
    );
  }

  @Roles('Admin', 'NhanVien', 'QuanLy')
  @Patch(':maDonHang/chi-tiet/:maChiTiet/trang-thai')
  capNhatTrangThaiChiTietMon(
    @Param('maDonHang') maDonHang: string,
    @Param('maChiTiet') maChiTiet: string,
    @Body() body: { trangThai: string },
  ) {
    return this.donHangService.capNhatTrangThaiChiTietMon(
      maDonHang,
      maChiTiet,
      String(body.trangThai || ''),
    );
  }
}
