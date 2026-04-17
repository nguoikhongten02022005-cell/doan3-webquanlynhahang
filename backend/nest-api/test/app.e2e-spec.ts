import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MySqlService } from './../src/database/mysql/mysql.service';

describe('App (e2e)', () => {
  let app: INestApplication;
  let accessToken = '';

  const monAnMau = [
    {
      MaMon: 'MON01',
      MaDanhMuc: 'DM01',
      TenMon: 'Com chien hai san',
      MoTa: 'Com chien voi tom muc',
      Gia: 100000,
      HinhAnh: '/uploads/mon-an/com-chien.png',
      ThoiGianChuanBi: 15,
      TrangThai: 'Available',
    },
  ];

  const donHangMau = {
    MaDonHang: 'DH001',
    MaKH: 'KH001',
    MaBan: 'B01',
    MaNV: 'NV001',
    MaDatBan: null,
    TongTien: 210000,
    TrangThai: 'Pending',
    GhiChu: 'Khong hanh',
    NgayTao: '2026-04-01T10:00:00.000Z',
    LoaiDon: 'TAI_BAN',
    DiaChiGiao: '',
    PhiShip: 0,
    TenKH: 'Nguyen Van A',
    SDT: '0900000000',
    Email: 'khach@example.com',
    DiaChi: '1 Tran Hung Dao',
  };

  const chiTietDonHangMau = [
    {
      MaChiTiet: 'CT001',
      MaMon: 'MON01',
      TenMon: 'Com chien hai san',
      SoLuong: 2,
      DonGia: 100000,
      ThanhTien: 200000,
      GhiChu: '',
      TrangThai: 'Pending',
    },
  ];

  beforeAll(async () => {
    process.env.PORT = '5011';
    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_PORT = '3306';
    process.env.DB_USER = 'root';
    process.env.DB_PASSWORD = 'test';
    process.env.DB_NAME = 'QuanNhaHang';
    process.env.DB_AUTO_INIT = 'false';
    process.env.JWT_SECRET = '12345678901234567890123456789012';
    process.env.JWT_ISSUER = 'nest-api-quan-ly-nha-hang';
    process.env.JWT_AUDIENCE = 'quan-ly-nha-hang-frontend';
    process.env.JWT_EXPIRES_IN = '12h';

    const nguoiDungNoiBo = {
      MaND: 'ND_ADMIN',
      TenND: 'Quan tri vien',
      Email: 'admin@nhahang.com',
      MatKhau: await hash('Admin@123', 10),
      VaiTro: 'Admin',
      TrangThai: 'Active',
    };

    const mysqlMock = {
      truyVan: jest.fn(async (sql: string, thamSo: unknown[] = []) => {
        const cauLenh = sql.replace(/\s+/g, ' ').trim();

        if (cauLenh.includes('FROM ThucDon WHERE TrangThai <>')) {
          return monAnMau;
        }

        if (cauLenh.includes('FROM NguoiDung WHERE Email = ? LIMIT 1')) {
          return thamSo[0] === 'admin@nhahang.com' ? [nguoiDungNoiBo] : [];
        }

        if (cauLenh.includes('FROM NguoiDung WHERE MaND = ? LIMIT 1')) {
          return thamSo[0] === nguoiDungNoiBo.MaND ? [nguoiDungNoiBo] : [];
        }

        if (cauLenh.includes('FROM KhachHang WHERE MaND = ? LIMIT 1')) {
          return [];
        }

        if (cauLenh.includes('SELECT MaKH FROM DonHang WHERE MaDonHang = ? LIMIT 1')) {
          return [{ MaKH: donHangMau.MaKH }];
        }

        if (cauLenh.includes('FROM DonHang dh') && cauLenh.includes('LEFT JOIN KhachHang kh')) {
          return [donHangMau];
        }

        if (cauLenh.includes('FROM ChiTietDonHang ct') && cauLenh.includes('LEFT JOIN ThucDon td')) {
          return chiTietDonHangMau;
        }

        if (cauLenh.includes('SELECT * FROM DonHang WHERE MaDonHang = ? LIMIT 1')) {
          return [donHangMau];
        }

        return [];
      }),
      thucThi: jest.fn(async (sql: string, thamSo: unknown[] = []) => {
        const cauLenh = sql.replace(/\s+/g, ' ').trim();

        if (cauLenh.includes('UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?')) {
          donHangMau.TrangThai = String(thamSo[0] || donHangMau.TrangThai);
          chiTietDonHangMau.forEach((chiTiet) => {
            chiTiet.TrangThai = donHangMau.TrangThai;
          });
        }

        return { affectedRows: 1 };
      }),
      giaoDich: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MySqlService)
      .useValue(mysqlMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/thuc-don tra ve endpoint cong khai dang song', async () => {
    const phanHoi = await request(app.getHttpServer())
      .get('/api/thuc-don')
      .expect(200);

    expect(phanHoi.body).toMatchObject({
      success: true,
      message: 'Lay thuc don thanh cong',
    });
    expect(phanHoi.body.data).toEqual([
      expect.objectContaining({
        maMon: 'MON01',
        tenMon: 'Com chien hai san',
        gia: 100000,
        trangThai: 'Available',
      }),
    ]);
  });

  it('POST /api/auth/internal-login dang nhap noi bo va tra access token', async () => {
    const phanHoi = await request(app.getHttpServer())
      .post('/api/auth/internal-login')
      .send({
        email: 'admin@nhahang.com',
        matKhau: 'Admin@123',
      })
      .expect(201);

    expect(phanHoi.body.success).toBe(true);
    expect(phanHoi.body.data.user).toMatchObject({
      maND: 'ND_ADMIN',
      email: 'admin@nhahang.com',
      vaiTro: 'Admin',
    });
    expect(typeof phanHoi.body.data.accessToken).toBe('string');
    accessToken = phanHoi.body.data.accessToken;
  });

  it('GET /api/auth/me lay dung thong tin tu token da dang nhap', async () => {
    const phanHoi = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(phanHoi.body).toMatchObject({
      success: true,
      message: 'Lay thong tin thanh cong',
      data: expect.objectContaining({
        maND: 'ND_ADMIN',
        email: 'admin@nhahang.com',
        vaiTro: 'Admin',
      }),
    });
  });

  it('PATCH /api/don-hang/:maDonHang/status cap nhat trang thai don hang qua route that', async () => {
    const phanHoi = await request(app.getHttpServer())
      .patch('/api/don-hang/DH001/status')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ trangThai: 'Ready' })
      .expect(200);

    expect(phanHoi.body).toMatchObject({
      success: true,
      message: 'Lay chi tiet don hang thanh cong',
      data: {
        donHang: expect.objectContaining({
          maDonHang: 'DH001',
          trangThai: 'Ready',
        }),
        chiTiet: [
          expect.objectContaining({
            MaChiTiet: 'CT001',
            TrangThai: 'Ready',
          }),
        ],
      },
    });
  });
});
