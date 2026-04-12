import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { MySqlService } from '../../database/mysql/mysql.service';
import { taoPhanHoi } from '../../common/phan-hoi';
import { chuanHoaVaiTroNoiBo } from '../../common/vai-tro';

type BanGhi = Record<string, any>;

@Injectable()
export class AuthService {
  constructor(private readonly mysql: MySqlService) {}

  private readonly jwtSecret = this.docBienMoiTruongBatBuoc('JWT_SECRET');
  private readonly jwtIssuer = this.docBienMoiTruongBatBuoc('JWT_ISSUER');
  private readonly jwtAudience = this.docBienMoiTruongBatBuoc('JWT_AUDIENCE');
  private readonly jwtExpiresIn = this.docBienMoiTruongBatBuoc('JWT_EXPIRES_IN');

  private docBienMoiTruongBatBuoc(tenBien: string) {
    const giaTri = process.env[tenBien]?.trim();

    if (!giaTri) {
      throw new Error(`Thiếu biến môi trường bắt buộc: ${tenBien}`);
    }

    return giaTri;
  }

  taoPhanHoi(duLieu: unknown, thongDiep = 'Thanh cong', meta: unknown = null) {
    return taoPhanHoi(duLieu, thongDiep, meta);
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

  yeuCauDangNhapNoiBo(dauTrang?: string) {
    const thongTinToken = this.giaiMaNguoiDung(dauTrang);
    const vaiTro = chuanHoaVaiTroNoiBo(String(thongTinToken.vaiTro || ''));

    if (vaiTro === 'KhachHang') {
      throw new UnauthorizedException('Tai khoan nay khong co quyen truy cap khu vuc noi bo.');
    }

    return thongTinToken;
  }

  yeuCauQuyenQuanTri(dauTrang?: string) {
    const thongTinToken = this.yeuCauDangNhapNoiBo(dauTrang);
    const vaiTro = chuanHoaVaiTroNoiBo(String(thongTinToken.vaiTro || ''));

    if (vaiTro !== 'Admin') {
      throw new ForbiddenException('Ban khong co quyen thuc hien thao tac quan tri nay.');
    }

    return thongTinToken;
  }

  yeuCauQuyenNhanVienHoacQuanTri(dauTrang?: string) {
    const thongTinToken = this.yeuCauDangNhapNoiBo(dauTrang);
    const vaiTro = chuanHoaVaiTroNoiBo(String(thongTinToken.vaiTro || ''));

    if (vaiTro !== 'Admin' && vaiTro !== 'NhanVien') {
      throw new ForbiddenException('Ban khong co quyen thuc hien thao tac noi bo nay.');
    }

    return thongTinToken;
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

  private async layNguoiDungTheoEmail(email: string) {
    const danhSach = await this.mysql.truyVan('SELECT * FROM NguoiDung WHERE Email = ? LIMIT 1', [email]);
    return danhSach[0] || null;
  }

  private async layKhachHangTheoMaNd(maND: string) {
    const danhSach = await this.mysql.truyVan('SELECT * FROM KhachHang WHERE MaND = ? LIMIT 1', [maND]);
    return danhSach[0] || null;
  }

  private async layNhanVienTheoMaNd(maND: string) {
    const danhSach = await this.mysql.truyVan('SELECT * FROM NhanVien WHERE MaND = ? LIMIT 1', [maND]);
    return danhSach[0] || null;
  }

  private async layNguoiDungTheoMaNd(maND: string) {
    const danhSach = await this.mysql.truyVan('SELECT * FROM NguoiDung WHERE MaND = ? LIMIT 1', [maND]);
    return danhSach[0] || null;
  }

  private taoMa(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  private taoChucVuNoiBo(vaiTro: string) {
    return vaiTro === 'Admin' ? 'QuanLy' : 'NhanVien';
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

  async dangNhap(email: string, matKhau: string) {
    const nguoiDung = await this.layNguoiDungTheoEmail(String(email || '').trim().toLowerCase());
    if (!nguoiDung) {
      throw new UnauthorizedException('Email hoac mat khau khong dung.');
    }

    const hopLe = await compare(String(matKhau || ''), String(nguoiDung.MatKhau || ''));
    if (!hopLe) {
      throw new UnauthorizedException('Email hoac mat khau khong dung.');
    }

    const khachHang = await this.layKhachHangTheoMaNd(nguoiDung.MaND);
    const user = this.chuyenNguoiDungSangResponse(nguoiDung, khachHang);
    const accessToken = this.taoJwt(nguoiDung);

    return this.taoPhanHoi({ user, accessToken }, 'Dang nhap thanh cong');
  }

  async dangNhapNoiBo(email: string, matKhau: string) {
    const nguoiDung = await this.layNguoiDungTheoEmail(String(email || '').trim().toLowerCase());
    if (!nguoiDung) {
      throw new UnauthorizedException('Email hoac mat khau khong dung.');
    }

    const hopLe = await compare(String(matKhau || ''), String(nguoiDung.MatKhau || ''));
    if (!hopLe) {
      throw new UnauthorizedException('Email hoac mat khau khong dung.');
    }

    if (nguoiDung.VaiTro === 'KhachHang') {
      throw new UnauthorizedException('Tai khoan nay khong co quyen dang nhap noi bo.');
    }

    const khachHang = await this.layKhachHangTheoMaNd(nguoiDung.MaND);
    const user = this.chuyenNguoiDungSangResponse(nguoiDung, khachHang);
    const accessToken = this.taoJwt(nguoiDung);

    return this.taoPhanHoi({ user, accessToken }, 'Dang nhap thanh cong');
  }

  dangXuat() {
    return this.taoPhanHoi(null, 'Dang xuat thanh cong');
  }

  async layThongTinToi(authorization?: string) {
    const thongTinToken = this.giaiMaNguoiDung(authorization);
    const nguoiDung = await this.layNguoiDungTheoMaNd(String(thongTinToken.maND));
    if (!nguoiDung) {
      throw new NotFoundException('Khong tim thay nguoi dung.');
    }

    const khachHang = await this.layKhachHangTheoMaNd(nguoiDung.MaND);
    return this.taoPhanHoi(this.chuyenNguoiDungSangResponse(nguoiDung, khachHang), 'Lay thong tin thanh cong');
  }

  async layDanhSachNguoiDung(authorization?: string) {
    this.yeuCauQuyenQuanTri(authorization);

    const danhSachNguoiDung = await this.mysql.truyVan(
      'SELECT nd.MaND, nd.TenND, nd.Email, nd.VaiTro, nd.TrangThai, kh.MaKH, kh.SDT, kh.DiaChi, kh.DiemTichLuy, nv.MaNV, nv.ChucVu, nv.HoTen, nv.TinhTrang FROM NguoiDung nd LEFT JOIN KhachHang kh ON kh.MaND = nd.MaND LEFT JOIN NhanVien nv ON nv.MaND = nd.MaND ORDER BY nd.MaND ASC',
    );

    return this.taoPhanHoi(
      danhSachNguoiDung.map((nguoiDung) => ({
        maND: nguoiDung.MaND,
        maKH: nguoiDung.MaKH || '',
        maNV: nguoiDung.MaNV || '',
        tenND: nguoiDung.TenND,
        hoTen: nguoiDung.HoTen || nguoiDung.TenND,
        email: nguoiDung.Email,
        sdt: nguoiDung.SDT || '',
        vaiTro: nguoiDung.VaiTro,
        trangThai: nguoiDung.TrangThai,
        tinhTrangNhanVien: nguoiDung.TinhTrang || '',
        chucVu: nguoiDung.ChucVu || '',
        diaChi: nguoiDung.DiaChi || '',
        diemTichLuy: Number(nguoiDung.DiemTichLuy || 0),
      })),
      'Lay danh sach nguoi dung thanh cong',
    );
  }

  async taoNguoiDungNoiBo(authorization: string | undefined, payload: BanGhi) {
    this.yeuCauQuyenQuanTri(authorization);

    const hoTen = String(payload.hoTen || '').trim();
    const email = String(payload.email || '').trim().toLowerCase();
    const soDienThoai = String(payload.soDienThoai || '').trim();
    const matKhau = String(payload.matKhau || '').trim();
    const xacNhanMatKhau = String(payload.xacNhanMatKhau || '').trim();
    const vaiTro = this.chuanHoaVaiTroNoiBo(String(payload.vaiTro || 'NhanVien').trim());
    const trangThai = String(payload.trangThai || 'Active').trim() || 'Active';
    const chucVu = String(payload.chucVu || this.taoChucVuNoiBo(vaiTro)).trim();

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
    const maNV = this.taoMa('NV');
    const matKhauMaHoa = await hash(matKhau, 10);

    await this.mysql.thucThi(
      'INSERT INTO NguoiDung (MaND, TenND, Email, MatKhau, VaiTro, TrangThai) VALUES (?, ?, ?, ?, ?, ?)',
      [maND, hoTen, email, matKhauMaHoa, vaiTro, trangThai],
    );

    await this.mysql.thucThi(
      'INSERT INTO NhanVien (MaNV, MaND, HoTen, SDT, ChucVu, TinhTrang) VALUES (?, ?, ?, ?, ?, ?)',
      [maNV, maND, hoTen, soDienThoai || null, chucVu || this.taoChucVuNoiBo(vaiTro), trangThai === 'Active' ? 'Active' : 'Inactive'],
    );

    const nguoiDung = await this.layNguoiDungTheoMaNd(maND);
    const nhanVien = await this.layNhanVienTheoMaNd(maND);

    return this.taoPhanHoi({
      maND: nguoiDung?.MaND || maND,
      maNV: nhanVien?.MaNV || maNV,
    }, 'Tao nhan vien thanh cong');
  }

  async capNhatNguoiDungNoiBo(authorization: string | undefined, maND: string, payload: BanGhi) {
    this.yeuCauQuyenQuanTri(authorization);

    const nguoiDung = await this.layNguoiDungTheoMaNd(maND);
    if (!nguoiDung) {
      throw new NotFoundException('Khong tim thay nguoi dung.');
    }

    const hoTen = String(payload.hoTen || nguoiDung.TenND || '').trim();
    const email = String(payload.email || nguoiDung.Email || '').trim().toLowerCase();
    const soDienThoai = String(payload.soDienThoai || '').trim();
    const vaiTro = this.chuanHoaVaiTroNoiBo(String(payload.vaiTro || nguoiDung.VaiTro || 'NhanVien').trim());
    const trangThai = String(payload.trangThai || nguoiDung.TrangThai || 'Active').trim() || 'Active';
    const chucVu = String(payload.chucVu || this.taoChucVuNoiBo(vaiTro)).trim();

    const nguoiDungCungEmail = await this.layNguoiDungTheoEmail(email);
    if (nguoiDungCungEmail && String(nguoiDungCungEmail.MaND) !== maND) {
      throw new BadRequestException('Email da ton tai.');
    }

    await this.mysql.thucThi(
      'UPDATE NguoiDung SET TenND = ?, Email = ?, VaiTro = ?, TrangThai = ? WHERE MaND = ?',
      [hoTen, email, vaiTro, trangThai, maND],
    );

    const nhanVienHienTai = await this.layNhanVienTheoMaNd(maND);
    const tinhTrangNhanVien = trangThai === 'Active' ? 'Active' : 'Inactive';

    if (nhanVienHienTai) {
      await this.mysql.thucThi(
        'UPDATE NhanVien SET HoTen = ?, SDT = ?, ChucVu = ?, TinhTrang = ? WHERE MaND = ?',
        [hoTen, soDienThoai || null, chucVu || this.taoChucVuNoiBo(vaiTro), tinhTrangNhanVien, maND],
      );
    } else {
      await this.mysql.thucThi(
        'INSERT INTO NhanVien (MaNV, MaND, HoTen, SDT, ChucVu, TinhTrang) VALUES (?, ?, ?, ?, ?, ?)',
        [this.taoMa('NV'), maND, hoTen, soDienThoai || null, chucVu || this.taoChucVuNoiBo(vaiTro), tinhTrangNhanVien],
      );
    }

    if (payload.matKhau) {
      const matKhau = String(payload.matKhau || '').trim();
      const xacNhanMatKhau = String(payload.xacNhanMatKhau || '').trim();

      if (!matKhau) {
        throw new BadRequestException('Mat khau moi khong hop le.');
      }

      if (matKhau !== xacNhanMatKhau) {
        throw new BadRequestException('Xac nhan mat khau khong khop.');
      }

      await this.mysql.thucThi('UPDATE NguoiDung SET MatKhau = ? WHERE MaND = ?', [await hash(matKhau, 10), maND]);
    }

    return this.taoPhanHoi({ maND }, 'Cap nhat nhan vien thanh cong');
  }

  async xoaNguoiDungNoiBo(authorization: string | undefined, maND: string) {
    this.yeuCauQuyenQuanTri(authorization);

    const nguoiDung = await this.layNguoiDungTheoMaNd(maND);
    if (!nguoiDung) {
      throw new NotFoundException('Khong tim thay nguoi dung.');
    }

    if (String(nguoiDung.VaiTro) === 'KhachHang') {
      throw new BadRequestException('Chi co the xoa tai khoan nhan vien hoac quan ly.');
    }

    await this.mysql.thucThi('DELETE FROM NhanVien WHERE MaND = ?', [maND]);
    await this.mysql.thucThi('DELETE FROM NguoiDung WHERE MaND = ?', [maND]);

    return this.taoPhanHoi(null, 'Xoa nhan vien thanh cong');
  }

  async capNhatHoSo(authorization: string | undefined, payload: BanGhi) {
    const thongTinToken = this.giaiMaNguoiDung(authorization);
    const maND = String(thongTinToken.maND);
    const hoTen = String(payload.hoTen || '').trim();
    const email = String(payload.email || '').trim().toLowerCase();
    const soDienThoai = String(payload.soDienThoai || '').trim();
    const diaChi = String(payload.diaChi || '').trim();

    await this.mysql.thucThi('UPDATE NguoiDung SET TenND = ?, Email = ? WHERE MaND = ?', [hoTen, email, maND]);
    await this.mysql.thucThi('UPDATE KhachHang SET TenKH = ?, SDT = ?, DiaChi = ? WHERE MaND = ?', [hoTen, soDienThoai || null, diaChi || null, maND]);

    return this.layThongTinToi(`Bearer ${this.taoJwt(await this.layNguoiDungTheoMaNd(maND))}`);
  }

  async doiMatKhau(authorization: string | undefined, payload: BanGhi) {
    const thongTinToken = this.giaiMaNguoiDung(authorization);
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
}
