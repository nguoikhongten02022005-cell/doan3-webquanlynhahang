import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CapNhatDatBanDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maKH?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maBan?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maNV?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenKhachDatBan?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sdtDatBan?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emailDatBan?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  ngayDat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gioDat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gioKetThuc?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  soNguoi?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ghiChu?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  khuVucUuTien?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ghiChuNoiBo?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trangThai?: string;
}
