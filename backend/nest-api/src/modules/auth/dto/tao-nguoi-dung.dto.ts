import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class TaoNguoiDungDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SecurePass1' })
  @IsString()
  @MinLength(6)
  matKhau!: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString()
  @IsNotEmpty()
  hoTen!: string;

  @ApiPropertyOptional({
    example: 'NhanVien',
    enum: ['Admin', 'NhanVien', 'QuanLy'],
  })
  @IsOptional()
  @IsEnum(['Admin', 'NhanVien', 'QuanLy'])
  vaiTro?: string;
}
