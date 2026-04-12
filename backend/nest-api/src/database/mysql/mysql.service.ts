import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { createPool, type Pool, type ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class MySqlService {
  private ketNoi?: Pool;

  private docBienMoiTruongBatBuoc(tenBien: string) {
    const giaTri = process.env[tenBien]?.trim();

    if (!giaTri) {
      throw new ServiceUnavailableException(`Thiếu cấu hình bắt buộc: ${tenBien}`);
    }

    return giaTri;
  }

  private layKetNoi(): Pool {
    if (this.ketNoi) {
      return this.ketNoi;
    }

    const mayChu = this.docBienMoiTruongBatBuoc('DB_HOST');
    const tenNguoiDung = this.docBienMoiTruongBatBuoc('DB_USER');
    const tenCoSoDuLieu = this.docBienMoiTruongBatBuoc('DB_NAME');
    const congDb = Number(this.docBienMoiTruongBatBuoc('DB_PORT'));
    const matKhauDb = this.docBienMoiTruongBatBuoc('DB_PASSWORD');

    if (!Number.isInteger(congDb) || congDb <= 0) {
      throw new ServiceUnavailableException('DB_PORT không hợp lệ.');
    }

    this.ketNoi = createPool({
      host: mayChu,
      port: congDb,
      user: tenNguoiDung,
      password: matKhauDb,
      database: tenCoSoDuLieu,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
    });

    return this.ketNoi;
  }

  async truyVan(sql: string, thamSo: any[] = []): Promise<any[]> {
    try {
      const [ketQua] = await this.layKetNoi().query(sql, thamSo);
      return ketQua as any[];
    } catch (loi) {
      throw new ServiceUnavailableException(this.rutGonLoiDb(loi));
    }
  }

  async thucThi(sql: string, thamSo: any[] = []): Promise<ResultSetHeader> {
    try {
      const [ketQua] = await this.layKetNoi().execute(sql, thamSo);
      return ketQua as ResultSetHeader;
    } catch (loi) {
      throw new ServiceUnavailableException(this.rutGonLoiDb(loi));
    }
  }

  async giaoDich<T>(xuLy: (ketNoi: Pool) => Promise<T>): Promise<T> {
    try {
      return await xuLy(this.layKetNoi());
    } catch (loi) {
      throw new ServiceUnavailableException(this.rutGonLoiDb(loi));
    }
  }

  private rutGonLoiDb(_loi: unknown): string {
    return 'He thong du lieu tam thoi gap su co. Vui long thu lai sau.';
  }
}
