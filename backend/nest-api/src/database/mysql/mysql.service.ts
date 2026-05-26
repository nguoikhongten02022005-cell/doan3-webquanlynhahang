import {
  HttpException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  createPool,
  type Pool,
  type PoolConnection,
  type ResultSetHeader,
} from 'mysql2/promise';
import { docBienMoiTruongBatBuoc } from '../../common/doc-bien-moi-truong';

@Injectable()
export class MySqlService {
  private readonly logger = new Logger(MySqlService.name);
  private ketNoi?: Pool;

  private layKetNoi(): Pool {
    if (this.ketNoi) {
      return this.ketNoi;
    }

    const mayChu = this.docCauHinhDb('DB_HOST', undefined, '127.0.0.1');
    const tenNguoiDung = this.docCauHinhDb('DB_USERNAME', 'DB_USER', 'root');
    const tenCoSoDuLieu = this.docCauHinhDb(
      'DB_DATABASE',
      'DB_NAME',
      'QuanNhaHang',
    );
    const congDb = Number(this.docCauHinhDb('DB_PORT', undefined, '3306'));
    const matKhauDb = process.env.DB_PASSWORD ?? '';

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
      timezone: '+07:00',
    });

    return this.ketNoi;
  }

  private docCauHinhDb(
    tenBien: string,
    tenBienCu?: string,
    giaTriMacDinhDev?: string,
  ): string {
    const giaTri = process.env[tenBien]?.trim();
    if (giaTri) {
      return giaTri;
    }

    const giaTriCu = tenBienCu ? process.env[tenBienCu]?.trim() : '';
    if (giaTriCu) {
      return giaTriCu;
    }

    if (
      process.env.NODE_ENV !== 'production' &&
      giaTriMacDinhDev !== undefined
    ) {
      return giaTriMacDinhDev;
    }

    return docBienMoiTruongBatBuoc(tenBien);
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
      if (loi instanceof HttpException) {
        throw loi;
      }
      throw new ServiceUnavailableException(this.rutGonLoiDb(loi));
    } finally {
      ketNoi.release();
    }
  }

  private rutGonLoiDb(loi: unknown): string {
    const loiDb = loi as {
      code?: string;
      errno?: number;
      message?: string;
      sqlMessage?: string;
      sqlState?: string;
    };
    this.logger.error('Lỗi database', {
      code: loiDb?.code,
      errno: loiDb?.errno,
      message: loiDb?.sqlMessage || loiDb?.message,
      sqlState: loiDb?.sqlState,
    });
    return 'Hệ thống dữ liệu tạm thời gặp sự cố. Vui lòng thử lại sau.';
  }
}
