import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('nguoi-dung-noi-bo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
@Controller('api/nguoi-dung')
export class NguoiDungController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  layDanhSachNguoiDung() {
    return this.authService.layDanhSachNguoiDungQuery();
  }

  @Post()
  taoNguoiDungNoiBo(@Body() body: Record<string, unknown>) {
    return this.authService.taoNguoiDungNoiBo(body);
  }

  @Put(':maND')
  capNhatNguoiDungNoiBo(
    @Param('maND') maND: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.authService.capNhatNguoiDungNoiBo(maND, body);
  }

  @Delete(':maND')
  xoaNguoiDungNoiBo(@Param('maND') maND: string) {
    return this.authService.xoaNguoiDungNoiBo(maND);
  }
}
