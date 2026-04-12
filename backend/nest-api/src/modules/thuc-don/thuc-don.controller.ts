import { Body, Controller, Delete, Get, Headers, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ThucDonService } from './thuc-don.service';

const taoTenTapTinAnhMon = (_req: unknown, tapTin: { originalname?: string }, callback: (error: Error | null, filename: string) => void) => {
  const phanMoRong = extname(tapTin.originalname || '').toLowerCase() || '.png';
  const tenTapTin = `mon-an-${Date.now()}-${Math.round(Math.random() * 1e9)}${phanMoRong}`;
  callback(null, tenTapTin);
};

const boLocTapTinAnh = (_req: unknown, tapTin: { mimetype?: string }, callback: (error: Error | null, acceptFile: boolean) => void) => {
  if (!tapTin.mimetype?.startsWith('image/')) {
    callback(new Error('Chi ho tro upload tep hinh anh.'), false);
    return;
  }

  callback(null, true);
};

@Controller('api/thuc-don')
export class ThucDonController {
  constructor(private readonly thucDonService: ThucDonService) {}

  @Get()
  layThucDon() {
    return this.thucDonService.layThucDon();
  }

  @Post()
  taoMon(@Headers('authorization') authorization: string | undefined, @Body() body: Record<string, unknown>) {
    return this.thucDonService.taoMon(authorization, body);
  }

  @Put(':maMon')
  capNhatMon(@Headers('authorization') authorization: string | undefined, @Param('maMon') maMon: string, @Body() body: Record<string, unknown>) {
    return this.thucDonService.capNhatMon(authorization, maMon, body);
  }

  @Delete(':maMon')
  xoaMon(@Headers('authorization') authorization: string | undefined, @Param('maMon') maMon: string) {
    return this.thucDonService.xoaMon(authorization, maMon);
  }

  @Post('/upload/anh')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'uploads/mon-an',
      filename: taoTenTapTinAnhMon,
    }),
    fileFilter: boLocTapTinAnh,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }))
  uploadAnhMon(@Headers('authorization') authorization: string | undefined, @UploadedFile() tapTin?: { filename?: string }) {
    this.thucDonService.yeuCauQuyenQuanTri(authorization);

    return this.thucDonService.taoPhanHoi({
      url: tapTin?.filename ? `/uploads/mon-an/${tapTin.filename}` : '',
      tenTep: tapTin?.filename || '',
    }, 'Upload anh mon thanh cong');
  }
}
