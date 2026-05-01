import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CoreModule } from './modules/core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThucDonModule } from './modules/thuc-don/thuc-don.module';
import { BanModule } from './modules/ban/ban.module';
import { DatBanModule } from './modules/dat-ban/dat-ban.module';
import { DonHangModule } from './modules/don-hang/don-hang.module';
import { DanhGiaModule } from './modules/danh-gia/danh-gia.module';
import { DiemTichLuyModule } from './modules/diem-tich-luy/diem-tich-luy.module';
import { MaGiamGiaModule } from './modules/ma-giam-gia/ma-giam-gia.module';
import { KhachHangModule } from './modules/khach-hang/khach-hang.module';

const moiTruong = process.env.NODE_ENV?.trim() || 'development';
const tapTinMoiTruong = `.env.${moiTruong}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [tapTinMoiTruong, '.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    CoreModule,
    AuthModule,
    ThucDonModule,
    BanModule,
    DatBanModule,
    DonHangModule,
    DanhGiaModule,
    MaGiamGiaModule,
    KhachHangModule,
    DiemTichLuyModule,
  ],
})
export class AppModule {}
