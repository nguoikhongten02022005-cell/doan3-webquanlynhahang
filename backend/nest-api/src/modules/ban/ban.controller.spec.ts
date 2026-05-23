import 'reflect-metadata';
import {
  THROTTLER_LIMIT,
  THROTTLER_TTL,
} from '@nestjs/throttler/dist/throttler.constants';
import { BanController } from './ban.controller';

describe('BanController', () => {
  it('cho phép trang quản lý bàn polling danh sách bàn mà không chạm rate limit', () => {
    const limit = Reflect.getMetadata(
      `${THROTTLER_LIMIT}default`,
      BanController.prototype.layDanhSachBan,
    );
    const ttl = Reflect.getMetadata(
      `${THROTTLER_TTL}default`,
      BanController.prototype.layDanhSachBan,
    );

    expect(ttl).toBe(60000);
    expect(limit).toBeGreaterThanOrEqual(30);
  });
});
