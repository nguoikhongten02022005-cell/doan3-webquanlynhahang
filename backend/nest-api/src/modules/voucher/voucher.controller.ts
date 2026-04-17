import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VoucherService } from './voucher.service';

type BanGhi = Record<string, any>;

@ApiTags('ma-giam-gia')
@Controller('api/ma-giam-gia')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('validate')
  kiemTraMaGiamGia(@Body() body: BanGhi) {
    return this.voucherService.kiemTraMaGiamGia(body);
  }
}
