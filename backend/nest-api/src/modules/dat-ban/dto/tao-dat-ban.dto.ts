import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ChiTietMonAnDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maMon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenMon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  soLuong?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  gia?: number;
}

export class TaoDatBanDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maDatBan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maKH?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maBan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maNV?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenKhachDatBan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sdtDatBan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emailDatBan?: string;

  @ApiProperty()
  @IsDateString()
  ngayDat!: string;

  @ApiProperty()
  @IsString()
  gioDat!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gioKetThuc?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  soNguoi!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ghiChu?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  khuVucUuTien?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ghiChuNoiBo?: string;

  @ApiPropertyOptional({ type: [ChiTietMonAnDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChiTietMonAnDto)
  chiTietMonAn?: ChiTietMonAnDto[];
}
