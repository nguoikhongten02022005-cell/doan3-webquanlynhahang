import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KhachHangService } from './khach-hang.service';
import { TaoKhachHangDto } from './dto/tao-khach-hang.dto';
import { CapNhatKhachHangDto } from './dto/cap-nhat-khach-hang.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('khach-hang')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/khach-hang')
export class KhachHangController {
  constructor(private readonly khachHangService: KhachHangService) {}

  @Roles('Admin', 'NhanVien')
  @Get()
  layDanhSach(
    @Query('tuKhoa') tuKhoa?: string,
    @Query('phanLoai') phanLoai?: string,
    @Query('sapXep') sapXep?: string,
    @Query('thuTu') thuTu?: string,
    @Query('trang') trang?: string,
    @Query('soLuong') soLuong?: string,
  ) {
    return this.khachHangService.layDanhSach({
      tuKhoa,
      phanLoai,
      sapXep,
      thuTu,
      trang: trang ? parseInt(trang, 10) : undefined,
      soLuong: soLuong ? parseInt(soLuong, 10) : undefined,
    });
  }

  @Roles('Admin', 'NhanVien')
  @Get(':maKH')
  layChiTiet(@Param('maKH') maKH: string) {
    return this.khachHangService.layChiTiet(maKH);
  }

  @Roles('Admin', 'NhanVien')
  @Get(':maKH/lich-su')
  layLichSu(@Param('maKH') maKH: string) {
    return this.khachHangService.layLichSu(maKH);
  }

  @Roles('Admin', 'NhanVien')
  @Post()
  tao(@Body() body: TaoKhachHangDto) {
    return this.khachHangService.tao({
      tenKH: body.tenKH,
      sdt: body.sdt,
      diaChi: body.diaChi,
      diemTichLuy: body.diemTichLuy,
    });
  }

  @Roles('Admin', 'NhanVien')
  @Put(':maKH')
  capNhat(@Param('maKH') maKH: string, @Body() body: CapNhatKhachHangDto) {
    return this.khachHangService.capNhat(maKH, {
      tenKH: body.tenKH,
      sdt: body.sdt,
      diaChi: body.diaChi,
    });
  }

  @Roles('Admin')
  @Delete(':maKH')
  xoa(@Param('maKH') maKH: string) {
    return this.khachHangService.xoa(maKH);
  }

  @Roles('Admin', 'NhanVien')
  @Patch(':maKH/diem')
  capNhatDiem(
    @Param('maKH') maKH: string,
    @Body() body: Record<string, unknown>,
  ) {
    const soDiem = Number(body.soDiem);
    if (isNaN(soDiem)) throw new BadRequestException('So diem khong hop le.');
    return this.khachHangService.capNhatDiem(maKH, {
      soDiem,
      moTa: body.moTa as string | undefined,
    });
  }
}
