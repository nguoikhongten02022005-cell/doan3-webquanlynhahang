import { Controller, Get, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';

@ApiTags('loyalty')
@ApiBearerAuth('access-token')
@Controller('api/loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('me')
  layTongQuanDiemTichLuy(@Headers('authorization') authorization?: string) {
    return this.loyaltyService.layTongQuanDiemTichLuy(authorization);
  }

  @Get('me/history')
  layLichSuDiemTichLuy(@Headers('authorization') authorization?: string) {
    return this.loyaltyService.layLichSuDiemTichLuy(authorization);
  }
}
