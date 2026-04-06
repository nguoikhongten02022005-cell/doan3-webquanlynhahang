import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { createPool, type Pool, type ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class MySqlService {
  private ketNoi?: Pool;

  private layKetNoi(): Pool {
    if (this.ketNoi) {
      return this.ketNoi;
    }

    const mayChu = process.env.DB_HOST?.trim();
    const tenNguoiDung = process.env.DB_USER?.trim();
    const tenCoSoDuLieu = process.env.DB_NAME?.trim();

    if (!mayChu || !tenNguoiDung || !tenCoSoDuLieu) {
      throw new ServiceUnavailableException('Thieu cau hinh DB_HOST, DB_USER hoac DB_NAME cho backend NestJS.');
    }

    this.ketNoi = createPool({
      host: mayChu,
      port: Number(process.env.DB_PORT || 3306),
      user: tenNguoiDung,
      password: process.env.DB_PASSWORD || '',
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

  private rutGonLoiDb(loi: unknown): string {
    if (typeof loi === 'object' && loi && 'message' in loi && typeof loi.message === 'string') {
      return `Khong the ket noi/lam viec voi MySQL: ${loi.message}`;
    }

    return 'Khong the ket noi/lam viec voi MySQL.';
  }
}
