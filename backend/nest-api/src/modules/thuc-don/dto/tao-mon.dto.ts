import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  MaxLength,
} from 'class-validator';

export class TaoMonDto {
  @ApiPropertyOptional({ example: 'MON001' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Matches(/^[A-Za-z0-9_-]+$/)
  maMon?: string;

  @ApiPropertyOptional({ example: 'KHAI_VI' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Matches(/^[A-Za-z0-9_-]+$/)
  maDanhMuc?: string;

  @ApiProperty({ example: 'Pho bo tai' })
  @IsString()
  @Length(1, 255)
  tenMon!: string;

  @ApiPropertyOptional({ example: 'Pho bo voi nuoc dung dam da' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  moTa?: string;

  @ApiProperty({ example: 65000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gia!: number;

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
