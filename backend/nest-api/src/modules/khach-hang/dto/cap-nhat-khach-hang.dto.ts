import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CapNhatKhachHangDto {
  @IsOptional()
  @IsString()
  tenKH?: string;

  @IsOptional()
  @IsString()
  sdt?: string;

  @IsOptional()
  @IsString()
  diaChi?: string;
}
