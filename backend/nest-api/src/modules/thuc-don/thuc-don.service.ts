import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { AuthService } from '../auth/auth.service';

type BanGhi = Record<string, any>;

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

  async taoMon(authorization: string | undefined, payload: BanGhi) {
    this.yeuCauQuyenQuanTri(authorization);

    const maMon = String(payload.maMon || `M_${Date.now()}_${Math.floor(Math.random() * 1000)}`).trim();
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

  async capNhatMon(authorization: string | undefined, maMon: string, payload: BanGhi) {
    this.yeuCauQuyenQuanTri(authorization);

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

  async xoaMon(authorization: string | undefined, maMon: string) {
    this.yeuCauQuyenQuanTri(authorization);

    await this.mysql.thucThi('UPDATE ThucDon SET TrangThai = ? WHERE MaMon = ?', ['Deleted', maMon]);
    return this.taoPhanHoi({ maMon }, 'Xoa mon thanh cong');
  }
}
