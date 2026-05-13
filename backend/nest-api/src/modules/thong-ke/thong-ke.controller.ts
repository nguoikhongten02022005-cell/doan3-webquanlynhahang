import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThongKeService } from './thong-ke.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ThongKeQueryDto } from './dto/thong-ke.query.dto';

@ApiTags('thong-ke')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin', 'QuanLy')
@Controller('api/thong-ke')
export class ThongKeController {
  constructor(private readonly thongKeService: ThongKeService) {}

  @ApiOperation({ summary: 'Lấy doanh thu theo ngày' })
  @Get('doanh-thu')
  layDoanhThuNgay(@Query() query: ThongKeQueryDto) {
    return this.thongKeService.layDoanhThuNgay(query.tuNgay!, query.denNgay!);
  }

  @ApiOperation({ summary: 'Lấy danh sách món bán chạy' })
  @Get('mon-ban-chay')
  layMonBanChay(@Query() query: ThongKeQueryDto) {
    return this.thongKeService.layMonBanChay(
      query.limit ?? 10,
      query.tuNgay,
      query.denNgay,
    );
  }

  @ApiOperation({ summary: 'Lấy tình trạng bàn' })
  @Get('tinh-trang-ban')
  layTinhTrangBan() {
    return this.thongKeService.layTinhTrangBan();
  }

  @ApiOperation({ summary: 'Lấy số lượng booking trong kỳ' })
  @Get('booking-count')
  layBookingCount(@Query() query: ThongKeQueryDto) {
    return this.thongKeService.layBookingCount(query.tuNgay!, query.denNgay!);
  }

  @ApiOperation({ summary: 'Lấy tổng quan (doanh thu, đơn, bàn, chờ)' })
  @Get('tong-quan')
  layTongQuan() {
    return this.thongKeService.layTongQuan();
  }

  @ApiOperation({ summary: 'Lấy doanh thu theo tháng' })
  @Get('doanh-thu-thang')
  layDoanhThuTheoThang(@Query() query: ThongKeQueryDto) {
    return this.thongKeService.layDoanhThuTheoThang(
      query.nam ?? new Date().getFullYear(),
    );
  }
}
