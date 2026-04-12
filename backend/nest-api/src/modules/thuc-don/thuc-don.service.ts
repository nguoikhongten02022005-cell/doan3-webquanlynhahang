import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { AuthService } from '../auth/auth.service';
import { CapNhatMonDto } from './dto/cap-nhat-mon.dto';
import { TaoMonDto } from './dto/tao-mon.dto';

interface DanhMucEntity {
  MaDanhMuc: string;
  TenDanhMuc: string | null;
}

interface ThucDonEntity {
  MaMon: string;
  MaDanhMuc: string | null;
  TenMon: string;
  MoTa: string | null;
  Gia: number | string | null;
  HinhAnh: string | null;
  ThoiGianChuanBi: number | string | null;
  TrangThai: string | null;
}

@Injectable()
export class ThucDonService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly authService: AuthService,
  ) {}

  taoPhanHoi(duLieu: unknown, thongDiep = 'Thanh cong', meta: unknown = null) {
    return { success: true, data: duLieu, message: thongDiep, meta };
  }

  yeuCauQuyenQuanTri(authorization: string | undefined) {
    return this.authService.yeuCauQuyenQuanTri(authorization);
  }

  private chuanHoaChuoiKhongDau(giaTri: string) {
    return String(giaTri || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  }

  private async timMaDanhMucHopLe(giaTriDanhMuc: string | undefined) {
    const giaTri = String(giaTriDanhMuc || '').trim();
    if (!giaTri) {
      return null;
    }

    const danhSachDanhMuc = await this.mysql.truyVan(
      'SELECT MaDanhMuc, TenDanhMuc FROM DanhMuc WHERE MaDanhMuc = ? OR TenDanhMuc = ?',
      [giaTri, giaTri],
    ) as DanhMucEntity[];

    const khoaTim = this.chuanHoaChuoiKhongDau(giaTri);
    const danhMucKhopChuanHoa = danhSachDanhMuc.find(
      (danhMuc) => this.chuanHoaChuoiKhongDau(String(danhMuc.TenDanhMuc || '')) === khoaTim,
    );
    if (danhMucKhopChuanHoa?.MaDanhMuc) {
      return String(danhMucKhopChuanHoa.MaDanhMuc);
    }

    if (danhSachDanhMuc[0]?.MaDanhMuc) {
      return String(danhSachDanhMuc[0].MaDanhMuc);
    }

    const tatCaDanhMuc = await this.mysql.truyVan('SELECT MaDanhMuc, TenDanhMuc FROM DanhMuc') as DanhMucEntity[];
    const danhMucTheoTen = tatCaDanhMuc.find(
      (danhMuc) => this.chuanHoaChuoiKhongDau(String(danhMuc.TenDanhMuc || '')) === khoaTim,
    );

    return danhMucTheoTen?.MaDanhMuc ? String(danhMucTheoTen.MaDanhMuc) : null;
  }

  private chuyenMonSangPhanHoi(mon: ThucDonEntity) {
    return {
      maMon: mon.MaMon,
      maDanhMuc: mon.MaDanhMuc,
      tenMon: mon.TenMon,
      moTa: mon.MoTa,
      gia: Number(mon.Gia || 0),
      hinhAnh: mon.HinhAnh,
      thoiGianChuanBi: Number(mon.ThoiGianChuanBi || 0),
      trangThai: mon.TrangThai,
    };
  }

  async layThucDon() {
    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM ThucDon WHERE TrangThai <> ? ORDER BY NgayCapNhat DESC',
      ['Deleted'],
    ) as ThucDonEntity[];

    return this.taoPhanHoi(danhSach.map((mon) => this.chuyenMonSangPhanHoi(mon)), 'Lay thuc don thanh cong');
  }

  async taoMon(authorization: string | undefined, payload: TaoMonDto) {
    this.yeuCauQuyenQuanTri(authorization);

    const maMon = String(payload.maMon || `M_${Date.now()}_${Math.floor(Math.random() * 1000)}`).trim();
    const maDanhMuc = await this.timMaDanhMucHopLe(payload.maDanhMuc);
    const tenMon = String(payload.tenMon || '').trim();
    const moTa = payload.moTa == null || String(payload.moTa).trim() === '' ? null : String(payload.moTa).trim();
    const hinhAnh = payload.hinhAnh == null || String(payload.hinhAnh).trim() === '' ? null : String(payload.hinhAnh).trim();
    const thoiGianChuanBi = Number(payload.thoiGianChuanBi ?? 0);
    const trangThai = String(payload.trangThai || 'Available').trim() || 'Available';

    if (!maDanhMuc) {
      throw new BadRequestException('Ma danh muc khong hop le.');
    }

    await this.mysql.thucThi(
      'INSERT INTO ThucDon (MaMon, MaDanhMuc, TenMon, MoTa, Gia, HinhAnh, ThoiGianChuanBi, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [maMon, maDanhMuc, tenMon, moTa, Number(payload.gia || 0), hinhAnh, thoiGianChuanBi, trangThai],
    );
    const danhSach = await this.mysql.truyVan('SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1', [maMon]) as ThucDonEntity[];

    return this.taoPhanHoi(this.chuyenMonSangPhanHoi(danhSach[0]), 'Tao mon thanh cong');
  }

  async capNhatMon(authorization: string | undefined, maMon: string, payload: CapNhatMonDto) {
    this.yeuCauQuyenQuanTri(authorization);

    const danhSachHienTai = await this.mysql.truyVan('SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1', [maMon]) as ThucDonEntity[];
    const monHienTai = danhSachHienTai[0];
    if (!monHienTai) {
      throw new NotFoundException('Khong tim thay mon an.');
    }

    const maDanhMuc = payload.maDanhMuc == null
      ? monHienTai.MaDanhMuc
      : await this.timMaDanhMucHopLe(payload.maDanhMuc);
    const tenMon = payload.tenMon == null ? monHienTai.TenMon : String(payload.tenMon).trim();
    const moTa = payload.moTa === undefined ? monHienTai.MoTa : (payload.moTa == null || String(payload.moTa).trim() === '' ? null : String(payload.moTa).trim());
    const hinhAnh = payload.hinhAnh === undefined ? monHienTai.HinhAnh : (payload.hinhAnh == null || String(payload.hinhAnh).trim() === '' ? null : String(payload.hinhAnh).trim());
    const thoiGianChuanBi = payload.thoiGianChuanBi == null ? Number(monHienTai.ThoiGianChuanBi || 0) : Number(payload.thoiGianChuanBi);
    const trangThai = payload.trangThai == null ? String(monHienTai.TrangThai || 'Available') : String(payload.trangThai).trim() || 'Available';
    const gia = payload.gia == null ? Number(monHienTai.Gia || 0) : Number(payload.gia);

    if (!tenMon) {
      throw new BadRequestException('Ten mon la bat buoc.');
    }

    if (!maDanhMuc) {
      throw new BadRequestException('Ma danh muc khong hop le.');
    }

    await this.mysql.thucThi(
      'UPDATE ThucDon SET MaDanhMuc = ?, TenMon = ?, MoTa = ?, Gia = ?, HinhAnh = ?, ThoiGianChuanBi = ?, TrangThai = ? WHERE MaMon = ?',
      [
        maDanhMuc,
        tenMon,
        moTa,
        gia,
        hinhAnh,
        thoiGianChuanBi,
        trangThai,
        maMon,
      ],
    );

    const danhSach = await this.mysql.truyVan('SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1', [maMon]) as ThucDonEntity[];
    return this.taoPhanHoi(this.chuyenMonSangPhanHoi(danhSach[0]), 'Cap nhat mon thanh cong');
  }

  async xoaMon(authorization: string | undefined, maMon: string) {
    this.yeuCauQuyenQuanTri(authorization);

    await this.mysql.thucThi('UPDATE ThucDon SET TrangThai = ? WHERE MaMon = ?', ['Deleted', maMon]);
    return this.taoPhanHoi({ maMon }, 'Xoa mon thanh cong');
  }
}
