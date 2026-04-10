import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { MySqlService } from './mysql.service';

type BanGhi = Record<string, any>;

@Injectable()
export class ApiService {
  constructor(private readonly mysql: MySqlService) {}

  private readonly TI_LE_TICH_DIEM_MAC_DINH = 10000;

  private readonly jwtSecret = this.docBienMoiTruongBatBuoc('JWT_SECRET');
  private readonly jwtIssuer = this.docBienMoiTruongBatBuoc('JWT_ISSUER');
  private readonly jwtAudience = this.docBienMoiTruongBatBuoc('JWT_AUDIENCE');
  private readonly jwtExpiresIn = this.docBienMoiTruongBatBuoc('JWT_EXPIRES_IN');
  private readonly urlFrontend = this.docBienMoiTruongTuyChon('FRONTEND_ORIGIN');

  private docBienMoiTruongBatBuoc(tenBien: string) {
    const giaTri = process.env[tenBien]?.trim();

    if (!giaTri) {
      throw new Error(`Thiếu biến môi trường bắt buộc: ${tenBien}`);
    }

    return giaTri;
  }

  private docBienMoiTruongTuyChon(tenBien: string) {
    return process.env[tenBien]?.trim() || '';
  }

  taoPhanHoi(duLieu: unknown, thongDiep = 'Thanh cong', meta: unknown = null) {
    return { success: true, data: duLieu, message: thongDiep, meta };
  }

  layTokenTuDauTrang(dauTrang?: string) {
    if (!dauTrang) {
      return '';
    }

    const [loai, ma] = dauTrang.split(' ');
    return loai?.toLowerCase() === 'bearer' ? ma || '' : '';
  }

  giaiMaNguoiDung(dauTrang?: string) {
    const token = this.layTokenTuDauTrang(dauTrang);
    if (!token) {
      throw new UnauthorizedException('Thieu token xac thuc.');
    }

    try {
      return verify(token, this.jwtSecret, {
        issuer: this.jwtIssuer,
        audience: this.jwtAudience,
      }) as BanGhi;
    } catch {
      throw new UnauthorizedException('Token khong hop le hoac da het han.');
    }
  }

  private taoJwt(nguoiDung: BanGhi) {
    return sign(
      {
        maND: nguoiDung.MaND,
        email: nguoiDung.Email,
        vaiTro: nguoiDung.VaiTro,
      },
      this.jwtSecret,
      {
        expiresIn: this.jwtExpiresIn,
        issuer: this.jwtIssuer,
        audience: this.jwtAudience,
      } as any,
    );
  }

  private chuanHoaVaiTroNoiBo(vaiTro: string) {
    if (vaiTro === 'Admin') return 'Admin';
    if (vaiTro === 'NhanVien') return 'NhanVien';
    return 'KhachHang';
  }

  private chuyenNguoiDungSangResponse(nguoiDung: BanGhi, khachHang?: BanGhi | null) {
    return {
      maND: nguoiDung.MaND,
      maKH: khachHang?.MaKH || '',
      tenND: khachHang?.TenKH || nguoiDung.TenND,
      email: nguoiDung.Email,
      sdt: khachHang?.SDT || '',
      vaiTro: nguoiDung.VaiTro,
      trangThai: nguoiDung.TrangThai,
      diaChi: khachHang?.DiaChi || '',
      diemTichLuy: Number(khachHang?.DiemTichLuy || 0),
    };
  }

  private tinhSoDiemTichLuy(tongTien: number) {
    const tongTienHopLe = Number(tongTien || 0);
    if (tongTienHopLe <= 0) {
      return 0;
    }

    return Math.floor(tongTienHopLe / this.TI_LE_TICH_DIEM_MAC_DINH);
  }

  private chuyenLichSuDiemSangResponse(giaoDich: BanGhi) {
    return {
      maGiaoDichDiem: giaoDich.MaGiaoDichDiem,
      maKH: giaoDich.MaKH,
      maDonHang: giaoDich.MaDonHang || '',
      loaiBienDong: giaoDich.LoaiBienDong,
      soDiem: Number(giaoDich.SoDiem || 0),
      soDiemTruoc: Number(giaoDich.SoDiemTruoc || 0),
      soDiemSau: Number(giaoDich.SoDiemSau || 0),
      moTa: giaoDich.MoTa || '',
      ngayTao: giaoDich.NgayTao,
    };
  }

  private async layNguoiDungTheoEmail(email: string) {
    const danhSach = await this.mysql.truyVan('SELECT * FROM NguoiDung WHERE Email = ? LIMIT 1', [email]);
    return danhSach[0] || null;
  }

  private async layKhachHangTheoMaNd(maND: string) {
    const danhSach = await this.mysql.truyVan('SELECT * FROM KhachHang WHERE MaND = ? LIMIT 1', [maND]);
    return danhSach[0] || null;
  }

  private async layNguoiDungTheoMaNd(maND: string) {
    const danhSach = await this.mysql.truyVan('SELECT * FROM NguoiDung WHERE MaND = ? LIMIT 1', [maND]);
    return danhSach[0] || null;
  }

