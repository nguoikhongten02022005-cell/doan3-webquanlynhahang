import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TaoDatBanDto } from './tao-dat-ban.dto';

describe('TaoDatBanDto', () => {
  it('accepts internal note sent by the booking confirmation flow', async () => {
    const dto = plainToInstance(TaoDatBanDto, {
      maKH: 'KH001',
      ngayDat: '2026-05-21',
      gioDat: '21:00',
      soNguoi: 9,
      ghiChuNoiBo: 'Nhóm từ 5 người trở lên',
    });

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors.map((error) => error.property)).not.toContain('ghiChuNoiBo');
  });
});
