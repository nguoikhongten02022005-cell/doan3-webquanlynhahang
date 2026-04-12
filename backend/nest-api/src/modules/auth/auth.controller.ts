import { Body, Controller, Get, Headers, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  dangKy(@Body() body: Record<string, unknown>) {
    return this.authService.dangKy(body);
  }

  @Post('login')
  dangNhap(@Body() body: Record<string, unknown>) {
    return this.authService.dangNhap(String(body.email || ''), String(body.matKhau || ''));
  }

  @Post('internal-login')
  dangNhapNoiBo(@Body() body: Record<string, unknown>) {
    return this.authService.dangNhapNoiBo(String(body.email || ''), String(body.matKhau || ''));
  }

  @Post('logout')
  dangXuat() {
    return this.authService.dangXuat();
  }

  @Get('me')
  layThongTinToi(@Headers('authorization') authorization?: string) {
    return this.authService.layThongTinToi(authorization);
  }

  @Get('nguoi-dung')
  layDanhSachNguoiDung(@Headers('authorization') authorization?: string) {
    return this.authService.layDanhSachNguoiDung(authorization);
  }

  @Put('profile')
  capNhatHoSo(@Headers('authorization') authorization: string | undefined, @Body() body: Record<string, unknown>) {
    return this.authService.capNhatHoSo(authorization, body);
  }

  @Put('doi-mat-khau')
  doiMatKhau(@Headers('authorization') authorization: string | undefined, @Body() body: Record<string, unknown>) {
    return this.authService.doiMatKhau(authorization, body);
  }
}
