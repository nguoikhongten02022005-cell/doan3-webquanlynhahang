import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CapNhatTrangThaiDatBanDto {
  @ApiProperty()
  @IsString()
  trangThai!: string;
}
