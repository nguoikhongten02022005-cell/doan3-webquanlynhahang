import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UseGuards,
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
import { taoPhanHoi } from '../../common/phan-hoi';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

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

  @Public()
  @ApiOperation({ summary: 'Lay danh sach mon an cong khai' })
  @Get()
  layThucDon() {
    return this.thucDonService.layThucDon();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Tao mon an moi (Admin)' })
  @Post()
  taoMon(@Body() body: TaoMonDto) {
    return this.thucDonService.taoMon(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Cap nhat mon an (Admin)' })
  @Put(':maMon')
  capNhatMon(
    @Param('maMon') maMon: string,
    @Body() body: CapNhatMonDto,
  ) {
    return this.thucDonService.capNhatMon(maMon, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Xoa mon an (Admin)' })
  @Delete(':maMon')
  xoaMon(@Param('maMon') maMon: string) {
    return this.thucDonService.xoaMon(maMon);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
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
    @UploadedFile() tapTin?: { filename?: string },
  ) {
    return taoPhanHoi(
      {
        url: tapTin?.filename ? `/uploads/mon-an/${tapTin.filename}` : '',
        tenTep: tapTin?.filename || '',
      },
      'Upload anh mon thanh cong',
    );
  }
}


