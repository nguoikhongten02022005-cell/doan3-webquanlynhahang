import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiService } from './api.service';

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

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('auth/register')
  dangKy(@Body() body: Record<string, unknown>) {
    return this.apiService.dangKy(body);
  }

  @Post('auth/login')
  dangNhap(@Body() body: Record<string, unknown>) {
    return this.apiService.dangNhap(String(body.email || ''), String(body.matKhau || ''));
  }

  @Post('auth/internal-login')
  dangNhapNoiBo(@Body() body: Record<string, unknown>) {
    return this.apiService.dangNhap(String(body.email || ''), String(body.matKhau || ''), true);
  }

  @Post('auth/logout')
  dangXuat() {
    return this.apiService.taoPhanHoi(null, 'Dang xuat thanh cong');
  }

  @Get('auth/me')
  layThongTinToi(@Headers('authorization') authorization?: string) {
    return this.apiService.layThongTinToi(authorization);
  }

  @Put('auth/profile')
  capNhatHoSo(@Headers('authorization') authorization: string | undefined, @Body() body: Record<string, unknown>) {
    return this.apiService.capNhatHoSo(authorization, body);
  }

  @Put('auth/doi-mat-khau')
  doiMatKhau(@Headers('authorization') authorization: string | undefined, @Body() body: Record<string, unknown>) {
    return this.apiService.doiMatKhau(authorization, body);
  }

  @Get('nguoi-dung')
  layDanhSachNguoiDung() {
    return this.apiService.layDanhSachNguoiDung();
  }

  @Get('thuc-don')
  layThucDon() {
    return this.apiService.layThucDon();
  }

  @Post('upload/mon-an')
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
  uploadAnhMon(@UploadedFile() tapTin?: { filename?: string }) {
    return this.apiService.taoPhanHoi({
      url: tapTin?.filename ? `/uploads/mon-an/${tapTin.filename}` : '',
      tenTep: tapTin?.filename || '',
    }, 'Upload anh mon thanh cong');
  }

  @Post('thuc-don')
  taoMon(@Body() body: Record<string, unknown>) {
    return this.apiService.taoMon(body);
  }

  @Put('thuc-don/:maMon')
  capNhatMon(@Param('maMon') maMon: string, @Body() body: Record<string, unknown>) {
    return this.apiService.capNhatMon(maMon, body);
  }

  @Delete('thuc-don/:maMon')
  xoaMon(@Param('maMon') maMon: string) {
    return this.apiService.xoaMon(maMon);
  }

  @Get('ban')
  layDanhSachBan() {
    return this.apiService.layDanhSachBan();
  }

  @Post('ban')
  taoBan(@Body() body: Record<string, unknown>) {
    return this.apiService.taoBan(body);
  }

  @Put('ban/:maBan')
  capNhatBan(@Param('maBan') maBan: string, @Body() body: Record<string, unknown>) {
    return this.apiService.capNhatBan(maBan, body);
  }

  @Delete('ban/:maBan')
  xoaBan(@Param('maBan') maBan: string) {
    return this.apiService.xoaBan(maBan);
  }

  @Patch('ban/:maBan/status')
  capNhatTrangThaiBan(@Param('maBan') maBan: string, @Body() body: Record<string, unknown>) {
    return this.apiService.capNhatTrangThaiBan(maBan, String(body.trangThai || ''));
  }

  @Get('ban/:maBan/qr')
  layQrBan(@Param('maBan') maBan: string) {
    return this.apiService.layQrBan(maBan);
  }

  @Get('ban/:maBan/thuc-don')
  layThucDonTheoBan(@Param('maBan') maBan: string) {
    return this.apiService.layThucDonTheoBan(maBan);
  }

  @Post('ban/:maBan/order')
  taoOrderTaiBan(@Param('maBan') maBan: string, @Body() body: Record<string, unknown>) {
    return this.apiService.taoOrderTaiBan(maBan, body);
  }

  @Get('ban/:maBan/order')
  layOrderDangMoTaiBan(@Param('maBan') maBan: string) {
    return this.apiService.layOrderDangMoTaiBan(maBan);
  }

  @Post('ban/:maBan/yeu-cau-thanh-toan')
  yeuCauThanhToanTaiBan(@Param('maBan') maBan: string) {
    return this.apiService.yeuCauThanhToanTaiBan(maBan);
  }

  @Post('ban/:maBan/xac-nhan-thanh-toan')
  xacNhanThanhToanTaiBan(@Param('maBan') maBan: string) {
    return this.apiService.xacNhanThanhToanTaiBan(maBan);
  }

  @Get('dat-ban')
  layDanhSachDatBan() {
    return this.apiService.layDanhSachDatBan();
  }

  @Get('dat-ban/khach/:maKh')
  layLichSuDatBan(@Param('maKh') maKh: string) {
    return this.apiService.layLichSuDatBan(maKh);
  }

  @Post('dat-ban')
  taoDatBan(@Body() body: Record<string, unknown>) {
    return this.apiService.taoDatBan(body);
  }

  @Get('dat-ban/availability')
  layKhaDungDatBan(@Query() query: Record<string, unknown>) {
    return this.apiService.layKhaDungDatBan(query);
  }

  @Patch('dat-ban/:maDatBan')
  capNhatDatBan(@Param('maDatBan') maDatBan: string, @Body() body: Record<string, unknown>) {
    return this.apiService.capNhatDatBan(maDatBan, body);
  }

  @Patch('dat-ban/:maDatBan/status')
  capNhatTrangThaiDatBan(@Param('maDatBan') maDatBan: string, @Body() body: Record<string, unknown>) {
    return this.apiService.capNhatTrangThaiDatBan(maDatBan, String(body.trangThai || ''));
  }

  @Patch('dat-ban/:maDatBan/assign-tables')
  ganBanChoDatBan(@Param('maDatBan') maDatBan: string, @Body() body: Record<string, unknown>) {
    return this.apiService.ganBanChoDatBan(maDatBan, body);
  }

  @Get('don-hang')
  layDanhSachDonHang() {
    return this.apiService.layDanhSachDonHang();
  }

  @Get('don-hang/me')
  layDonHangCuaToi(@Headers('authorization') authorization?: string) {
    return this.apiService.layDonHangCuaToi(authorization);
  }

  @Get('don-hang/co-the-danh-gia')
  layDonHangCoTheDanhGia(@Headers('authorization') authorization?: string) {
    return this.apiService.layDonHangCoTheDanhGia(authorization);
  }

  @Get('don-hang/:maDonHang')
  layChiTietDonHang(@Param('maDonHang') maDonHang: string) {
    return this.apiService.layChiTietDonHang(maDonHang);
  }

  @Post('don-hang')
  taoDonHang(@Body() body: Record<string, unknown>) {
    return this.apiService.taoDonHang(body);
  }

  @Patch('don-hang/:maDonHang/status')
  capNhatTrangThaiDonHang(@Param('maDonHang') maDonHang: string, @Body() body: Record<string, unknown>) {
    return this.apiService.capNhatTrangThaiDonHang(maDonHang, String(body.trangThai || ''));
  }

  @Post('ma-giam-gia/validate')
  kiemTraMaGiamGia(@Body() body: Record<string, unknown>) {
    return this.apiService.kiemTraMaGiamGia(body);
  }

  @Get('danh-gia')
  layDanhSachDanhGia() {
    return this.apiService.layDanhSachDanhGia();
  }

  @Post('danh-gia')
  taoDanhGia(@Body() body: Record<string, unknown>) {
    return this.apiService.taoDanhGia(body);
  }

  @Patch('danh-gia/:maDanhGia/duyet')
  duyetDanhGia(@Param('maDanhGia') maDanhGia: string, @Body() body: Record<string, unknown>) {
    return this.apiService.duyetDanhGia(maDanhGia, body);
  }

  @Post('mang-ve/don-hang')
  taoDonMangVe(@Body() body: Record<string, unknown>) {
    return this.apiService.taoDonMangVe(body);
  }

  @Get('mang-ve/don-hang/:maDonHang')
  layDonMangVe(@Param('maDonHang') maDonHang: string) {
    return this.apiService.layDonMangVe(maDonHang);
  }

  @Get('mang-ve/admin/don-hang')
  layDonMangVeChoAdmin() {
    return this.apiService.layDonMangVeChoAdmin();
  }

  @Patch('mang-ve/admin/don-hang/:maDonHang/trang-thai')
  capNhatTrangThaiDonMangVe(@Param('maDonHang') maDonHang: string, @Body() body: Record<string, unknown>) {
    return this.apiService.capNhatTrangThaiDonHang(maDonHang, String(body.trangThai || ''));
  }

  @Get('mang-ve/lich-su')
  layLichSuDonMangVe(@Headers('authorization') authorization?: string) {
    return this.apiService.layLichSuDonMangVe(authorization);
  }

  @Patch('mang-ve/don-hang/:maDonHang/huy')
  huyDonMangVe(@Param('maDonHang') maDonHang: string) {
    return this.apiService.huyDonMangVe(maDonHang);
  }

  @Get('loyalty/me')
  layTongQuanDiemTichLuy(@Headers('authorization') authorization?: string) {
    return this.apiService.layTongQuanDiemTichLuy(authorization);
  }

  @Get('loyalty/me/history')
  layLichSuDiemTichLuy(@Headers('authorization') authorization?: string) {
    return this.apiService.layLichSuDiemTichLuy(authorization);
  }
}
