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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KhachHangService } from './khach-hang.service';

@ApiTags('khach-hang')
@Controller('api/khach-hang')
export class KhachHangController {
  constructor(private readonly khachHangService: KhachHangService) {}

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

  @Get(':maKH')
  layChiTiet(@Param('maKH') maKH: string) {
    return this.khachHangService.layChiTiet(maKH);
  }

  @Get(':maKH/lich-su')
  layLichSu(@Param('maKH') maKH: string) {
    return this.khachHangService.layLichSu(maKH);
  }

  @Post()
  tao(@Body() body: Record<string, unknown>) {
    const tenKH = String(body.tenKH || '').trim();
    if (!tenKH) throw new BadRequestException('Ten khach hang la bat buoc.');
    return this.khachHangService.tao({
      tenKH,
      sdt: body.sdt as string | undefined,
      diaChi: body.diaChi as string | undefined,
      diemTichLuy: body.diemTichLuy as number | undefined,
    });
  }

  @Put(':maKH')
  capNhat(@Param('maKH') maKH: string, @Body() body: Record<string, unknown>) {
    return this.khachHangService.capNhat(maKH, {
      tenKH: body.tenKH as string | undefined,
      sdt: body.sdt as string | undefined,
      diaChi: body.diaChi as string | undefined,
    });
  }

  @Delete(':maKH')
  xoa(@Param('maKH') maKH: string) {
    return this.khachHangService.xoa(maKH);
  }

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
