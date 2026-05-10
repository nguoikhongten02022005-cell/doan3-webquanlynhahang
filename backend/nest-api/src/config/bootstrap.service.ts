import { Injectable, Logger } from '@nestjs/common';
import { MySqlService } from '../database/mysql/mysql.service';
import { docBienMoiTruongBatBuoc } from '../common/doc-bien-moi-truong';

@Injectable()
export class BootstrapService {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(private readonly mysql: MySqlService) {}

  async khoiTaoNeuCan() {
    if (docBienMoiTruongBatBuoc('DB_AUTO_INIT').toLowerCase() !== 'true') {
      return;
    }

    await this.kiemTraKetNoi();
    this.logger.log(
      'Đã bật chế độ DB_AUTO_INIT, backend chỉ kiểm tra kết nối MySQL và không tự tạo schema.',
    );
  }

  private async kiemTraKetNoi() {
    await this.mysql.truyVan('SELECT 1 AS ok');
  }
}
