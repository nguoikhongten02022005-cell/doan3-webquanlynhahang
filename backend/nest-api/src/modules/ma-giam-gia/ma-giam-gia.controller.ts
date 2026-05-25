import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MaGiamGiaService } from './ma-giam-gia.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CapNhatMaGiamGiaDto,
  KiemTraMaGiamGiaDto,
  TaoMaGiamGiaDto,
} from './dto/ma-giam-gia.dto';

@ApiTags('ma-giam-gia')
@Controller('api/ma-giam-gia')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaGiamGiaController {
  constructor(private readonly maGiamGiaService: MaGiamGiaService) {}

  @Public()
  @Post('validate')
  kiemTraMaGiamGia(@Body() body: KiemTraMaGiamGiaDto) {
    return this.maGiamGiaService.kiemTraMaGiamGia(body);
  }

  @Public()
  @Get('public')
  layVoucherCongKhaiChoCheckout() {
    return this.maGiamGiaService.layDanhSachCongKhaiChoCheckout();
  }

  @ApiBearerAuth('access-token')
  @Roles('KhachHang')
  @Get('me')
  layVoucherCuaToi(@CurrentUser() nguoiDung: any) {
    return this.maGiamGiaService.layCuaToi(nguoiDung);
  }

  @ApiBearerAuth('access-token')
  @Roles('KhachHang')
  @Get('me/checkout')
  layVoucherCuaToiChoCheckout(@CurrentUser() nguoiDung: any) {
    return this.maGiamGiaService.layVoucherCuaToiChoCheckout(nguoiDung);
  }

  @ApiBearerAuth('access-token')
  @Roles('Admin', 'NhanVien')
  @Get()
  layDanhSach() {
    return this.maGiamGiaService.layDanhSach();
  }

  @ApiBearerAuth('access-token')
  @Roles('Admin', 'NhanVien')
  @Get(':maCode')
  layChiTiet(@Param('maCode') maCode: string) {
    return this.maGiamGiaService.layChiTiet(maCode);
  }

  @ApiBearerAuth('access-token')
  @Roles('Admin')
  @Post()
  taoMaGiamGia(@Body() body: TaoMaGiamGiaDto) {
    return this.maGiamGiaService.taoMaGiamGia(body);
  }

  @ApiBearerAuth('access-token')
  @Roles('Admin')
  @Put(':maCode')
  capNhatMa(
    @Param('maCode') maCode: string,
    @Body() body: CapNhatMaGiamGiaDto,
  ) {
    return this.maGiamGiaService.capNhatMa(maCode, body);
  }

  @ApiBearerAuth('access-token')
  @Roles('Admin')
  @Delete(':maCode')
  xoaMa(@Param('maCode') maCode: string) {
    return this.maGiamGiaService.xoaMa(maCode);
  }
}