  private taoMa(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  private chuanHoaChuoiKhongDau(giaTri: string) {
    return String(giaTri || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  }

  private async timMaDanhMucHopLe(giaTriDanhMuc: unknown) {
    const giaTri = String(giaTriDanhMuc || '').trim();
    if (!giaTri) {
      return null;
    }

    const [khopMa] = await this.mysql.truyVan('SELECT MaDanhMuc FROM DanhMuc WHERE MaDanhMuc = ? LIMIT 1', [giaTri]);
    if (khopMa?.MaDanhMuc) {
      return String(khopMa.MaDanhMuc);
    }

    const danhSachDanhMuc = await this.mysql.truyVan('SELECT MaDanhMuc, TenDanhMuc FROM DanhMuc');
    const bangAnhXaMacDinh: Record<string, string> = {
      khaivi: 'DM001',
      monchinh: 'DM002',
      trangmieng: 'DM003',
      douong: 'DM004',
      combo: 'DM005',
    };

    const khoaTim = this.chuanHoaChuoiKhongDau(giaTri);
    for (const danhMuc of danhSachDanhMuc) {
      if (this.chuanHoaChuoiKhongDau(String(danhMuc.TenDanhMuc || '')) === khoaTim) {
        return String(danhMuc.MaDanhMuc);
      }
    }

    return bangAnhXaMacDinh[khoaTim] || null;
  }

  private chuanHoaDanhSachChiTiet(dsDauVao: unknown, tienToMaChiTiet: string) {
    if (!Array.isArray(dsDauVao)) {
      return [];
    }

    return dsDauVao.map((muc: BanGhi) => ({
      maChiTiet: muc.maChiTiet || this.taoMa(tienToMaChiTiet),
      maMon: muc.maMon,
      soLuong: Number(muc.soLuong || 0),
      donGia: muc.donGia,
      ghiChu: muc.ghiChu || '',
    }));
  }

  async dangKy(payload: BanGhi) {
    const hoTen = String(payload.hoTen || '').trim();
    const email = String(payload.email || '').trim().toLowerCase();
    const matKhau = String(payload.matKhau || '').trim();
    const xacNhanMatKhau = String(payload.xacNhanMatKhau || '').trim();
    const soDienThoai = String(payload.soDienThoai || '').trim();
    const diaChi = String(payload.diaChi || '').trim();

    if (!hoTen || !email || !matKhau) {
      throw new BadRequestException('Ho ten, email va mat khau la bat buoc.');
    }

    if (matKhau !== xacNhanMatKhau) {
      throw new BadRequestException('Xac nhan mat khau khong khop.');
    }

    const daTonTai = await this.layNguoiDungTheoEmail(email);
    if (daTonTai) {
      throw new BadRequestException('Email da ton tai.');
    }

    const maND = this.taoMa('ND');
    const maKH = this.taoMa('KH');
    const matKhauMaHoa = await hash(matKhau, 10);

    await this.mysql.thucThi(
      'INSERT INTO NguoiDung (MaND, TenND, Email, MatKhau, VaiTro, TrangThai) VALUES (?, ?, ?, ?, ?, ?)',
      [maND, hoTen, email, matKhauMaHoa, 'KhachHang', 'Active'],
    );

    await this.mysql.thucThi(
      'INSERT INTO KhachHang (MaKH, MaND, TenKH, SDT, DiaChi, DiemTichLuy) VALUES (?, ?, ?, ?, ?, 0)',
      [maKH, maND, hoTen, soDienThoai || null, diaChi || null],
    );

    const nguoiDung = await this.layNguoiDungTheoMaNd(maND);
    const khachHang = await this.layKhachHangTheoMaNd(maND);
    const user = this.chuyenNguoiDungSangResponse(nguoiDung, khachHang);
    const accessToken = this.taoJwt(nguoiDung);

    return this.taoPhanHoi({ user, accessToken }, 'Dang ky thanh cong');
  }

  async dangNhap(email: string, matKhau: string, noiBo = false) {
    const nguoiDung = await this.layNguoiDungTheoEmail(String(email || '').trim().toLowerCase());
    if (!nguoiDung) {
      throw new UnauthorizedException('Email hoac mat khau khong dung.');
    }

    const hopLe = await compare(String(matKhau || ''), String(nguoiDung.MatKhau || ''));
    if (!hopLe) {
      throw new UnauthorizedException('Email hoac mat khau khong dung.');
    }

    if (noiBo && nguoiDung.VaiTro === 'KhachHang') {
      throw new UnauthorizedException('Tai khoan nay khong co quyen dang nhap noi bo.');
    }

    const khachHang = await this.layKhachHangTheoMaNd(nguoiDung.MaND);
    const user = this.chuyenNguoiDungSangResponse(nguoiDung, khachHang);
    const accessToken = this.taoJwt(nguoiDung);

    return this.taoPhanHoi({ user, accessToken }, 'Dang nhap thanh cong');
  }

  async layThongTinToi(dauTrang?: string) {
    const thongTinToken = this.giaiMaNguoiDung(dauTrang);
    const nguoiDung = await this.layNguoiDungTheoMaNd(String(thongTinToken.maND));
    if (!nguoiDung) {
      throw new NotFoundException('Khong tim thay nguoi dung.');
    }

    const khachHang = await this.layKhachHangTheoMaNd(nguoiDung.MaND);
    return this.taoPhanHoi(this.chuyenNguoiDungSangResponse(nguoiDung, khachHang), 'Lay thong tin thanh cong');
  }

  async capNhatHoSo(dauTrang: string | undefined, payload: BanGhi) {
    const thongTinToken = this.giaiMaNguoiDung(dauTrang);
    const maND = String(thongTinToken.maND);
    const hoTen = String(payload.hoTen || '').trim();
    const email = String(payload.email || '').trim().toLowerCase();
    const soDienThoai = String(payload.soDienThoai || '').trim();
    const diaChi = String(payload.diaChi || '').trim();

    await this.mysql.thucThi('UPDATE NguoiDung SET TenND = ?, Email = ? WHERE MaND = ?', [hoTen, email, maND]);
    await this.mysql.thucThi('UPDATE KhachHang SET TenKH = ?, SDT = ?, DiaChi = ? WHERE MaND = ?', [hoTen, soDienThoai || null, diaChi || null, maND]);

    return this.layThongTinToi(`Bearer ${this.taoJwt(await this.layNguoiDungTheoMaNd(maND))}`);
  }

  async doiMatKhau(dauTrang: string | undefined, payload: BanGhi) {
    const thongTinToken = this.giaiMaNguoiDung(dauTrang);
    const nguoiDung = await this.layNguoiDungTheoMaNd(String(thongTinToken.maND));
    if (!nguoiDung) {
      throw new NotFoundException('Khong tim thay nguoi dung.');
    }

    const matKhauHienTai = String(payload.matKhauHienTai || '');
    const matKhauMoi = String(payload.matKhauMoi || '');
    const xacNhan = String(payload.xacNhanMatKhauMoi || '');

    if (matKhauMoi !== xacNhan) {
      throw new BadRequestException('Xac nhan mat khau moi khong khop.');
    }

    const hopLe = await compare(matKhauHienTai, String(nguoiDung.MatKhau || ''));
    if (!hopLe) {
      throw new UnauthorizedException('Mat khau hien tai khong dung.');
    }

    await this.mysql.thucThi('UPDATE NguoiDung SET MatKhau = ? WHERE MaND = ?', [await hash(matKhauMoi, 10), nguoiDung.MaND]);
    return this.taoPhanHoi(null, 'Doi mat khau thanh cong');
  }

  async layDanhSachNguoiDung() {
    const danhSach = await this.mysql.truyVan(
      `SELECT nd.MaND, nd.TenND, nd.Email, nd.VaiTro, nd.TrangThai, kh.MaKH, kh.SDT, kh.DiaChi
       FROM NguoiDung nd
       LEFT JOIN KhachHang kh ON kh.MaND = nd.MaND
       ORDER BY nd.NgayTao DESC`,
    );

    return this.taoPhanHoi(danhSach.map((nguoiDung) => ({
      maND: nguoiDung.MaND,
      maKH: nguoiDung.MaKH || '',
      tenND: nguoiDung.TenND,
      email: nguoiDung.Email,
      sdt: nguoiDung.SDT || '',
      vaiTro: nguoiDung.VaiTro,
      trangThai: nguoiDung.TrangThai,
      diaChi: nguoiDung.DiaChi || '',
    })), 'Lay danh sach nguoi dung thanh cong');
  }

  async layThucDon() {
    const danhSach = await this.mysql.truyVan('SELECT * FROM ThucDon WHERE TrangThai <> ? ORDER BY NgayCapNhat DESC', ['Deleted']);
    return this.taoPhanHoi(danhSach.map((mon) => ({
      maMon: mon.MaMon,
      maDanhMuc: mon.MaDanhMuc,
      tenMon: mon.TenMon,
      moTa: mon.MoTa,
      gia: Number(mon.Gia || 0),
      hinhAnh: mon.HinhAnh,
      thoiGianChuanBi: Number(mon.ThoiGianChuanBi || 0),
      trangThai: mon.TrangThai,
    })), 'Lay thuc don thanh cong');
  }

  async taoMon(payload: BanGhi) {
    const maMon = String(payload.maMon || this.taoMa('M')).trim();
    const maDanhMuc = await this.timMaDanhMucHopLe(payload.maDanhMuc);
    const tenMon = String(payload.tenMon || '').trim();
    const moTa = payload.moTa == null || String(payload.moTa).trim() === '' ? null : String(payload.moTa).trim();
    const hinhAnh = payload.hinhAnh == null || String(payload.hinhAnh).trim() === '' ? null : String(payload.hinhAnh).trim();
    const thoiGianChuanBi = Number(payload.thoiGianChuanBi ?? 0);
    const trangThai = String(payload.trangThai || 'Available').trim() || 'Available';

    if (!tenMon) {
      throw new BadRequestException('Ten mon la bat buoc.');
    }

    await this.mysql.thucThi(
      'INSERT INTO ThucDon (MaMon, MaDanhMuc, TenMon, MoTa, Gia, HinhAnh, ThoiGianChuanBi, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [maMon, maDanhMuc, tenMon, moTa, Number(payload.gia || 0), hinhAnh, thoiGianChuanBi, trangThai],
    );
    const danhSach = await this.mysql.truyVan('SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1', [maMon]);
    return this.taoPhanHoi({
      maMon: danhSach[0].MaMon,
      maDanhMuc: danhSach[0].MaDanhMuc,
      tenMon: danhSach[0].TenMon,
      moTa: danhSach[0].MoTa,
      gia: Number(danhSach[0].Gia || 0),
      hinhAnh: danhSach[0].HinhAnh,
      thoiGianChuanBi: Number(danhSach[0].ThoiGianChuanBi || 0),
      trangThai: danhSach[0].TrangThai,
    }, 'Tao mon thanh cong');
  }

  async capNhatMon(maMon: string, payload: BanGhi) {
    const maDanhMuc = await this.timMaDanhMucHopLe(payload.maDanhMuc);
    const tenMon = String(payload.tenMon || '').trim();
    const moTa = payload.moTa == null || String(payload.moTa).trim() === '' ? null : String(payload.moTa).trim();
    const hinhAnh = payload.hinhAnh == null || String(payload.hinhAnh).trim() === '' ? null : String(payload.hinhAnh).trim();
    const thoiGianChuanBi = Number(payload.thoiGianChuanBi ?? 0);
    const trangThai = String(payload.trangThai || 'Available').trim() || 'Available';

    if (!tenMon) {
      throw new BadRequestException('Ten mon la bat buoc.');
    }

    await this.mysql.thucThi(
      'UPDATE ThucDon SET MaDanhMuc = ?, TenMon = ?, MoTa = ?, Gia = ?, HinhAnh = ?, ThoiGianChuanBi = ?, TrangThai = ? WHERE MaMon = ?',
      [
        maDanhMuc,
        tenMon,
        moTa,
        Number(payload.gia || 0),
        hinhAnh,
        thoiGianChuanBi,
        trangThai,
        maMon,
      ],
    );

    const danhSach = await this.mysql.truyVan('SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1', [maMon]);
    if (!danhSach[0]) {
      throw new NotFoundException('Khong tim thay mon an.');
    }

    return this.taoPhanHoi({
      maMon: danhSach[0].MaMon,
      maDanhMuc: danhSach[0].MaDanhMuc,
      tenMon: danhSach[0].TenMon,
      moTa: danhSach[0].MoTa,
      gia: Number(danhSach[0].Gia || 0),
      hinhAnh: danhSach[0].HinhAnh,
      thoiGianChuanBi: Number(danhSach[0].ThoiGianChuanBi || 0),
      trangThai: danhSach[0].TrangThai,
    }, 'Cap nhat mon thanh cong');
  }

  async xoaMon(maMon: string) {
    await this.mysql.thucThi('UPDATE ThucDon SET TrangThai = ? WHERE MaMon = ?', ['Deleted', maMon]);
    return this.taoPhanHoi({ maMon }, 'Xoa mon thanh cong');
  }

  async layDanhSachBan() {
    const danhSach = await this.mysql.truyVan('SELECT * FROM Ban ORDER BY SoBan ASC, NgayCapNhat DESC');
    return this.taoPhanHoi(danhSach.map((ban) => ({
      maBan: ban.MaBan,
      tenBan: ban.TenBan,
      soBan: Number(ban.SoBan || 0),
      soChoNgoi: Number(ban.SoChoNgoi || 0),
      khuVuc: ban.KhuVuc,
      viTri: ban.ViTri,
      ghiChu: ban.GhiChu,
      trangThai: ban.TrangThai,
    })), 'Lay danh sach ban thanh cong');
  }

  async taoBan(payload: BanGhi) {
    await this.mysql.thucThi(
      'INSERT INTO Ban (MaBan, TenBan, KhuVuc, SoBan, SoChoNgoi, ViTri, GhiChu, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [payload.maBan, payload.tenBan, payload.khuVuc || null, Number(payload.soBan || 0), Number(payload.soChoNgoi || 0), payload.viTri || null, payload.ghiChu || null, 'Available'],
    );
    return this.taoPhanHoi({ maBan: payload.maBan }, 'Tao ban thanh cong');
  }

  async capNhatBan(maBan: string, payload: BanGhi) {
    await this.mysql.thucThi(
      'UPDATE Ban SET TenBan = ?, KhuVuc = ?, SoBan = ?, SoChoNgoi = ?, ViTri = ?, GhiChu = ? WHERE MaBan = ?',
      [payload.tenBan, payload.khuVuc || null, Number(payload.soBan || 0), Number(payload.soChoNgoi || 0), payload.viTri || null, payload.ghiChu || null, maBan],
    );
    return this.taoPhanHoi({ maBan }, 'Cap nhat ban thanh cong');
  }

  async xoaBan(maBan: string) {
    await this.mysql.thucThi('DELETE FROM Ban WHERE MaBan = ?', [maBan]);
    return this.taoPhanHoi(null, 'Xoa ban thanh cong');
  }

  async capNhatTrangThaiBan(maBan: string, trangThai: string) {
    const map = new Map<string, string>([
      ['TRONG', 'Available'],
      ['CO_KHACH', 'Occupied'],
      ['CHO_THANH_TOAN', 'Reserved'],
      ['Available', 'Available'],
      ['Occupied', 'Occupied'],
      ['Reserved', 'Reserved'],
    ]);
    await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', [map.get(trangThai) || trangThai, maBan]);
    return this.taoPhanHoi({ maBan, trangThai }, 'Cap nhat trang thai ban thanh cong');
  }

  async layQrBan(maBan: string) {
    const danhSach = await this.mysql.truyVan('SELECT * FROM Ban WHERE MaBan = ? LIMIT 1', [maBan]);
    const ban = danhSach[0];
    if (!ban) {
      throw new NotFoundException('Khong tim thay ban.');
    }

    const url = `${this.urlFrontend}/ban/${maBan}/goi-mon`;
    return this.taoPhanHoi({
      maBan,
      tenBan: ban.TenBan,
      khuVuc: ban.KhuVuc || ban.ViTri || '',
      url,
      qrBase64: '',
    }, 'Lay QR ban thanh cong');
  }

  async layThucDonTheoBan(maBan: string) {
    const [ban] = await this.mysql.truyVan('SELECT * FROM Ban WHERE MaBan = ? LIMIT 1', [maBan]);
    if (!ban) {
      throw new NotFoundException('Ban khong ton tai.');
    }
    const monAn = (await this.layThucDon()).data;
    return this.taoPhanHoi({ ban: { maBan: ban.MaBan, tenBan: ban.TenBan, soBan: ban.SoBan }, monAn }, 'Lay thuc don theo ban thanh cong');
  }

  private async layChiTietDonHangTheoMa(maDonHang: string) {
    const chiTiet = await this.mysql.truyVan(
      `SELECT ct.*, td.TenMon
       FROM ChiTietDonHang ct
       LEFT JOIN ThucDon td ON td.MaMon = ct.MaMon
       WHERE ct.MaDonHang = ?
       ORDER BY ct.NgayTao ASC`,
      [maDonHang],
    );

    return chiTiet.map((dong) => ({
      MaChiTiet: dong.MaChiTiet,
      MaMon: dong.MaMon,
      TenMon: dong.TenMon,
      SoLuong: Number(dong.SoLuong || 0),
      DonGia: Number(dong.DonGia || 0),
      ThanhTien: Number(dong.ThanhTien || 0),
      GhiChu: dong.GhiChu || '',
      TrangThai: dong.TrangThai,
    }));
  }

  private taoPricingSummary(tamTinh: number, phiShip = 0, giamGia = 0, phiDichVu = 0) {
    return {
      tamTinh: Number(tamTinh || 0),
      giamGia: Number(giamGia || 0),
      phiDichVu: Number(phiDichVu || 0),
      phiShip: Number(phiShip || 0),
      tongTien: Math.max(0, Number(tamTinh || 0) + Number(phiDichVu || 0) + Number(phiShip || 0) - Number(giamGia || 0)),
    };
  }

  private tinhPhiDichVuTheoTamTinh(tamTinh: number) {
    return tamTinh > 0 ? Math.round((Number(tamTinh || 0) * 0.05) / 1000) * 1000 : 0;
  }

  private tinhTongTamTinhTuChiTiet(chiTiet: BanGhi[]) {
    return chiTiet.reduce((tong, muc) => tong + Number(muc.ThanhTien || muc.thanhTien || 0), 0);
  }

  private taoPricingSummaryTuDuLieuDonHang(donHang: BanGhi, chiTiet: BanGhi[]) {
    const tamTinh = this.tinhTongTamTinhTuChiTiet(chiTiet);
    const phiShip = Number(donHang.PhiShip || donHang.phiShip || 0);
    const tongTienDaLuu = Number(donHang.TongTien || donHang.tongTien || 0);
    const phiDichVu = this.tinhPhiDichVuTheoTamTinh(tamTinh);
    const tongTruocGiam = tamTinh + phiShip + phiDichVu;
    const giamGia = Math.max(0, tongTruocGiam - tongTienDaLuu);
    return this.taoPricingSummary(tamTinh, phiShip, giamGia, phiDichVu);
  }

  private async layThongTinVoucherApDung(maCodeDauVao: unknown, tongTien: number) {
    const maCode = String(maCodeDauVao || '').trim();
    if (!maCode) {
      return this.taoVoucherResponse();
    }

    const [ma] = await this.mysql.truyVan('SELECT * FROM MaGiamGia WHERE MaCode = ? LIMIT 1', [maCode]);
    if (!ma) {
      throw new BadRequestException('Ma giam gia khong ton tai.');
    }
    if (String(ma.TrangThai || '') !== 'Active') {
      throw new BadRequestException('Ma giam gia khong con hieu luc.');
    }
    if (tongTien < Number(ma.DonHangToiThieu || 0)) {
      throw new BadRequestException('Don hang chua du dieu kien ap dung ma giam gia.');
    }

    const laPhanTram = String(ma.LoaiGiam || '').toLowerCase() === 'phantram';
    const giaTriGiam = Number(ma.GiaTri || 0);
    const giamToiDa = ma.GiaTriToiDa == null ? null : Number(ma.GiaTriToiDa);
    const soTienGiamTamTinh = laPhanTram ? Math.round((tongTien * giaTriGiam) / 100) : giaTriGiam;
    const soTienGiamThucTe = giamToiDa == null ? soTienGiamTamTinh : Math.min(soTienGiamTamTinh, giamToiDa);

    return this.taoVoucherResponse({
      maGiamGia: ma.MaCode,
      tenGiamGia: ma.TenCode,
      loaiGiam: ma.LoaiGiam,
      giaTriGiam,
      giamToiDa,
      dieuKienToiThieu: Number(ma.DonHangToiThieu || 0),
      thongDiep: '',
    }, soTienGiamThucTe);
  }

  private async recalculateOrderPricing(payload: BanGhi, chiTietDauVao: BanGhi[]) {
    const chiTietDaTinh: BanGhi[] = [];
    let tamTinh = 0;

    for (const muc of chiTietDauVao) {
      const [mon] = await this.mysql.truyVan('SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1', [muc.maMon]);
      if (!mon) {
        throw new BadRequestException(`Mon ${muc.maMon} khong ton tai.`);
      }

      const soLuong = Number(muc.soLuong || 0);
      const donGia = Number(mon.Gia || 0);
      const thanhTien = soLuong * donGia;
      tamTinh += thanhTien;
      chiTietDaTinh.push({
        ...muc,
        tenMon: String(mon.TenMon || ''),
        donGia,
        soLuong,
        thanhTien,
      });
    }

    const phiShip = Number(payload.phiShip || 0);
    const phiDichVu = this.tinhPhiDichVuTheoTamTinh(tamTinh);
    const voucher = await this.layThongTinVoucherApDung(payload.maGiamGia, tamTinh + phiDichVu + phiShip);
    const pricingSummary = this.taoPricingSummary(tamTinh, phiShip, voucher.soTienGiamThucTe, phiDichVu);

    return { chiTietDaTinh, pricingSummary, voucher };
  }

  private taoVoucherResponse(payload: BanGhi = {}, soTienGiamThucTe = 0) {
    return {
      hopLe: Boolean(payload.maGiamGia || payload.maCode),
      maGiamGia: String(payload.maGiamGia || payload.maCode || '').trim(),
      tenGiamGia: String(payload.tenGiamGia || payload.tenCode || '').trim(),
      loaiGiam: String(payload.loaiGiam || '').trim(),
      giaTriGiam: Number(payload.giaTriGiam || payload.giaTri || 0),
      giamToiDa: payload.giamToiDa == null && payload.giaTriToiDa == null ? null : Number(payload.giamToiDa ?? payload.giaTriToiDa),
      dieuKienToiThieu: Number(payload.dieuKienToiThieu || payload.donHangToiThieu || 0),
      soTienGiamThucTe: Number(soTienGiamThucTe || 0),
      thongDiep: String(payload.thongDiep || payload.moTa || '').trim(),
    };
  }

  private taoThongTinNhanHang(donHang: BanGhi) {
    return {
      loaiDon: String(donHang.loaiDon || donHang.LoaiDon || '').trim(),
      diaChiGiao: String(donHang.diaChiGiao || donHang.DiaChiGiao || '').trim(),
      gioLayHang: String(donHang.gioLayHang || donHang.GioLayHang || '').trim(),
      gioGiao: String(donHang.gioGiao || donHang.GioGiao || '').trim(),
    };
  }

  async taoDonHang(payload: BanGhi, loaiDon?: string) {
    const maDonHang = String(payload.maDonHang || this.taoMa('DH'));
    const chiTiet = Array.isArray(payload.chiTiet) ? payload.chiTiet : [];
    const maBan = payload.maBan || payload.maBanAn || null;
    const nguonTao = payload.nguonTao || 'Online';
    const loaiDonHang = loaiDon || payload.loaiDon || 'TAI_QUAN';
    const trangThai = payload.trangThai || 'Pending';
    const { chiTietDaTinh, pricingSummary, voucher } = await this.recalculateOrderPricing(payload, chiTiet);

    await this.mysql.thucThi(
      `INSERT INTO DonHang (MaDonHang, MaKH, MaBan, MaBanAn, MaNV, MaDatBan, LoaiDon, DiaChiGiao, PhiShip, TongTien, TrangThai, NguonTao, GhiChu)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        maDonHang,
        payload.maKH || null,
        maBan,
        maBan,
        payload.maNV || null,
        payload.maDatBan || null,
        loaiDonHang,
        payload.diaChiGiao || null,
        pricingSummary.phiShip,
        pricingSummary.tongTien,
        trangThai,
        nguonTao,
        payload.ghiChu || null,
      ],
    );

    const chiTietPhanHoi: BanGhi[] = [];
    for (const muc of chiTietDaTinh) {
      const maChiTiet = muc.maChiTiet || this.taoMa('CT');
      await this.mysql.thucThi(
        'INSERT INTO ChiTietDonHang (MaChiTiet, MaDonHang, MaMon, SoLuong, DonGia, ThanhTien, GhiChu, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [maChiTiet, maDonHang, muc.maMon, muc.soLuong, muc.donGia, muc.thanhTien, muc.ghiChu || null, 'Pending'],
      );
      chiTietPhanHoi.push({
        MaChiTiet: maChiTiet,
        MaMon: muc.maMon,
        TenMon: muc.tenMon || '',
        SoLuong: muc.soLuong,
        DonGia: muc.donGia,
        ThanhTien: muc.thanhTien,
        GhiChu: muc.ghiChu || '',
        TrangThai: 'Pending',
      });
    }

    if (maBan) {
      await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Occupied', maBan]);
    }

    return this.taoPhanHoi({
      donHang: {
        maDonHang,
        maKH: payload.maKH || null,
        maBan,
        maNV: payload.maNV || null,
        maDatBan: payload.maDatBan || null,
        tongTien: pricingSummary.tongTien,
        pricingSummary,
        voucher,
        trangThai,
        ghiChu: payload.ghiChu || '',
        ngayTao: new Date().toISOString(),
        loaiDon: loaiDonHang,
        thongTinNhanHang: this.taoThongTinNhanHang({
          loaiDon: loaiDonHang,
          diaChiGiao: payload.diaChiGiao || '',
          gioLayHang: payload.gioLayHang || payload.thongTinNhanHang?.gioLayHang || '',
          gioGiao: payload.gioGiao || payload.thongTinNhanHang?.gioGiao || '',
        }),
        diaChiGiao: payload.diaChiGiao || '',
        phiShip: pricingSummary.phiShip,
        tenKhachHang: payload.hoTen || payload.tenKhachHang || '',
        soDienThoai: payload.soDienThoai || '',
        email: payload.email || '',
        diaChiKhachHang: payload.diaChiGiao || '',
      },
      chiTiet: chiTietPhanHoi,
    }, 'Tao don hang thanh cong');
  }

  async layDanhSachDonHang() {
    const danhSach = await this.mysql.truyVan(
      `SELECT dh.*, kh.TenKH, kh.SDT, kh.DiaChi, nd.Email
       FROM DonHang dh
       LEFT JOIN KhachHang kh ON kh.MaKH = dh.MaKH
       LEFT JOIN NguoiDung nd ON nd.MaND = kh.MaND
       ORDER BY dh.NgayTao DESC`,
    );
    const ketQua = await Promise.all(danhSach.map(async (don) => {
      const chiTiet = await this.layChiTietDonHangTheoMa(String(don.MaDonHang));
      const pricingSummary = this.taoPricingSummaryTuDuLieuDonHang(don, chiTiet);
      return {
        maDonHang: don.MaDonHang,
        maKH: don.MaKH,
        maBan: don.MaBan || don.MaBanAn,
        maNV: don.MaNV,
        maDatBan: don.MaDatBan,
        tongTien: Number(don.TongTien || 0),
        pricingSummary,
        voucher: this.taoVoucherResponse({}, pricingSummary.giamGia),
        trangThai: don.TrangThai,
        ghiChu: don.GhiChu || '',
        ngayTao: don.NgayTao,
        loaiDon: don.LoaiDon,
        thongTinNhanHang: this.taoThongTinNhanHang({ loaiDon: don.LoaiDon, diaChiGiao: don.DiaChiGiao || '' }),
        diaChiGiao: don.DiaChiGiao || '',
        phiShip: Number(don.PhiShip || 0),
        tenKhachHang: don.TenKH || '',
        soDienThoai: don.SDT || '',
        email: don.Email || '',
        diaChiKhachHang: don.DiaChi || '',
        chiTiet,
      };
    }));

    return this.taoPhanHoi(ketQua, 'Lay danh sach don hang thanh cong');
  }

  async layChiTietDonHang(maDonHang: string) {
    const [donHang] = await this.mysql.truyVan(
      `SELECT dh.*, kh.TenKH, kh.SDT, kh.DiaChi, nd.Email
       FROM DonHang dh
       LEFT JOIN KhachHang kh ON kh.MaKH = dh.MaKH
       LEFT JOIN NguoiDung nd ON nd.MaND = kh.MaND
       WHERE dh.MaDonHang = ?
       LIMIT 1`,
      [maDonHang],
    );
    if (!donHang) {
      throw new NotFoundException('Khong tim thay don hang.');
    }

    const chiTiet = await this.layChiTietDonHangTheoMa(maDonHang);
    const pricingSummary = this.taoPricingSummaryTuDuLieuDonHang(donHang, chiTiet);
    return this.taoPhanHoi({
      donHang: {
        maDonHang: donHang.MaDonHang,
        maKH: donHang.MaKH,
        maBan: donHang.MaBan || donHang.MaBanAn,
        maNV: donHang.MaNV,
        maDatBan: donHang.MaDatBan,
        tongTien: Number(donHang.TongTien || 0),
        pricingSummary,
        voucher: this.taoVoucherResponse({}, pricingSummary.giamGia),
        trangThai: donHang.TrangThai,
        ghiChu: donHang.GhiChu || '',
        ngayTao: donHang.NgayTao,
        loaiDon: donHang.LoaiDon,
        thongTinNhanHang: this.taoThongTinNhanHang({ loaiDon: donHang.LoaiDon, diaChiGiao: donHang.DiaChiGiao || '' }),
        diaChiGiao: donHang.DiaChiGiao || '',
        phiShip: Number(donHang.PhiShip || 0),
        tenKhachHang: donHang.TenKH || '',
        soDienThoai: donHang.SDT || '',
        email: donHang.Email || '',
        diaChiKhachHang: donHang.DiaChi || '',
      },
      chiTiet,
    }, 'Lay chi tiet don hang thanh cong');
  }

  private chuyenDuLieuHinhAnhDanhGia(giaTri: unknown) {
    if (!giaTri) return [];
    if (Array.isArray(giaTri)) return giaTri.filter(Boolean).map((item) => String(item));

    const chuoi = String(giaTri).trim();
    if (!chuoi) return [];

    try {
      const phanTich = JSON.parse(chuoi);
      return Array.isArray(phanTich) ? phanTich.filter(Boolean).map((item) => String(item)) : [chuoi];
    } catch {
      return chuoi.includes('data:') || chuoi.includes('http') ? [chuoi] : [chuoi];
    }
  }

  private chuyenHinhAnhDanhGia(giaTri: unknown) {
    if (giaTri == null) return null;
    if (Array.isArray(giaTri)) {
      const hopLe = giaTri.map((item) => String(item).trim()).filter(Boolean);
      return hopLe.length ? JSON.stringify(hopLe) : null;
    }

    const chuoi = String(giaTri).trim();
    if (!chuoi) return null;

    try {
      const phanTich = JSON.parse(chuoi);
      return Array.isArray(phanTich) ? JSON.stringify(phanTich.filter(Boolean).map((item) => String(item))) : chuoi;
    } catch {
      return chuoi;
    }
  }

  async layTongQuanDiemTichLuy(dauTrang?: string) {
    const thongTinToken = this.giaiMaNguoiDung(dauTrang);
    const khachHang = await this.layKhachHangTheoMaNd(String(thongTinToken.maND));

    if (!khachHang) {
      return this.taoPhanHoi({ tongDiem: 0, diemCoTheDoi: 0, tiLeQuyDoi: this.TI_LE_TICH_DIEM_MAC_DINH }, 'Khong tim thay thong tin diem tich luy');
    }

    return this.taoPhanHoi({
      maKH: khachHang.MaKH,
      tongDiem: Number(khachHang.DiemTichLuy || 0),
      diemCoTheDoi: Number(khachHang.DiemTichLuy || 0),
      tiLeQuyDoi: this.TI_LE_TICH_DIEM_MAC_DINH,
    }, 'Lay tong quan diem tich luy thanh cong');
  }

  async layLichSuDiemTichLuy(dauTrang?: string) {
    const thongTinToken = this.giaiMaNguoiDung(dauTrang);
    const khachHang = await this.layKhachHangTheoMaNd(String(thongTinToken.maND));

    if (!khachHang) {
      return this.taoPhanHoi([], 'Khong co lich su diem tich luy');
    }

    const lichSu = await this.mysql.truyVan(
      'SELECT * FROM LichSuDiemTichLuy WHERE MaKH = ? ORDER BY NgayTao DESC',
      [khachHang.MaKH],
    );

    return this.taoPhanHoi(lichSu.map((giaoDich) => this.chuyenLichSuDiemSangResponse(giaoDich)), 'Lay lich su diem tich luy thanh cong');
  }

  async layDonHangCuaToi(dauTrang?: string) {
    const thongTinToken = this.giaiMaNguoiDung(dauTrang);
    const khachHang = await this.layKhachHangTheoMaNd(String(thongTinToken.maND));
    if (!khachHang) {
      return this.taoPhanHoi([], 'Khong co don hang');
    }

    const danhSach = await this.mysql.truyVan('SELECT * FROM DonHang WHERE MaKH = ? ORDER BY NgayTao DESC', [khachHang.MaKH]);
    const ketQua = await Promise.all(danhSach.map(async (don) => ({
      maDonHang: don.MaDonHang,
      tongTien: Number(don.TongTien || 0),
      trangThai: don.TrangThai,
      ngayTao: don.NgayTao,
      chiTiet: await this.layChiTietDonHangTheoMa(String(don.MaDonHang)),
    })));
    return this.taoPhanHoi(ketQua, 'Lay don hang cua toi thanh cong');
  }

  async layDonHangCoTheDanhGia(dauTrang?: string) {
    const thongTinToken = this.giaiMaNguoiDung(dauTrang);
    const khachHang = await this.layKhachHangTheoMaNd(String(thongTinToken.maND));
    if (!khachHang) {
      return this.taoPhanHoi([], 'Khong co don hang co the danh gia');
    }

    const danhSach = await this.mysql.truyVan(
      `SELECT d.*
       FROM DonHang d
       LEFT JOIN DanhGia dg ON dg.MaDonHang = d.MaDonHang AND dg.MaKH = d.MaKH
       WHERE d.MaKH = ?
         AND d.TrangThai IN ('Completed', 'Paid', 'Served')
         AND dg.MaDanhGia IS NULL
       ORDER BY d.NgayTao DESC`,
      [khachHang.MaKH],
    );

    const ketQua = await Promise.all(danhSach.map(async (don) => ({
      maDonHang: don.MaDonHang,
      tongTien: Number(don.TongTien || 0),
      trangThai: don.TrangThai,
      ngayTao: don.NgayTao,
      chiTiet: await this.layChiTietDonHangTheoMa(String(don.MaDonHang)),
    })));

    return this.taoPhanHoi(ketQua, 'Lay don hang co the danh gia thanh cong');
  }

  async capNhatTrangThaiDonHang(maDonHang: string, trangThai: string) {
    await this.mysql.thucThi('UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?', [trangThai, maDonHang]);
    if (trangThai === 'Paid') {
      const [don] = await this.mysql.truyVan('SELECT * FROM DonHang WHERE MaDonHang = ? LIMIT 1', [maDonHang]);
      if (don?.MaBan) {
        await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Available', don.MaBan]);
      }
    }
    return this.layChiTietDonHang(maDonHang);
  }

  async layDanhSachDatBan() {
    const danhSach = await this.mysql.truyVan('SELECT * FROM DatBan ORDER BY NgayTao DESC');
    return this.taoPhanHoi(danhSach.map((datBan) => ({
      maDatBan: datBan.MaDatBan,
      maKH: datBan.MaKH,
      maBan: datBan.MaBan,
      maNV: datBan.MaNV,
      ngayDat: datBan.NgayDat,
      gioDat: datBan.GioDat,
      gioKetThuc: datBan.GioKetThuc,
      soNguoi: Number(datBan.SoNguoi || 0),
      ghiChu: datBan.GhiChu || '',
      trangThai: datBan.TrangThai,
      ngayTao: datBan.NgayTao,
      ngayCapNhat: datBan.NgayCapNhat,
    })), 'Lay danh sach dat ban thanh cong');
  }

  async layLichSuDatBan(maKh: string) {
    const danhSach = await this.mysql.truyVan('SELECT * FROM DatBan WHERE MaKH = ? ORDER BY NgayTao DESC', [maKh]);
    return this.taoPhanHoi(danhSach.map((datBan) => ({
      maDatBan: datBan.MaDatBan,
      maKH: datBan.MaKH,
      maBan: datBan.MaBan,
      maNV: datBan.MaNV,
      ngayDat: datBan.NgayDat,
      gioDat: datBan.GioDat,
      gioKetThuc: datBan.GioKetThuc,
      soNguoi: Number(datBan.SoNguoi || 0),
      ghiChu: datBan.GhiChu || '',
      trangThai: datBan.TrangThai,
      ngayTao: datBan.NgayTao,
      ngayCapNhat: datBan.NgayCapNhat,
    })), 'Lay lich su dat ban thanh cong');
  }

  async taoDatBan(payload: BanGhi) {
    await this.mysql.thucThi(
      `INSERT INTO DatBan (MaDatBan, MaKH, MaBan, MaNV, NgayDat, GioDat, GioKetThuc, SoNguoi, GhiChu, TrangThai)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [payload.maDatBan, payload.maKH || null, payload.maBan || null, payload.maNV || null, payload.ngayDat, payload.gioDat, payload.gioKetThuc || null, Number(payload.soNguoi || 0), payload.ghiChu || null, 'Pending'],
    );
    return this.taoPhanHoi(payload, 'Tao dat ban thanh cong');
  }

  async layKhaDungDatBan(query: BanGhi) {
    const ngayDat = String(query.ngayDat || '').trim();
    const gioDat = String(query.gioDat || '').trim();
    const soNguoi = Number(query.soNguoi || 0);
    const khuVuc = String(query.khuVuc || '').trim();

    if (!ngayDat || !gioDat) {
      throw new BadRequestException('Ngay dat va gio dat la bat buoc.');
    }

    const danhSachBan = await this.mysql.truyVan('SELECT * FROM Ban ORDER BY SoBan ASC');
    const danhSachDatBan = await this.mysql.truyVan(
      `SELECT * FROM DatBan
       WHERE NgayDat = ? AND GioDat = ? AND TrangThai NOT IN ('Cancelled', 'NoShow', 'Completed')`,
      [ngayDat, gioDat],
    );

    const tapBanDaDuocDung = new Set(
      danhSachDatBan
        .map((datBan) => String(datBan.MaBan || '').trim())
        .filter(Boolean),
    );

    const danhSachBanKhaDung = danhSachBan
      .filter((ban) => !tapBanDaDuocDung.has(String(ban.MaBan || '').trim()))
      .filter((ban) => String(ban.TrangThai || '') !== 'Occupied' && String(ban.TrangThai || '') !== 'Maintenance')
      .filter((ban) => {
        if (!khuVuc || khuVuc === 'KHONG_UU_TIEN') {
          return true;
        }

        const giaTriKhuVuc = String(ban.KhuVuc || ban.ViTri || '').toLowerCase();
        if (khuVuc === 'PHONG_VIP') return giaTriKhuVuc.includes('vip') || giaTriKhuVuc.includes('riêng') || giaTriKhuVuc.includes('rieng');
        if (khuVuc === 'BAN_CONG') return giaTriKhuVuc.includes('ngoài') || giaTriKhuVuc.includes('ngoai') || giaTriKhuVuc.includes('ban công') || giaTriKhuVuc.includes('ban cong');
        if (khuVuc === 'SANH_CHINH') return !giaTriKhuVuc.includes('vip') && !giaTriKhuVuc.includes('ngoài') && !giaTriKhuVuc.includes('ngoai') && !giaTriKhuVuc.includes('ban cong');
        return true;
      });

    const danhSachBanPhuHop = soNguoi > 0
      ? danhSachBanKhaDung.filter((ban) => Number(ban.SoChoNgoi || 0) >= soNguoi)
      : danhSachBanKhaDung;

    const tongBanConTrong = danhSachBanKhaDung.length;
    const tongBanPhuHop = danhSachBanPhuHop.length;
    const mucKhaDung = tongBanPhuHop <= 0 ? 'FULL' : tongBanPhuHop <= 2 ? 'LIMITED' : 'AVAILABLE';

    return this.taoPhanHoi({
      ngayDat,
      gioDat,
      soNguoi,
      khuVuc: khuVuc || 'KHONG_UU_TIEN',
      tongBanConTrong,
      tongBanPhuHop,
      mucKhaDung,
      danhSachBan: danhSachBanPhuHop.map((ban) => ({
        maBan: ban.MaBan,
        tenBan: ban.TenBan,
        khuVuc: ban.KhuVuc,
        viTri: ban.ViTri,
        soBan: Number(ban.SoBan || 0),
        soChoNgoi: Number(ban.SoChoNgoi || 0),
        trangThai: ban.TrangThai,
      })),
    }, 'Lay kha dung dat ban thanh cong');
  }

  async capNhatTrangThaiDatBan(maDatBan: string, trangThai: string) {
    await this.mysql.thucThi('UPDATE DatBan SET TrangThai = ? WHERE MaDatBan = ?', [trangThai, maDatBan]);
    const [datBan] = await this.mysql.truyVan('SELECT * FROM DatBan WHERE MaDatBan = ? LIMIT 1', [maDatBan]);
    return this.taoPhanHoi({
      maDatBan: datBan.MaDatBan,
      maKH: datBan.MaKH,
      maBan: datBan.MaBan,
      maNV: datBan.MaNV,
      ngayDat: datBan.NgayDat,
      gioDat: datBan.GioDat,
      gioKetThuc: datBan.GioKetThuc,
      soNguoi: Number(datBan.SoNguoi || 0),
      ghiChu: datBan.GhiChu || '',
      trangThai: datBan.TrangThai,
      ngayTao: datBan.NgayTao,
      ngayCapNhat: datBan.NgayCapNhat,
    }, 'Cap nhat dat ban thanh cong');
  }

  async ganBanChoDatBan(maDatBan: string, payload: BanGhi) {
    const [datBan] = await this.mysql.truyVan('SELECT * FROM DatBan WHERE MaDatBan = ? LIMIT 1', [maDatBan]);
    if (!datBan) {
      throw new NotFoundException('Khong tim thay dat ban.');
    }

    const danhSachMaBan = Array.isArray(payload.danhSachMaBan)
      ? payload.danhSachMaBan.map((maBan) => String(maBan || '').trim()).filter(Boolean)
      : [];

    if (!danhSachMaBan.length) {
      throw new BadRequestException('Can it nhat mot ban de gan cho booking.');
    }

    const danhSachBanHopLe = await this.mysql.truyVan(
      `SELECT * FROM Ban WHERE MaBan IN (${danhSachMaBan.map(() => '?').join(', ')})`,
      danhSachMaBan,
    );

    if (danhSachBanHopLe.length !== danhSachMaBan.length) {
      throw new BadRequestException('Co ban khong ton tai hoac da bi xoa.');
    }

    const soKhach = Number(datBan.SoNguoi || 0);
    const tongSucChua = danhSachBanHopLe.reduce((tong, ban) => tong + Number(ban.SoChoNgoi || 0), 0);
    if (soKhach > 0 && tongSucChua < soKhach) {
      throw new BadRequestException('Tong suc chua cua cac ban duoc chon khong du cho booking nay.');
    }

    const trangThaiKhongHopLe = danhSachBanHopLe.find((ban) => String(ban.TrangThai || '') === 'Occupied');
    if (trangThaiKhongHopLe) {
      throw new BadRequestException(`Ban ${trangThaiKhongHopLe.MaBan} dang co khach, khong the gan cho booking.`);
    }

    await this.mysql.giaoDich(async (ketNoi) => {
      for (const maBan of danhSachMaBan) {
        await ketNoi.execute('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Reserved', maBan]);
      }

      await ketNoi.execute(
        'UPDATE DatBan SET MaBan = ?, TrangThai = ? WHERE MaDatBan = ?',
        [danhSachMaBan[0], 'DA_XAC_NHAN', maDatBan],
      );
    });

    const [datBanDaCapNhat] = await this.mysql.truyVan('SELECT * FROM DatBan WHERE MaDatBan = ? LIMIT 1', [maDatBan]);
    return this.taoPhanHoi({
      maDatBan: datBanDaCapNhat.MaDatBan,
      maKH: datBanDaCapNhat.MaKH,
      maBan: datBanDaCapNhat.MaBan,
      maNV: datBanDaCapNhat.MaNV,
      ngayDat: datBanDaCapNhat.NgayDat,
      gioDat: datBanDaCapNhat.GioDat,
      gioKetThuc: datBanDaCapNhat.GioKetThuc,
      soNguoi: Number(datBanDaCapNhat.SoNguoi || 0),
      ghiChu: datBanDaCapNhat.GhiChu || '',
      trangThai: datBanDaCapNhat.TrangThai,
      ngayTao: datBanDaCapNhat.NgayTao,
      ngayCapNhat: datBanDaCapNhat.NgayCapNhat,
      assignedTableIds: danhSachBanHopLe.map((ban) => String(ban.MaBan)),
      assignedTables: danhSachBanHopLe.map((ban) => ({
        id: String(ban.MaBan),
        code: String(ban.MaBan),
        name: String(ban.TenBan || ''),
      })),
    }, 'Gan ban cho dat ban thanh cong');
  }

  async kiemTraMaGiamGia(payload: BanGhi) {
    const maCode = String(payload.maCode || '').trim();
    const tongTien = Number(payload.tongTien || 0);
    const [ma] = await this.mysql.truyVan('SELECT * FROM MaGiamGia WHERE MaCode = ? LIMIT 1', [maCode]);
    if (!ma) {
      throw new NotFoundException('Khong tim thay ma giam gia.');
    }
    if (tongTien < Number(ma.DonHangToiThieu || 0)) {
      throw new BadRequestException('Don hang chua du dieu kien ap dung ma giam gia.');
    }

    const laPhanTram = String(ma.LoaiGiam || '').toLowerCase() === 'phantram';
    const giaTriGiam = Number(ma.GiaTri || 0);
    const giamToiDa = ma.GiaTriToiDa == null ? null : Number(ma.GiaTriToiDa);
    const soTienGiamTamTinh = laPhanTram ? Math.round((tongTien * giaTriGiam) / 100) : giaTriGiam;
    const soTienGiamThucTe = giamToiDa == null ? soTienGiamTamTinh : Math.min(soTienGiamTamTinh, giamToiDa);

    return this.taoPhanHoi({
      hopLe: true,
      maGiamGia: ma.MaCode,
      tenGiamGia: ma.TenCode,
      loaiGiam: ma.LoaiGiam,
      giaTriGiam,
      giamToiDa,
      dieuKienToiThieu: Number(ma.DonHangToiThieu || 0),
      soTienGiamThucTe,
      thongDiep: '',
      maCode: ma.MaCode,
      tenCode: ma.TenCode,
      giaTri: giaTriGiam,
      giaTriToiDa: giamToiDa,
      donHangToiThieu: Number(ma.DonHangToiThieu || 0),
      moTa: '',
    }, 'Kiem tra ma giam gia thanh cong');
  }

  async layDanhSachDanhGia() {
    const danhSach = await this.mysql.truyVan(
      `SELECT dg.*, kh.TenKH, nd.Email
       FROM DanhGia dg
       LEFT JOIN KhachHang kh ON kh.MaKH = dg.MaKH
       LEFT JOIN NguoiDung nd ON nd.MaND = kh.MaND
       ORDER BY dg.NgayDanhGia DESC`,
    );
    return this.taoPhanHoi(danhSach.map((danhGia) => ({
      maDanhGia: danhGia.MaDanhGia,
      maKH: danhGia.MaKH,
      maDonHang: danhGia.MaDonHang,
      soSao: Number(danhGia.SoSao || 0),
      noiDung: danhGia.NoiDung || '',
      phanHoi: danhGia.PhanHoi || '',
      hinhAnh: this.chuyenDuLieuHinhAnhDanhGia(danhGia.HinhAnh),
      soLuotHuuIch: Number(danhGia.SoLuotHuuIch || 0),
      trangThai: danhGia.TrangThai,
      ngayDanhGia: danhGia.NgayDanhGia,
      tenKhachHang: danhGia.TenKH || '',
      email: danhGia.Email || '',
    })), 'Lay danh sach danh gia thanh cong');
  }

  async taoDanhGia(payload: BanGhi) {
    const maDanhGia = String(payload.maDanhGia || this.taoMa('DG'));
    const maKH = String(payload.maKH || '').trim();
    const maDonHang = String(payload.maDonHang || '').trim();
    const hinhAnh = this.chuyenHinhAnhDanhGia(payload.hinhAnh);

    if (!maKH || !maDonHang) {
      throw new BadRequestException('Thieu ma khach hang hoac ma don hang de tao danh gia.');
    }

    try {
      await this.mysql.thucThi(
        'INSERT INTO DanhGia (MaDanhGia, MaKH, MaDonHang, SoSao, NoiDung, PhanHoi, HinhAnh, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [maDanhGia, maKH, maDonHang, Number(payload.soSao || 0), payload.noiDung || null, null, hinhAnh, 'Pending'],
      );
    } catch (loi) {
      if (loi instanceof ServiceUnavailableException && String(loi.message).includes('Duplicate entry')) {
        throw new ConflictException('Khach hang da danh gia don hang nay roi.');
      }

      if (String(loi?.message || '').includes('HinhAnh') || String(loi?.code || '').includes('ER_BAD_FIELD_ERROR')) {
        try {
          await this.mysql.thucThi('ALTER TABLE DanhGia ADD COLUMN IF NOT EXISTS HinhAnh LONGTEXT NULL');
          await this.mysql.thucThi(
            'INSERT INTO DanhGia (MaDanhGia, MaKH, MaDonHang, SoSao, NoiDung, PhanHoi, HinhAnh, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [maDanhGia, maKH, maDonHang, Number(payload.soSao || 0), payload.noiDung || null, null, hinhAnh, 'Pending'],
          );
        } catch {
          await this.mysql.thucThi(
            'INSERT INTO DanhGia (MaDanhGia, MaKH, MaDonHang, SoSao, NoiDung, PhanHoi, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [maDanhGia, maKH, maDonHang, Number(payload.soSao || 0), payload.noiDung || null, null, 'Pending'],
          );
        }
      } else {
        throw loi;
      }
    }

    return this.taoPhanHoi({ maDanhGia, ...payload, maKH, maDonHang, hinhAnh, trangThai: 'Pending' }, 'Tao danh gia thanh cong');
  }

  async duyetDanhGia(maDanhGia: string, payload: BanGhi) {
    const [danhGiaHienTai] = await this.mysql.truyVan('SELECT * FROM DanhGia WHERE MaDanhGia = ? LIMIT 1', [maDanhGia]);
    if (!danhGiaHienTai) {
      throw new NotFoundException('Khong tim thay danh gia.');
    }

    await this.mysql.thucThi('UPDATE DanhGia SET TrangThai = ?, PhanHoi = ? WHERE MaDanhGia = ?', [payload.trangThai, payload.phanHoi || null, maDanhGia]);
    const [danhGia] = await this.mysql.truyVan('SELECT * FROM DanhGia WHERE MaDanhGia = ? LIMIT 1', [maDanhGia]);
    return this.taoPhanHoi({
      maDanhGia: danhGia.MaDanhGia,
      maKH: danhGia.MaKH,
      maDonHang: danhGia.MaDonHang,
      soSao: Number(danhGia.SoSao || 0),
      noiDung: danhGia.NoiDung || '',
      phanHoi: danhGia.PhanHoi || '',
      trangThai: danhGia.TrangThai,
      ngayDanhGia: danhGia.NgayDanhGia,
    }, 'Duyet danh gia thanh cong');
  }

  async taoDonMangVe(payload: BanGhi) {
    const chiTiet = this.chuanHoaDanhSachChiTiet(payload.chiTiet, 'CTMV');
    const danhSachMon = this.chuanHoaDanhSachChiTiet(payload.danhSachMon, 'CTMV');
    const items = this.chuanHoaDanhSachChiTiet(payload.items, 'CTMV');

    const duLieu = await this.taoDonHang({
      ...payload,
      maDonHang: payload.maDonHang || this.taoMa('DHMV'),
      loaiDon: payload.loaiDon || 'MANG_VE_PICKUP',
      chiTiet: chiTiet.length ? chiTiet : (danhSachMon.length ? danhSachMon : items),
    }, payload.loaiDon || 'MANG_VE_PICKUP');
    return duLieu;
  }

  async layDonMangVe(maDonHang: string) {
    return this.layChiTietDonHang(maDonHang);
  }

  async layDonMangVeChoAdmin() {
    const danhSach = await this.mysql.truyVan(
      `SELECT dh.*, kh.TenKH, kh.SDT
       FROM DonHang dh
       LEFT JOIN KhachHang kh ON kh.MaKH = dh.MaKH
       WHERE dh.LoaiDon IN ('MANG_VE_PICKUP', 'MANG_VE_GIAO_HANG')
       ORDER BY dh.NgayTao DESC`,
    );
    const ketQua = await Promise.all(danhSach.map(async (don) => {
      const danhSachMon = await this.layChiTietDonHangTheoMa(String(don.MaDonHang));

      return {
        MaDonHang: don.MaDonHang,
        MaKH: don.MaKH,
        HoTen: don.TenKH || '',
        SoDienThoai: don.SDT || '',
        LoaiDon: don.LoaiDon,
        GioLayHang: '',
        GioGiao: '',
        DiaChiGiao: don.DiaChiGiao || '',
        PhiShip: Number(don.PhiShip || 0),
        TongTien: Number(don.TongTien || 0),
        TrangThai: don.TrangThai,
        NgayTao: don.NgayTao,
        DanhSachMon: danhSachMon.map((mon) => ({
          MaChiTiet: mon.MaChiTiet,
          MaMon: mon.MaMon,
          TenMon: mon.TenMon,
          SoLuong: mon.SoLuong,
          DonGia: mon.DonGia,
          ThanhTien: mon.ThanhTien,
          GhiChu: mon.GhiChu,
          TrangThai: mon.TrangThai,
        })),
      };
    }));

    return this.taoPhanHoi(ketQua, 'Lay don mang ve cho admin thanh cong');
  }

  async layLichSuDonMangVe(dauTrang?: string) {
    return this.layDonHangCuaToi(dauTrang);
  }

  async huyDonMangVe(maDonHang: string) {
    return this.capNhatTrangThaiDonHang(maDonHang, 'Cancelled');
  }

  async taoOrderTaiBan(maBan: string, payload: BanGhi) {
    const chiTiet = this.chuanHoaDanhSachChiTiet(payload.chiTiet, 'CTBAN');
    const danhSachMon = this.chuanHoaDanhSachChiTiet(payload.danhSachMon, 'CTBAN');
    const items = this.chuanHoaDanhSachChiTiet(payload.items, 'CTBAN');

    return this.taoDonHang({
      ...payload,
      maBan,
      maDonHang: payload.maDonHang || this.taoMa('DH'),
      chiTiet: chiTiet.length ? chiTiet : (danhSachMon.length ? danhSachMon : items),
      nguonTao: 'QRCode',
      loaiDon: 'TAI_BAN',
    }, 'TAI_BAN');
  }

  async layOrderDangMoTaiBan(maBan: string) {
    const danhSach = await this.mysql.truyVan(
      "SELECT * FROM DonHang WHERE (MaBan = ? OR MaBanAn = ?) AND TrangThai NOT IN ('Paid', 'Cancelled') ORDER BY NgayTao DESC LIMIT 1",
      [maBan, maBan],
    );
    if (!danhSach[0]) {
      return this.taoPhanHoi(null, 'Ban chua co order dang mo');
    }
    return this.layChiTietDonHang(String(danhSach[0].MaDonHang));
  }

  async yeuCauThanhToanTaiBan(maBan: string) {
    const danhSach = await this.mysql.truyVan(
      "SELECT * FROM DonHang WHERE (MaBan = ? OR MaBanAn = ?) AND TrangThai NOT IN ('Paid', 'Cancelled') ORDER BY NgayTao DESC LIMIT 1",
      [maBan, maBan],
    );
    if (!danhSach[0]) {
      throw new NotFoundException('Ban chua co order de thanh toan.');
    }
    await this.mysql.thucThi('UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?', ['Ready', danhSach[0].MaDonHang]);
    await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Reserved', maBan]);
    return this.layChiTietDonHang(String(danhSach[0].MaDonHang));
  }

  async xacNhanThanhToanTaiBan(maBan: string) {
    const danhSach = await this.mysql.truyVan(
      "SELECT * FROM DonHang WHERE (MaBan = ? OR MaBanAn = ?) AND TrangThai NOT IN ('Paid', 'Cancelled') ORDER BY NgayTao DESC LIMIT 1",
      [maBan, maBan],
    );
    if (!danhSach[0]) {
      throw new NotFoundException('Ban chua co order de xac nhan thanh toan.');
    }
    return this.capNhatTrangThaiDonHang(String(danhSach[0].MaDonHang), 'Paid');
  }
}
