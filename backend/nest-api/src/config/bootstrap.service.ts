import { Injectable, Logger } from '@nestjs/common';
import { MySqlService } from '../database/mysql/mysql.service';

@Injectable()
export class BootstrapService {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(private readonly mysql: MySqlService) {}

  private docBienMoiTruongBatBuoc(tenBien: string) {
    const giaTri = process.env[tenBien]?.trim();

    if (!giaTri) {
      throw new Error(`Thiếu biến môi trường bắt buộc: ${tenBien}`);
    }

    return giaTri;
  }

  async khoiTaoNeuCan() {
    if (this.docBienMoiTruongBatBuoc('DB_AUTO_INIT').toLowerCase() !== 'true') {
      return;
    }

    await this.kiemTraKetNoi();
    this.logger.log(
      'Da bat che do DB_AUTO_INIT, backend chi kiem tra ket noi MySQL va khong tu tao schema.',
    );
  }

  private async kiemTraKetNoi() {
    await this.mysql.truyVan('SELECT 1 AS ok');
  }
}
