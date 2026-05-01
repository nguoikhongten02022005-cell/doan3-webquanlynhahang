import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class DoiDiemDto {
  @IsNumber()
  @Min(1)
  soDiem: number;

  @IsOptional()
  @IsString()
  moTa?: string;
}