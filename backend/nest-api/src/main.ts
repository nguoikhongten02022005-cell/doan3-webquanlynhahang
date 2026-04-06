import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BootstrapService } from './bootstrap.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').split(','),
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: false }));
  app.setGlobalPrefix('');
  await app.get(BootstrapService).khoiTaoNeuCan();
  await app.listen(Number(process.env.PORT || 5011));
}
bootstrap();
