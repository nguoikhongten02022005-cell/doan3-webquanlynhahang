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
import { BanGhi } from '../../common/types';

@ApiTags('ma-giam-gia')
@Controller('api/ma-giam-gia')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaGiamGiaController {
  constructor(private readonly maGiamGiaService: MaGiamGiaService) {}

  @Public()
  @Post('validate')
  kiemTraMaGiamGia(@Body() body: BanGhi) {
    return this.maGiamGiaService.kiemTraMaGiamGia(body);
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
  taoMaGiamGia(@Body() body: BanGhi) {
    return this.maGiamGiaService.taoMaGiamGia(body);
  }

  @ApiBearerAuth('access-token')
  @Roles('Admin')
  @Put(':maCode')
  capNhatMa(@Param('maCode') maCode: string, @Body() body: BanGhi) {
    return this.maGiamGiaService.capNhatMa(maCode, body);
  }

  @ApiBearerAuth('access-token')
  @Roles('Admin')
  @Delete(':maCode')
  xoaMa(@Param('maCode') maCode: string) {
    return this.maGiamGiaService.xoaMa(maCode);
  }
}
