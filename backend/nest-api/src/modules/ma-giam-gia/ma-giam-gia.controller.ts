import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
}
