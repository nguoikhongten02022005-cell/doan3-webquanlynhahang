import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DanhGiaService } from './danh-gia.service';

type BanGhi = Record<string, any>;

@ApiTags('danh-gia')
@Controller('api/danh-gia')
export class DanhGiaController {
  constructor(private readonly danhGiaService: DanhGiaService) {}

  @Get()
  layDanhSachDanhGia(@Headers('authorization') authorization?: string) {
    return this.danhGiaService.layDanhSachDanhGia(authorization);
  }

  @Post()
  taoDanhGia(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: BanGhi,
  ) {
    return this.danhGiaService.taoDanhGia(authorization, body);
  }

  @Patch(':maDanhGia/duyet')
  duyetDanhGia(
    @Headers('authorization') authorization: string | undefined,
    @Param('maDanhGia') maDanhGia: string,
    @Body() body: BanGhi,
  ) {
    return this.danhGiaService.duyetDanhGia(authorization, maDanhGia, body);
  }
}
