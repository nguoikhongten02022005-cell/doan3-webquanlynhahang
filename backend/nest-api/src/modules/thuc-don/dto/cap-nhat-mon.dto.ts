import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CapNhatMonDto {
  @IsOptional()
  @IsString()
  maDanhMuc?: string;

  @IsOptional()
  @IsString()
  tenMon?: string;

  @IsOptional()
  @IsString()
  moTa?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gia?: number;

  @IsOptional()
  @IsString()
  hinhAnh?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  thoiGianChuanBi?: number;

  @IsOptional()
  @IsString()
  trangThai?: string;
}
