import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class GanBanChoDatBanDto {
  @ApiProperty({ type: [String], description: 'Danh sach ma ban' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  danhSachMaBan!: string[];
}
