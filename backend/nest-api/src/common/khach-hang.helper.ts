import type { PoolConnection } from 'mysql2/promise';
import { MySqlService } from '../database/mysql/mysql.service';

export const layKhachHangTheoMaNd = async (
  mysql: MySqlService,
  maND: string,
  ketNoi?: PoolConnection,
) => {
  if (ketNoi) {
    const [kq] = await ketNoi.query(
      'SELECT * FROM KhachHang WHERE MaND = ? LIMIT 1',
      [maND],
    );
    return kq[0] || null;
  }
  const danhSach = await mysql.truyVan(
    'SELECT * FROM KhachHang WHERE MaND = ? LIMIT 1',
    [maND],
  );
  return danhSach[0] || null;
};
