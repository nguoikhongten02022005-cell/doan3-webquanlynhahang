import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TaoMonDto } from './tao-mon.dto';

describe('TaoMonDto', () => {
  it('accepts Vietnamese category names from the frontend form', async () => {
    const dto = plainToInstance(TaoMonDto, {
      maDanhMuc: 'Món Chính',
      tenMon: 'Cơm gà',
      gia: 45000,
    });

    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).not.toContain('maDanhMuc');
  });
});
