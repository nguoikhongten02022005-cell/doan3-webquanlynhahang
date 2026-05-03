import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { BootstrapService } from './config/bootstrap.service';

function docBienMoiTruongBatBuoc(tenBien: string) {
  const giaTri = process.env[tenBien]?.trim();

  if (!giaTri) {
    throw new Error(`Thiếu biến môi trường bắt buộc: ${tenBien}`);
  }

  return giaTri;
}

function docBienMoiTruongTuyChon(tenBien: string) {
  return process.env[tenBien]?.trim() || '';
}

function tachDanhSachOrigin(giaTri: string) {
  return giaTri
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

function layOriginMacDinhTheoMoiTruong(moiTruong: string) {
  if (moiTruong === 'development') {
    return [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5175',
      'http://127.0.0.1:5175',
    ];
  }

  return [];
}

function taoDanhSachOriginDuocPhep(moiTruong: string) {
  const originMacDinh = layOriginMacDinhTheoMoiTruong(moiTruong);
  const originOverride = tachDanhSachOrigin(
    docBienMoiTruongTuyChon('FRONTEND_ORIGIN'),
  );

  return Array.from(new Set([...originMacDinh, ...originOverride]));
}

async function bootstrap() {
  const moiTruong = process.env.NODE_ENV?.trim() || 'development';
  const congBackend = Number(docBienMoiTruongBatBuoc('PORT'));
  const danhSachOriginDuocPhep = taoDanhSachOriginDuocPhep(moiTruong);

  if (!Number.isInteger(congBackend) || congBackend <= 0) {
    throw new Error('Biến môi trường PORT không hợp lệ.');
  }

  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || danhSachOriginDuocPhep.includes(origin)) {
        callback(null, true);
        return;
      }

      console.log(`Origin bị từ chối: ${origin}`);
      callback(new Error(`Origin không được phép: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix('');

  const cauHinhSwagger = new DocumentBuilder()
    .setTitle('API Quan Ly Nha Hang')
    .setDescription('Tai lieu API cho he thong quan ly nha hang')
    .setVersion('1.0.0')
    .build();

  const taiLieuSwagger = SwaggerModule.createDocument(app, cauHinhSwagger);
  SwaggerModule.setup('swagger', app, taiLieuSwagger, {
    customSiteTitle: 'API Quan Ly Nha Hang - Swagger',
    customJsStr: `
      document.documentElement.lang = 'vi';
      document.documentElement.setAttribute('translate', 'no');
      document.documentElement.classList.add('notranslate');
      document.body?.setAttribute('translate', 'no');
      document.body?.classList.add('notranslate');
    `,
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });

  await app.get(BootstrapService).khoiTaoNeuCan();
  await app.listen(congBackend);

  console.log(`Backend đang chạy ở môi trường: ${moiTruong}`);
  console.log('Danh sách origin CORS:', danhSachOriginDuocPhep);
  console.log(`Swagger UI: http://localhost:${congBackend}/swagger`);
}

bootstrap();
