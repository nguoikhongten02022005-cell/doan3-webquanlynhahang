import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { MySqlService } from './mysql.service';

type BanGhi = Record<string, any>;

@Injectable()
export class ApiService {
  constructor(private readonly mysql: MySqlService) {}

  private readonly jwtSecret = process.env.JWT_SECRET?.trim() || 'phat-trien-linux-nestjs-secret-toi-thieu-32-ky-tu';
  private readonly jwtIssuer = process.env.JWT_ISSUER?.trim() || 'nest-api-quan-ly-nha-hang';
  private readonly jwtAudience = process.env.JWT_AUDIENCE?.trim() || 'quan-ly-nha-hang-frontend';
  private readonly urlFrontend = process.env.FRONTEND_ORIGIN?.trim() || 'http://localhost:5173';

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
        expiresIn: process.env.JWT_EXPIRES_IN || '12h',
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
    await this.mysql.thucThi(
      'INSERT INTO ThucDon (MaMon, MaDanhMuc, TenMon, MoTa, Gia, HinhAnh, ThoiGianChuanBi, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [payload.maMon, payload.maDanhMuc || null, payload.tenMon, payload.moTa || null, Number(payload.gia || 0), payload.hinhAnh || null, Number(payload.thoiGianChuanBi || 0), 'Available'],
    );
    const danhSach = await this.mysql.truyVan('SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1', [payload.maMon]);
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
    await this.mysql.thucThi(
      'UPDATE ThucDon SET MaDanhMuc = ?, TenMon = ?, MoTa = ?, Gia = ?, HinhAnh = ?, ThoiGianChuanBi = ?, TrangThai = ? WHERE MaMon = ?',
      [
        payload.maDanhMuc || null,
        payload.tenMon,
        payload.moTa || null,
        Number(payload.gia || 0),
        payload.hinhAnh || null,
        Number(payload.thoiGianChuanBi || 0),
        payload.trangThai || 'Available',
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

  async taoDonHang(payload: BanGhi, loaiDon?: string) {
    const maDonHang = String(payload.maDonHang || this.taoMa('DH'));
    const chiTiet = Array.isArray(payload.chiTiet) ? payload.chiTiet : [];
    const maBan = payload.maBan || payload.maBanAn || null;
    const nguonTao = payload.nguonTao || 'Online';
    const loaiDonHang = loaiDon || payload.loaiDon || 'TAI_QUAN';

    let tongTien = 0;
    for (const muc of chiTiet) {
      const [mon] = await this.mysql.truyVan('SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1', [muc.maMon]);
      if (!mon) {
        throw new BadRequestException(`Mon ${muc.maMon} khong ton tai.`);
      }
      tongTien += Number(mon.Gia || 0) * Number(muc.soLuong || 0);
    }

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
        Number(payload.phiShip || 0),
        tongTien,
        payload.trangThai || 'Pending',
        nguonTao,
        payload.ghiChu || null,
      ],
    );

    for (const muc of chiTiet) {
      const [mon] = await this.mysql.truyVan('SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1', [muc.maMon]);
      const donGia = muc.donGia == null ? Number(mon.Gia || 0) : Number(muc.donGia || 0);
      const soLuong = Number(muc.soLuong || 0);
      await this.mysql.thucThi(
        'INSERT INTO ChiTietDonHang (MaChiTiet, MaDonHang, MaMon, SoLuong, DonGia, ThanhTien, GhiChu, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [muc.maChiTiet || this.taoMa('CT'), maDonHang, muc.maMon, soLuong, donGia, soLuong * donGia, muc.ghiChu || null, 'Pending'],
      );
    }

    if (maBan) {
      await this.mysql.thucThi('UPDATE Ban SET TrangThai = ? WHERE MaBan = ?', ['Occupied', maBan]);
    }

    return this.layChiTietDonHang(maDonHang);
  }

  async layDanhSachDonHang() {
    const danhSach = await this.mysql.truyVan(
      `SELECT dh.*, kh.TenKH, kh.SDT, kh.DiaChi, nd.Email
       FROM DonHang dh
       LEFT JOIN KhachHang kh ON kh.MaKH = dh.MaKH
       LEFT JOIN NguoiDung nd ON nd.MaND = kh.MaND
       ORDER BY dh.NgayTao DESC`,
    );
    const ketQua = await Promise.all(danhSach.map(async (don) => ({
      maDonHang: don.MaDonHang,
      maKH: don.MaKH,
      maBan: don.MaBan || don.MaBanAn,
      maNV: don.MaNV,
      maDatBan: don.MaDatBan,
      tongTien: Number(don.TongTien || 0),
      trangThai: don.TrangThai,
      ghiChu: don.GhiChu || '',
      ngayTao: don.NgayTao,
      loaiDon: don.LoaiDon,
      diaChiGiao: don.DiaChiGiao || '',
      phiShip: Number(don.PhiShip || 0),
      tenKhachHang: don.TenKH || '',
      soDienThoai: don.SDT || '',
      email: don.Email || '',
      diaChiKhachHang: don.DiaChi || '',
      chiTiet: await this.layChiTietDonHangTheoMa(String(don.MaDonHang)),
    })));

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
    return this.taoPhanHoi({
      donHang: {
        maDonHang: donHang.MaDonHang,
        maKH: donHang.MaKH,
        maBan: donHang.MaBan || donHang.MaBanAn,
        maNV: donHang.MaNV,
        maDatBan: donHang.MaDatBan,
        tongTien: Number(donHang.TongTien || 0),
        trangThai: donHang.TrangThai,
        ghiChu: donHang.GhiChu || '',
        ngayTao: donHang.NgayTao,
        loaiDon: donHang.LoaiDon,
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
    return this.taoPhanHoi({
      maCode: ma.MaCode,
      tenCode: ma.TenCode,
      giaTri: Number(ma.GiaTri || 0),
      loaiGiam: ma.LoaiGiam,
      giaTriToiDa: ma.GiaTriToiDa == null ? null : Number(ma.GiaTriToiDa),
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
      trangThai: danhGia.TrangThai,
      ngayDanhGia: danhGia.NgayDanhGia,
      tenKhachHang: danhGia.TenKH || '',
      email: danhGia.Email || '',
    })), 'Lay danh sach danh gia thanh cong');
  }

  async taoDanhGia(payload: BanGhi) {
    const maDanhGia = String(payload.maDanhGia || this.taoMa('DG'));

    try {
      await this.mysql.thucThi(
        'INSERT INTO DanhGia (MaDanhGia, MaKH, MaDonHang, SoSao, NoiDung, PhanHoi, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [maDanhGia, payload.maKH, payload.maDonHang, Number(payload.soSao || 0), payload.noiDung || null, null, 'Pending'],
      );
    } catch (loi) {
      if (loi instanceof ServiceUnavailableException && String(loi.message).includes('Duplicate entry')) {
        throw new ConflictException('Khach hang da danh gia don hang nay roi.');
      }
      throw loi;
    }

    return this.taoPhanHoi({ maDanhGia, ...payload, trangThai: 'Pending' }, 'Tao danh gia thanh cong');
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
