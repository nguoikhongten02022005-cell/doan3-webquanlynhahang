import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class TaoMonDto {
  @ApiPropertyOptional({ example: 'MON001' })
  @IsOptional()
  @IsString()
  maMon?: string;

  @ApiPropertyOptional({ example: 'KHAI_VI' })
  @IsOptional()
  @IsString()
  maDanhMuc?: string;

  @ApiProperty({ example: 'Pho bo tai' })
  @IsString()
  tenMon!: string;

  @ApiPropertyOptional({ example: 'Pho bo voi nuoc dung dam da' })
  @IsOptional()
  @IsString()
  moTa?: string;

  @ApiProperty({ example: 65000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gia!: number;

  @ApiPropertyOptional({ example: '/uploads/mon-an/mon-an-123.png' })
  @IsOptional()
  @IsString()
  hinhAnh?: string;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  thoiGianChuanBi?: number;

  @ApiPropertyOptional({ example: 'Available' })
  @IsOptional()
  @IsString()
  trangThai?: string;
}
