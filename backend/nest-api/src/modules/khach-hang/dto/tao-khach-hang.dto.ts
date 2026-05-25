import { IsOptional, IsString, IsNumber, Min, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class TaoKhachHangDto {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  tenKH: string;

  @IsOptional()
  @IsString()
  @Matches(/^0[0-9]{9}$/)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  sdt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  diaChi?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) =>
    value === undefined || value === null || value === ''
      ? undefined
      : Number(value),
  )
  diemTichLuy?: number;
}
