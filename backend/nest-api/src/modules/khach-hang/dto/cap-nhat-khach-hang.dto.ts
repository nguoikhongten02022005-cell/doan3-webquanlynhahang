import { IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CapNhatKhachHangDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  tenKH?: string;

  @IsOptional()
  @IsString()
  @Matches(/^0[0-9]{9}$/)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  sdt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  diaChi?: string;
}
