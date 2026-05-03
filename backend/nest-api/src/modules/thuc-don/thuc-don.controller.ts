import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CapNhatMonDto } from './dto/cap-nhat-mon.dto';
import { TaoMonDto } from './dto/tao-mon.dto';
import { ThucDonService } from './thuc-don.service';

const taoTenTapTinAnhMon = (
  _req: unknown,
  tapTin: { originalname?: string },
  callback: (error: Error | null, filename: string) => void,
) => {
  const phanMoRong = extname(tapTin.originalname || '').toLowerCase() || '.png';
  const tenTapTin = `mon-an-${Date.now()}-${Math.round(Math.random() * 1e9)}${phanMoRong}`;
  callback(null, tenTapTin);
};

const boLocTapTinAnh = (
  _req: unknown,
  tapTin: { mimetype?: string },
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!tapTin.mimetype?.startsWith('image/')) {
    callback(new Error('Chi ho tro upload tep hinh anh.'), false);
    return;
  }

  callback(null, true);
};

@ApiTags('thuc-don')
@Controller('api/thuc-don')
export class ThucDonController {
  constructor(private readonly thucDonService: ThucDonService) {}

  @ApiOperation({ summary: 'Lay danh sach mon an cong khai' })
  @Get()
  layThucDon() {
    return this.thucDonService.layThucDon();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Tao mon an moi (Admin)' })
  @Post()
  taoMon(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: TaoMonDto,
  ) {
    return this.thucDonService.taoMon(authorization, body);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cap nhat mon an (Admin)' })
  @Put(':maMon')
  capNhatMon(
    @Headers('authorization') authorization: string | undefined,
    @Param('maMon') maMon: string,
    @Body() body: CapNhatMonDto,
  ) {
    return this.thucDonService.capNhatMon(authorization, maMon, body);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Xoa mon an (Admin)' })
  @Delete(':maMon')
  xoaMon(
    @Headers('authorization') authorization: string | undefined,
    @Param('maMon') maMon: string,
  ) {
    return this.thucDonService.xoaMon(authorization, maMon);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Upload anh mon an (Admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @Post('/upload/anh')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/mon-an',
        filename: taoTenTapTinAnhMon,
      }),
      fileFilter: boLocTapTinAnh,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadAnhMon(
    @Headers('authorization') authorization: string | undefined,
    @UploadedFile() tapTin?: { filename?: string },
  ) {
    this.thucDonService.yeuCauQuyenQuanTri(authorization);

    return this.thucDonService.taoPhanHoi(
      {
        url: tapTin?.filename ? `/uploads/mon-an/${tapTin.filename}` : '',
        tenTep: tapTin?.filename || '',
      },
      'Upload anh mon thanh cong',
    );
  }
}
