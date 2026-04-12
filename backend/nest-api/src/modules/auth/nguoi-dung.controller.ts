import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/nguoi-dung')
export class NguoiDungController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  layDanhSachNguoiDung(@Headers('authorization') authorization?: string) {
    return this.authService.layDanhSachNguoiDung(authorization);
  }

  @Post()
  taoNguoiDungNoiBo(@Headers('authorization') authorization: string | undefined, @Body() body: Record<string, unknown>) {
    return this.authService.taoNguoiDungNoiBo(authorization, body);
  }

  @Put(':maND')
  capNhatNguoiDungNoiBo(@Headers('authorization') authorization: string | undefined, @Param('maND') maND: string, @Body() body: Record<string, unknown>) {
    return this.authService.capNhatNguoiDungNoiBo(authorization, maND, body);
  }

  @Delete(':maND')
  xoaNguoiDungNoiBo(@Headers('authorization') authorization: string | undefined, @Param('maND') maND: string) {
    return this.authService.xoaNguoiDungNoiBo(authorization, maND);
  }
}
