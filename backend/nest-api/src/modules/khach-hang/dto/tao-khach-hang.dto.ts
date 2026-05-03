import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class TaoKhachHangDto {
  @IsString()
  tenKH: string;

  @IsOptional()
  @IsString()
  sdt?: string;

  @IsOptional()
  @IsString()
  diaChi?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  diemTichLuy?: number;
}
