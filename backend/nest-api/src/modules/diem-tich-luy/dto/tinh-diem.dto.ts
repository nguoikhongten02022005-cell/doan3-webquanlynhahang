import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class TinhDiemDto {
  @IsString()
  maDonHang: string;

  @IsNumber()
  @Min(0)
  tongTien: number;

  @IsOptional()
  @IsString()
  moTa?: string;
}