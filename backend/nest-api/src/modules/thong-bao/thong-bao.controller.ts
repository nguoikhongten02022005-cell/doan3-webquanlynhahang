import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ThongBaoService } from './thong-bao.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('thong-bao')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/thong-bao')
export class ThongBaoController {
  constructor(private readonly thongBaoService: ThongBaoService) {}

  @Get()
  layDanhSachThongBao(@CurrentUser() user: any) {
    return this.thongBaoService.layDanhSachThongBao(String(user.maND));
  }

  @Patch(':id/doc')
  danhDauDaDoc(
    @Param('id') maThongBao: string,
    @CurrentUser() user: any,
  ) {
    return this.thongBaoService.danhDauDaDoc(maThongBao, String(user.maND));
  }

  @Get('dem-chua-doc')
  demChuaDoc(@CurrentUser() user: any) {
    return this.thongBaoService.demChuaDoc(String(user.maND));
  }
}