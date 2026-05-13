import { IsOptional, IsString } from 'class-validator';

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
