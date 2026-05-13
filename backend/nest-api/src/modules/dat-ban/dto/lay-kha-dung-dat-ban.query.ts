import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class LayKhaDungDatBanQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ngayDat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gioDat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  soNguoi?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  khuVuc?: string;
}
