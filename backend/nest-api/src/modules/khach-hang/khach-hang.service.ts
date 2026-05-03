import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { taoPhanHoi } from '../../common/phan-hoi';

type BanGhi = Record<string, any>;

@Injectable()
export class KhachHangService {
  constructor(private readonly mysql: MySqlService) {}

  private taoMa(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  private taoPhanHoi(
    duLieu: unknown,
    thongDiep = 'Thanh cong',
    meta: unknown = null,
  ) {
    return taoPhanHoi(duLieu, thongDiep, meta);
  }

  private chuyenKhachHangSangResponse(kh: BanGhi) {
    return {
      maKH: kh.MaKH,
      maND: kh.MaND || null,
      tenKH: kh.TenKH,
      sdt: kh.SDT || '',
      diaChi: kh.DiaChi || '',
      diemTichLuy: Number(kh.DiemTichLuy || 0),
      ngayTao: kh.NgayTao,
      coTaiKhoan: !!kh.MaND,
    };
  }

  async layDanhSach(params: {
    tuKhoa?: string;
    phanLoai?: string;
    sapXep?: string;
    thuTu?: string;
    trang?: number;
    soLuong?: number;
  }) {
    const {
      tuKhoa = '',
      phanLoai = 'tat-ca',
      sapXep = 'ngay-tao',
      thuTu = 'desc',
      trang = 1,
      soLuong = 10,
    } = params;

    let whereClause = '1=1';
    const queryParams: any[] = [];

    if (tuKhoa) {
      whereClause +=
        ' AND (kh.TenKH LIKE ? OR kh.SDT LIKE ? OR kh.MaKH LIKE ?)';
      queryParams.push(`%${tuKhoa}%`, `%${tuKhoa}%`, `%${tuKhoa}%`);
    }

    if (phanLoai === 'co-tai-khoan') {
      whereClause += ' AND kh.MaND IS NOT NULL';
    } else if (phanLoai === 'vang-lai') {
      whereClause += ' AND kh.MaND IS NULL';
    }

    const allowedSorts: Record<string, string> = {
      ten: 'kh.TenKH',
      diem: 'kh.DiemTichLuy',
      'ngay-tao': 'kh.NgayTao',
    };
    const sortCol = allowedSorts[sapXep] || 'kh.NgayTao';
    const sortDir = thuTu === 'asc' ? 'ASC' : 'DESC';

    const countResult = await this.mysql.truyVan(
      `SELECT COUNT(*) as total FROM KhachHang kh WHERE ${whereClause}`,
      queryParams,
    );
    const tongSo = Number(countResult[0]?.total || 0);

    const offset = (Math.max(1, trang) - 1) * soLuong;
    const danhSach = await this.mysql.truyVan(
      `SELECT kh.* FROM KhachHang kh WHERE ${whereClause} ORDER BY ${sortCol} ${sortDir} LIMIT ? OFFSET ?`,
      [...queryParams, soLuong, offset],
    );

    return this.taoPhanHoi(
      danhSach.map((kh) => this.chuyenKhachHangSangResponse(kh)),
      'Lay danh sach khach hang thanh cong',
      { tongSo, trang, soLuong, soTrang: Math.ceil(tongSo / soLuong) },
    );
  }

  async layChiTiet(maKH: string) {
    const danhSach = await this.mysql.truyVan(
      'SELECT * FROM KhachHang WHERE MaKH = ? LIMIT 1',
      [maKH],
    );
    if (!danhSach[0]) throw new NotFoundException('Khong tim thay khach hang.');
    return this.taoPhanHoi(
      this.chuyenKhachHangSangResponse(danhSach[0]),
      'Lay chi tiet khach hang thanh cong',
    );
  }

  async tao(body: {
    tenKH: string;
    sdt?: string;
    diaChi?: string;
    diemTichLuy?: number;
  }) {
    const tenKH = String(body.tenKH || '').trim();
    const sdt = String(body.sdt || '').trim();
    const diaChi = String(body.diaChi || '').trim();
    const diemTichLuy = Number(body.diemTichLuy ?? 0);

    if (!tenKH) throw new BadRequestException('Ten khach hang la bat buoc.');

    if (sdt) {
      const sdtRegex = /^0[0-9]{9}$/;
      if (!sdtRegex.test(sdt))
        throw new BadRequestException(
          'So dien thoai khong hop le (10 so, bat dau tu 0).',
        );
      const daTonTai = await this.mysql.truyVan(
        'SELECT MaKH FROM KhachHang WHERE SDT = ? LIMIT 1',
        [sdt],
      );
      if (daTonTai[0])
        throw new BadRequestException('So dien thoai da ton tai.');
    }

    const maKH = this.taoMa('KH');
    await this.mysql.thucThi(
      'INSERT INTO KhachHang (MaKH, MaND, TenKH, SDT, DiaChi, DiemTichLuy) VALUES (?, NULL, ?, ?, ?, ?)',
      [maKH, tenKH, sdt || null, diaChi || null, Math.max(0, diemTichLuy)],
    );

    const [kh] = await this.mysql.truyVan(
      'SELECT * FROM KhachHang WHERE MaKH = ? LIMIT 1',
      [maKH],
    );
    return this.taoPhanHoi(
      this.chuyenKhachHangSangResponse(kh),
      'Tao khach hang thanh cong',
    );
  }

  async capNhat(
    maKH: string,
    body: { tenKH?: string; sdt?: string; diaChi?: string },
  ) {
    const [hienTai] = await this.mysql.truyVan(
      'SELECT * FROM KhachHang WHERE MaKH = ? LIMIT 1',
      [maKH],
    );
    if (!hienTai) throw new NotFoundException('Khong tim thay khach hang.');

    const tenKH =
      body.tenKH !== undefined ? String(body.tenKH).trim() : hienTai.TenKH;
    const sdt = body.sdt !== undefined ? String(body.sdt).trim() : hienTai.SDT;
    const diaChi =
      body.diaChi !== undefined ? String(body.diaChi).trim() : hienTai.DiaChi;

    if (!tenKH)
      throw new BadRequestException('Ten khach hang khong duoc rong.');

    if (sdt) {
      const sdtRegex = /^0[0-9]{9}$/;
      if (!sdtRegex.test(sdt))
        throw new BadRequestException('So dien thoai khong hop le.');
      const daTonTai = await this.mysql.truyVan(
        'SELECT MaKH FROM KhachHang WHERE SDT = ? AND MaKH != ? LIMIT 1',
        [sdt, maKH],
      );
      if (daTonTai[0])
        throw new BadRequestException('So dien thoai da ton tai.');
    }

    await this.mysql.thucThi(
      'UPDATE KhachHang SET TenKH = ?, SDT = ?, DiaChi = ? WHERE MaKH = ?',
      [tenKH, sdt || null, diaChi || null, maKH],
    );

    const [kh] = await this.mysql.truyVan(
      'SELECT * FROM KhachHang WHERE MaKH = ? LIMIT 1',
      [maKH],
    );
    return this.taoPhanHoi(
      this.chuyenKhachHangSangResponse(kh),
      'Cap nhat khach hang thanh cong',
    );
  }

  async xoa(maKH: string) {
    const [kh] = await this.mysql.truyVan(
      'SELECT * FROM KhachHang WHERE MaKH = ? LIMIT 1',
      [maKH],
    );
    if (!kh) throw new NotFoundException('Khong tim thay khach hang.');

    const coDonHang = await this.mysql.truyVan(
      'SELECT MaDonHang FROM DonHang WHERE MaKH = ? LIMIT 1',
      [maKH],
    );
    if (coDonHang[0])
      throw new BadRequestException(
        'Khach hang co don hang lien quan, khong the xoa.',
      );

    const coDatBan = await this.mysql.truyVan(
      'SELECT MaDatBan FROM DatBan WHERE MaKH = ? LIMIT 1',
      [maKH],
    );
    if (coDatBan[0])
      throw new BadRequestException(
        'Khach hang co lich dat ban, khong the xoa.',
      );

    await this.mysql.thucThi('DELETE FROM KhachHang WHERE MaKH = ?', [maKH]);
    return this.taoPhanHoi(null, 'Xoa khach hang thanh cong');
  }

  async capNhatDiem(maKH: string, body: { soDiem: number; moTa?: string }) {
    const [kh] = await this.mysql.truyVan(
      'SELECT * FROM KhachHang WHERE MaKH = ? LIMIT 1',
      [maKH],
    );
    if (!kh) throw new NotFoundException('Khong tim thay khach hang.');

    const soDiem = Number(body.soDiem);
    if (isNaN(soDiem)) throw new BadRequestException('So diem khong hop le.');

    const diemHienTai = Number(kh.DiemTichLuy || 0);
    const diemSau = Math.max(0, diemHienTai + soDiem);

    if (diemSau < 0)
      throw new BadRequestException('Diem tich luy khong the am.');

    await this.mysql.thucThi(
      'UPDATE KhachHang SET DiemTichLuy = ? WHERE MaKH = ?',
      [diemSau, maKH],
    );

    const [updated] = await this.mysql.truyVan(
      'SELECT * FROM KhachHang WHERE MaKH = ? LIMIT 1',
      [maKH],
    );
    return this.taoPhanHoi(
      {
        maKH: updated.MaKH,
        diemTruoc: diemHienTai,
        soDiemThayDoi: soDiem,
        diemSau: diemSau,
      },
      'Cap nhat diem tich luy thanh cong',
    );
  }

  async layLichSu(maKH: string) {
    const [kh] = await this.mysql.truyVan(
      'SELECT * FROM KhachHang WHERE MaKH = ? LIMIT 1',
      [maKH],
    );
    if (!kh) throw new NotFoundException('Khong tim thay khach hang.');

    const datBanList = await this.mysql.truyVan(
      `SELECT db.MaDatBan, db.NgayDat, db.GioDat, db.SoNguoi, db.TrangThai as TrangThaiDatBan,
              b.TenBan
       FROM DatBan db LEFT JOIN Ban b ON b.MaBan = db.MaBan
       WHERE db.MaKH = ? ORDER BY db.NgayDat DESC LIMIT 20`,
      [maKH],
    );

    const donHangList = await this.mysql.truyVan(
      `SELECT dh.MaDonHang, dh.NgayTao as NgayDonHang, dh.TongTien, dh.TrangThai as TrangThaiDonHang,
              b.TenBan
       FROM DonHang dh LEFT JOIN Ban b ON b.MaBan = dh.MaBan
       WHERE dh.MaKH = ? ORDER BY dh.NgayTao DESC LIMIT 20`,
      [maKH],
    );

    return this.taoPhanHoi(
      {
        khachHang: this.chuyenKhachHangSangResponse(kh),
        datBan: datBanList.map((db: BanGhi) => ({
          maDatBan: db.MaDatBan,
          ngayDat: db.NgayDat,
          gioDen: db.GioDat,
          soNguoi: db.SoNguoi,
          tenBan: db.TenBan || '',
          trangThai: db.TrangThaiDatBan,
        })),
        donHang: donHangList.map((dh: BanGhi) => ({
          maDonHang: dh.MaDonHang,
          ngayDonHang: dh.NgayDonHang,
          tongTien: Number(dh.TongTien || 0),
          tenBan: dh.TenBan || '',
          trangThai: dh.TrangThaiDonHang,
        })),
      },
      'Lay lich su khach hang thanh cong',
    );
  }
}
