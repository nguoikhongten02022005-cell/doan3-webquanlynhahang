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
  // loaiDon always TAI_BAN - removed TAI_QUAN option

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maDonHang?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maKH?: string;

  @ApiProperty({ example: 'BAN001' })
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
  diaChiGiao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gioLayHang?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gioGiao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  phiShip?: number;

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

  @ApiProperty({ type: [ChiTietMonDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChiTietMonDto)
  monAn!: ChiTietMonDto[];

  @ApiProperty({ type: [ChiTietMonDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChiTietMonDto)
  chiTiet?: ChiTietMonDto[];
}
