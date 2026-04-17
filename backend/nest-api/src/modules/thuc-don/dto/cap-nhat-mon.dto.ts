import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CapNhatMonDto {
  @ApiPropertyOptional({ example: 'KHAI_VI' })
  @IsOptional()
  @IsString()
  maDanhMuc?: string;

  @ApiPropertyOptional({ example: 'Pho bo tai' })
  @IsOptional()
  @IsString()
  tenMon?: string;

  @ApiPropertyOptional({ example: 'Pho bo voi nuoc dung dam da' })
  @IsOptional()
  @IsString()
  moTa?: string;

  @ApiPropertyOptional({ example: 65000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gia?: number;

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
