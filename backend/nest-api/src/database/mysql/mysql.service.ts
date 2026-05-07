import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { createPool, type Pool, type PoolConnection, type ResultSetHeader } from 'mysql2/promise';
import { docBienMoiTruongBatBuoc } from '../../common/doc-bien-moi-truong';

@Injectable()
export class MySqlService {
  private readonly logger = new Logger(MySqlService.name);
  private ketNoi?: Pool;

  private layKetNoi(): Pool {
    if (this.ketNoi) {
      return this.ketNoi;
    }

    const mayChu = docBienMoiTruongBatBuoc('DB_HOST');
    const tenNguoiDung = docBienMoiTruongBatBuoc('DB_USER');
    const tenCoSoDuLieu = docBienMoiTruongBatBuoc('DB_NAME');
    const congDb = Number(docBienMoiTruongBatBuoc('DB_PORT'));
    const matKhauDb = docBienMoiTruongBatBuoc('DB_PASSWORD');

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

  /**
   * Thực thi callback trong một transaction thật sự (BEGIN/COMMIT/ROLLBACK).
   * Dùng PoolConnection riêng để đảm bảo tất cả truy vấn trong callback
   * chạy trên cùng một connection.
   */
  async giaoDich<T>(xuLy: (ketNoi: PoolConnection) => Promise<T>): Promise<T> {
    const ketNoi = await this.layKetNoi().getConnection();

    try {
      await ketNoi.beginTransaction();
      const ketQua = await xuLy(ketNoi);
      await ketNoi.commit();
      return ketQua;
    } catch (loi) {
      await ketNoi.rollback();
      throw new ServiceUnavailableException(this.rutGonLoiDb(loi));
    } finally {
      ketNoi.release();
    }
  }

  private rutGonLoiDb(loi: unknown): string {
    this.logger.error('Lỗi database:', loi);
    return 'He thong du lieu tam thoi gap su co. Vui long thu lai sau.';
  }
}
