import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

const VAI_TRO_CHO_PHEP = {
  Admin: 'Admin',
  NhanVien: 'NhanVien',
  QuanLy: 'QuanLy',
} as const;

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
    enum: VAI_TRO_CHO_PHEP,
  })
  @IsOptional()
  @IsEnum(VAI_TRO_CHO_PHEP)
  vaiTro?: string;
}
