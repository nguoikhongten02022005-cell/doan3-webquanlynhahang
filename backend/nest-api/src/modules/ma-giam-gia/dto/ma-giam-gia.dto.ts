import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export enum TrangThaiMaGiamGiaDto {
  Active = 'Active',
  Inactive = 'Inactive',
  HetHan = 'HetHan',
}

export enum LoaiGiamGiaDto {
  percentage = 'percentage',
  fixed_amount = 'fixed_amount',
  phantram = 'phantram',
}

export enum LoaiMaGiamGiaDto {
  PUBLIC = 'PUBLIC',
  CUSTOMER = 'CUSTOMER',
  LOYALTY = 'LOYALTY',
  VIP = 'VIP',
  BIRTHDAY = 'BIRTHDAY',
}

export enum PhamViMaGiamGiaDto {
  DAT_BAN = 'DAT_BAN',
  DON_HANG = 'DON_HANG',
  CA_HAI = 'CA_HAI',
}

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const toNumber = ({ value }: { value: unknown }) =>
  value === undefined || value === null || value === ''
    ? undefined
    : Number(value);

export class KiemTraMaGiamGiaDto {
  @IsString()
  @Length(3, 50)
  @Transform(trim)
  maCode: string;

  @IsEnum(PhamViMaGiamGiaDto)
  @Transform(trim)
  phamVi: PhamViMaGiamGiaDto;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(trim)
  maKH?: string;

  @Transform(toNumber)
  @IsNumber()
  @Min(0)
  tongTien: number;
}

export class TaoMaGiamGiaDto {
  @IsString()
  @Length(3, 50)
  @Transform(trim)
  maCode: string;

  @IsString()
  @Length(1, 100)
  @Transform(trim)
  tenCode: string;

  @Transform(toNumber)
  @IsNumber()
  @Min(0)
  giaTri: number;

  @IsEnum(LoaiGiamGiaDto)
  @Transform(trim)
  loaiGiam: LoaiGiamGiaDto;

  @IsOptional()
  @IsEnum(LoaiMaGiamGiaDto)
  @Transform(trim)
  loaiMa?: LoaiMaGiamGiaDto;

  @IsOptional()
  @IsEnum(PhamViMaGiamGiaDto)
  @Transform(trim)
  phamVi?: PhamViMaGiamGiaDto;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(trim)
  maKH?: string;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  @Min(0)
  @Max(999999999)
  giaTriToiDa?: number;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  @Min(0)
  @Max(999999999)
  donHangToiThieu?: number;

  @IsOptional()
  @IsDateString()
  ngayBatDau?: string;

  @IsOptional()
  @IsDateString()
  ngayKetThuc?: string;

  @IsOptional()
  @Transform(toNumber)
  @IsInt()
  @Min(1)
  @Max(1000000)
  soLanToiDa?: number;

  @IsOptional()
  @Transform(toNumber)
  @IsInt()
  @Min(0)
  @Max(1000000)
  diemDaDoi?: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(trim)
  nguonTao?: string;

  @IsOptional()
  @IsEnum(TrangThaiMaGiamGiaDto)
  @Transform(trim)
  trangThai?: TrangThaiMaGiamGiaDto;
}

export class CapNhatMaGiamGiaDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Transform(trim)
  tenCode?: string;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  @Min(0)
  giaTri?: number;

  @IsOptional()
  @IsEnum(LoaiGiamGiaDto)
  @Transform(trim)
  loaiGiam?: LoaiGiamGiaDto;

  @IsOptional()
  @IsEnum(LoaiMaGiamGiaDto)
  @Transform(trim)
  loaiMa?: LoaiMaGiamGiaDto;

  @IsOptional()
  @IsEnum(PhamViMaGiamGiaDto)
  @Transform(trim)
  phamVi?: PhamViMaGiamGiaDto;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(trim)
  maKH?: string;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  @Min(0)
  @Max(999999999)
  giaTriToiDa?: number;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  @Min(0)
  @Max(999999999)
  donHangToiThieu?: number;

  @IsOptional()
  @IsDateString()
  ngayBatDau?: string;

  @IsOptional()
  @IsDateString()
  ngayKetThuc?: string;

  @IsOptional()
  @Transform(toNumber)
  @IsInt()
  @Min(1)
  @Max(1000000)
  soLanToiDa?: number;

  @IsOptional()
  @Transform(toNumber)
  @IsInt()
  @Min(0)
  @Max(1000000)
  diemDaDoi?: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(trim)
  nguonTao?: string;

  @IsOptional()
  @IsEnum(TrangThaiMaGiamGiaDto)
  @Transform(trim)
  trangThai?: TrangThaiMaGiamGiaDto;
}
