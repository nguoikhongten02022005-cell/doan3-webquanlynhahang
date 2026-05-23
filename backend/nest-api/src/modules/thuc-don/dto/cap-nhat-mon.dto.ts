import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CapNhatMonDto {
  @ApiPropertyOptional({ example: 'KHAI_VI' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  maDanhMuc?: string;

  @ApiPropertyOptional({ example: 'Pho bo tai' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  tenMon?: string;

  @ApiPropertyOptional({ example: 'Pho bo voi nuoc dung dam da' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
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
  @MaxLength(255)
  @Matches(/^\/uploads\/mon-an\/[A-Za-z0-9_-]+\.(png|jpg|jpeg|webp)$/i)
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
  @IsIn(['Available', 'Unavailable', 'Deleted'])
  trangThai?: string;
}
