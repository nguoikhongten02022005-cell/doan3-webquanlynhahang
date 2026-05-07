import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  dangKy(@Body() body: Record<string, unknown>) {
    return this.authService.dangKy(body);
  }

  @Public()
  @Post('login')
  dangNhap(@Body() body: Record<string, unknown>) {
    return this.authService.dangNhap(
      String(body.email || ''),
      String(body.matKhau || ''),
    );
  }

  @Public()
  @Post('internal-login')
  dangNhapNoiBo(@Body() body: Record<string, unknown>) {
    return this.authService.dangNhapNoiBo(
      String(body.email || ''),
      String(body.matKhau || ''),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  dangXuat() {
    return this.authService.dangXuat();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  layThongTinToi(@CurrentUser() user: any) {
    return this.authService.layThongTinToiTuUser(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get('nguoi-dung')
  layDanhSachNguoiDung() {
    return this.authService.layDanhSachNguoiDungQuery();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  capNhatHoSo(
    @CurrentUser() user: any,
    @Body() body: Record<string, unknown>,
  ) {
    return this.authService.capNhatHoSoTuUser(user, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('doi-mat-khau')
  doiMatKhau(
    @CurrentUser() user: any,
    @Body() body: Record<string, unknown>,
  ) {
    return this.authService.doiMatKhauTuUser(user, body);
  }
}
