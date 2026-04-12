import { Body, Controller, Post } from '@nestjs/common';
import { VoucherService } from './voucher.service';

type BanGhi = Record<string, any>;

@Controller('api/ma-giam-gia')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('validate')
  kiemTraMaGiamGia(@Body() body: BanGhi) {
    return this.voucherService.kiemTraMaGiamGia(body);
  }
}
