import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export enum LoaiDonHang {
  TAI_BAN = 'TAI_BAN',
}

export class ChiTietMonDto {
  @ApiProperty({ example: 'M001' })
  @IsString()
  maMon!: string;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  soLuong!: number;

  @ApiPropertyOptional({ example: 'Ít đường' })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}

export class TaoDonHangDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maDonHang?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maKH?: string;

  @ApiProperty({ example: 'B001' })
  @IsString()
  maBan!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maNV?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maDatBan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nguonTao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trangThai?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  soDiem?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maGiamGia?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ghiChu?: string;

  @ApiPropertyOptional({ type: [ChiTietMonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChiTietMonDto)
  monAn?: ChiTietMonDto[];

  @ApiProperty({ type: [ChiTietMonDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChiTietMonDto)
  chiTiet?: ChiTietMonDto[];
}
