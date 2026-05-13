import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsInt,
  IsOptional,
  Matches,
  Min,
  Max,
} from 'class-validator';

@ValidatorConstraint({ name: 'tuNgayDenNgay', async: false })
class TuNgayDenNgayConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const value = args.object as ThongKeQueryDto;

    if (!value.tuNgay || !value.denNgay) {
      return true;
    }

    return value.tuNgay <= value.denNgay;
  }

  defaultMessage() {
    return 'tuNgay phai nho hon hoac bang denNgay';
  }
}

function IsTuNgayKhongLonHonDenNgay(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsTuNgayKhongLonHonDenNgay',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: TuNgayDenNgayConstraint,
    });
  };
}

export class ThongKeQueryDto {
  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({ example: 2026, minimum: 2000, maximum: 2100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  nam?: number;

  @ApiPropertyOptional({ example: '2026-05-13' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  tuNgay?: string;

  @ApiPropertyOptional({ example: '2026-05-13' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsTuNgayKhongLonHonDenNgay()
  denNgay?: string;
}
