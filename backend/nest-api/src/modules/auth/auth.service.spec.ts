import { UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { AuthService } from './auth.service';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  const taoService = (nguoiDung: Record<string, unknown>) => {
    const mysql = {
      truyVan: jest.fn((query: string) => {
        if (query.includes('FROM NguoiDung'))
          return Promise.resolve([nguoiDung]);
        if (query.includes('FROM KhachHang')) return Promise.resolve([]);
        return Promise.resolve([]);
      }),
    };

    const service = new AuthService(
      mysql as any,
      { sign: jest.fn(() => 'access-token') } as any,
      { get: jest.fn(() => 'refresh-secret') } as any,
    );

    return { service, mysql };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (compare as jest.Mock).mockResolvedValue(true);
  });

  it('rejects internal accounts on customer login', async () => {
    const { service } = taoService({
      MaND: 'ND001',
      Email: 'admin@nhahang.com',
      MatKhau: 'hashed',
      VaiTro: 'Admin',
      TenND: 'Admin System',
      TrangThai: 'Active',
    });

    await expect(
      service.dangNhap('admin@nhahang.com', 'Admin@123'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
