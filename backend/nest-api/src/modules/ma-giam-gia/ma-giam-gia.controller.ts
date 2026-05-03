import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MaGiamGiaService } from './ma-giam-gia.service';

type BanGhi = Record<string, any>;

@ApiTags('ma-giam-gia')
@Controller('api/ma-giam-gia')
export class MaGiamGiaController {
  constructor(private readonly maGiamGiaService: MaGiamGiaService) {}

  @Post('validate')
  kiemTraMaGiamGia(@Body() body: BanGhi) {
    return this.maGiamGiaService.kiemTraMaGiamGia(body);
  }

  @ApiBearerAuth('access-token')
  @Get()
  layDanhSach() {
    return this.maGiamGiaService.layDanhSach();
  }

  @ApiBearerAuth('access-token')
  @Get(':maCode')
  layChiTiet(@Param('maCode') maCode: string) {
    return this.maGiamGiaService.layChiTiet(maCode);
  }

  @ApiBearerAuth('access-token')
  @Post()
  taoMa(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: BanGhi,
  ) {
    return this.maGiamGiaService.taoMa(authorization, body);
  }

  @ApiBearerAuth('access-token')
  @Put(':maCode')
  capNhatMa(
    @Headers('authorization') authorization: string | undefined,
    @Param('maCode') maCode: string,
    @Body() body: BanGhi,
  ) {
    return this.maGiamGiaService.capNhatMa(authorization, maCode, body);
  }

  @ApiBearerAuth('access-token')
  @Delete(':maCode')
  xoaMa(
    @Headers('authorization') authorization: string | undefined,
    @Param('maCode') maCode: string,
  ) {
    return this.maGiamGiaService.xoaMa(authorization, maCode);
  }
}
