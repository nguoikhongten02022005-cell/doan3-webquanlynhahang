import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MySqlService } from '../../database/mysql/mysql.service';
import { taoPhanHoi } from '../../common/phan-hoi';
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
  constructor(private readonly mysql: MySqlService) {}

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

    const danhSachDanhMuc = (await this.mysql.truyVan(
      'SELECT MaDanhMuc, TenDanhMuc FROM DanhMuc WHERE MaDanhMuc = ? OR TenDanhMuc = ?',
      [giaTri, giaTri],
    )) as DanhMucEntity[];

    const khoaTim = this.chuanHoaChuoiKhongDau(giaTri);
    const danhMucKhopChuanHoa = danhSachDanhMuc.find(
      (danhMuc) =>
        this.chuanHoaChuoiKhongDau(String(danhMuc.TenDanhMuc || '')) ===
        khoaTim,
    );
    if (danhMucKhopChuanHoa?.MaDanhMuc) {
      return String(danhMucKhopChuanHoa.MaDanhMuc);
    }

    if (danhSachDanhMuc[0]?.MaDanhMuc) {
      return String(danhSachDanhMuc[0].MaDanhMuc);
    }

    const tatCaDanhMuc = (await this.mysql.truyVan(
      'SELECT MaDanhMuc, TenDanhMuc FROM DanhMuc',
    )) as DanhMucEntity[];
    const danhMucTheoTen = tatCaDanhMuc.find(
      (danhMuc) =>
        this.chuanHoaChuoiKhongDau(String(danhMuc.TenDanhMuc || '')) ===
        khoaTim,
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

  async layThucDon(chiMonKhaDung = false) {
    const dieuKien = chiMonKhaDung
      ? 'WHERE TrangThai = ?'
      : 'WHERE TrangThai <> ?';
    const thamSo = chiMonKhaDung ? ['Available'] : ['Deleted'];
    const danhSach = (await this.mysql.truyVan(
      `SELECT * FROM ThucDon ${dieuKien} ORDER BY NgayCapNhat DESC`,
      thamSo,
    )) as ThucDonEntity[];

    return taoPhanHoi(
      danhSach.map((mon) => this.chuyenMonSangPhanHoi(mon)),
      'Lấy thực đơn thành công',
    );
  }

  async taoMon(payload: TaoMonDto) {
    const maMon = String(payload.maMon || `M_${randomUUID()}`).trim();
    const maDanhMuc = await this.timMaDanhMucHopLe(payload.maDanhMuc);
    const tenMon = String(payload.tenMon || '').trim();
    const moTa =
      payload.moTa == null || String(payload.moTa).trim() === ''
        ? null
        : String(payload.moTa).trim();
    const hinhAnh =
      payload.hinhAnh == null || String(payload.hinhAnh).trim() === ''
        ? null
        : String(payload.hinhAnh).trim();
    const thoiGianChuanBi = Number(payload.thoiGianChuanBi ?? 0);
    const trangThai =
      String(payload.trangThai || 'Available').trim() || 'Available';

    if (!maDanhMuc) {
      throw new BadRequestException('Mã danh mục không hợp lệ.');
    }

    try {
      await this.mysql.thucThi(
        'INSERT INTO ThucDon (MaMon, MaDanhMuc, TenMon, MoTa, Gia, HinhAnh, ThoiGianChuanBi, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          maMon,
          maDanhMuc,
          tenMon,
          moTa,
          Number(payload.gia || 0),
          hinhAnh,
          thoiGianChuanBi,
          trangThai,
        ],
      );
    } catch (loi) {
      if (loi instanceof Error && /Duplicate entry/i.test(loi.message)) {
        throw new BadRequestException('Mã món đã tồn tại.');
      }
      throw loi;
    }

    const danhSach = (await this.mysql.truyVan(
      'SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1',
      [maMon],
    )) as ThucDonEntity[];
    if (!danhSach[0]) {
      throw new BadRequestException('Không thể tạo món ăn.');
    }

    return taoPhanHoi(
      this.chuyenMonSangPhanHoi(danhSach[0]),
      'Tạo món thành công',
    );
  }

  async capNhatMon(maMon: string, payload: CapNhatMonDto) {
    const danhSachHienTai = (await this.mysql.truyVan(
      'SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1',
      [maMon],
    )) as ThucDonEntity[];
    const monHienTai = danhSachHienTai[0];
    if (!monHienTai) {
      throw new NotFoundException('Không tìm thấy món ăn.');
    }

    const maDanhMuc =
      payload.maDanhMuc == null
        ? monHienTai.MaDanhMuc
        : await this.timMaDanhMucHopLe(payload.maDanhMuc);
    const tenMon =
      payload.tenMon == null
        ? monHienTai.TenMon
        : String(payload.tenMon).trim();
    const moTa =
      payload.moTa === undefined
        ? monHienTai.MoTa
        : payload.moTa == null || String(payload.moTa).trim() === ''
          ? null
          : String(payload.moTa).trim();
    const hinhAnh =
      payload.hinhAnh === undefined
        ? monHienTai.HinhAnh
        : payload.hinhAnh == null || String(payload.hinhAnh).trim() === ''
          ? null
          : String(payload.hinhAnh).trim();
    const thoiGianChuanBi =
      payload.thoiGianChuanBi == null
        ? Number(monHienTai.ThoiGianChuanBi || 0)
        : Number(payload.thoiGianChuanBi);
    const trangThai =
      payload.trangThai == null
        ? String(monHienTai.TrangThai || 'Available')
        : String(payload.trangThai).trim() || 'Available';
    const gia =
      payload.gia == null ? Number(monHienTai.Gia || 0) : Number(payload.gia);

    if (!tenMon) {
      throw new BadRequestException('Tên món là bắt buộc.');
    }

    if (!maDanhMuc) {
      throw new BadRequestException('Mã danh mục không hợp lệ.');
    }

    const ketQua = await this.mysql.thucThi(
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

    if (ketQua.affectedRows === 0) {
      throw new NotFoundException('Không tìm thấy món ăn.');
    }

    const danhSach = (await this.mysql.truyVan(
      'SELECT * FROM ThucDon WHERE MaMon = ? LIMIT 1',
      [maMon],
    )) as ThucDonEntity[];
    if (!danhSach[0]) {
      throw new BadRequestException('Không thể cập nhật món ăn.');
    }
    return taoPhanHoi(
      this.chuyenMonSangPhanHoi(danhSach[0]),
      'Cập nhật món thành công',
    );
  }

  async xoaMon(maMon: string) {
    const ketQua = await this.mysql.thucThi(
      'UPDATE ThucDon SET TrangThai = ? WHERE MaMon = ?',
      ['Deleted', maMon],
    );

    if (ketQua.affectedRows === 0) {
      throw new NotFoundException('Không tìm thấy món ăn.');
    }

    return taoPhanHoi({ maMon }, 'Xóa món thành công');
  }
}
