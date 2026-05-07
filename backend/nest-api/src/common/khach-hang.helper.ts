import { MySqlService } from '../database/mysql/mysql.service';

export const layKhachHangTheoMaNd = async (
  mysql: MySqlService,
  maND: string,
) => {
  const danhSach = await mysql.truyVan(
    'SELECT * FROM KhachHang WHERE MaND = ? LIMIT 1',
    [maND],
  );
  return danhSach[0] || null;
};
