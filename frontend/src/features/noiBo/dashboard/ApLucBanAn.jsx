import { Card, Progress, Space, Typography } from 'antd'
import DashboardEmptyState from './DashboardEmptyState'

const layMauTheoTai = (percent) => {
  if (percent > 80) return '#dc2626'
  if (percent >= 50) return '#d97706'
  return '#16a34a'
}

const dinhDangSoNguyen = (value) => (Number(value) || 0).toLocaleString('vi-VN')

function ApLucBanAn({ tablePressure, loading = false }) {
  const danhSachKhuVuc = Array.isArray(tablePressure) ? tablePressure : []

  if (loading) {
    return <Card className="noi-bo-dashboard-card noi-bo-dashboard-pressure-card" title="Áp lực bàn ăn" loading styles={{ body: { padding: '14px' } }} />
  }

  if (!danhSachKhuVuc.length) {
    return (
      <Card className="noi-bo-dashboard-card noi-bo-dashboard-pressure-card" title="Áp lực bàn ăn" styles={{ body: { padding: '14px' } }}>
        <DashboardEmptyState compact title="Chưa có áp lực bàn trong thời điểm này" description="Tình trạng bàn sẽ hiển thị khi có khu vực đang phục vụ hoặc giữ chỗ." />
      </Card>
    )
  }

  return (
    <Card className="noi-bo-dashboard-card noi-bo-dashboard-pressure-card" title="Áp lực bàn ăn" styles={{ body: { padding: '14px' } }}>
      <Space size={12} style={{ width: '100%', flexDirection: 'column', alignItems: 'stretch' }}>
        {danhSachKhuVuc.map((khuVuc, index) => {
          const soBanGiuCho = Math.max(Number(khuVuc?.held) || 0, 0)
          const soBanCanDon = Math.max(Number(khuVuc?.dirty) || 0, 0)
          const soBanDangBan = Math.max(
            Number(khuVuc?.busyTables) || ((Number(khuVuc?.occupied) || 0) + soBanGiuCho + soBanCanDon),
            0,
          )
          const soBanTrong = Math.max(Number(khuVuc?.available) || 0, 0)
          const tongSoBan = Math.max(Number(khuVuc?.total) || 0, soBanDangBan + soBanTrong)
          const phanTramTaiNguon = Number(khuVuc?.percent)
          const phanTramTai = Number.isFinite(phanTramTaiNguon)
            ? Math.min(Math.max(Math.round(phanTramTaiNguon), 0), 100)
            : (tongSoBan > 0 ? Math.round((soBanDangBan / tongSoBan) * 100) : 0)
          const mauTai = layMauTheoTai(phanTramTai)
          const tenKhuVuc = khuVuc?.name || `Khu vực ${index + 1}`
          const tomTatBan = tongSoBan > 0
            ? `${dinhDangSoNguyen(soBanDangBan)}/${dinhDangSoNguyen(tongSoBan)} bàn đang bận`
            : 'Khu vực hiện chưa có bàn phục vụ'
          const nhanTai = tongSoBan === 0
            ? 'Chưa có bàn'
            : phanTramTai > 80
              ? 'Áp lực cao'
              : phanTramTai >= 50
                ? 'Đang tăng tải'
                : 'Ổn định'

          return (
            <div key={khuVuc.id || tenKhuVuc} className="noi-bo-dashboard-pressure__item">
              <div className="noi-bo-dashboard-pressure__head">
                <div className="noi-bo-dashboard-pressure__copy">
                  <Typography.Text strong className="noi-bo-dashboard-pressure__name">{tenKhuVuc}</Typography.Text>
                  <Typography.Text className="noi-bo-dashboard-pressure__summary">{tomTatBan}</Typography.Text>
                </div>
                <div className="noi-bo-dashboard-pressure__load">
                  <Typography.Text className="noi-bo-dashboard-pressure__percent" style={{ color: mauTai }}>
                    {phanTramTai}% tải
                  </Typography.Text>
                  <Typography.Text className="noi-bo-dashboard-pressure__status">{nhanTai}</Typography.Text>
                </div>
              </div>

              <Progress
                className="noi-bo-dashboard-pressure__bar"
                percent={phanTramTai}
                strokeColor={mauTai}
                trailColor="#F2E8E1"
                size={{ height: 10 }}
                showInfo={false}
              />

              <div className="noi-bo-dashboard-pressure__stats">
                <div className="noi-bo-dashboard-pressure__metric noi-bo-dashboard-pressure__metric--highlight">
                  <span>Bận / tổng</span>
                  <strong>{`${dinhDangSoNguyen(soBanDangBan)}/${dinhDangSoNguyen(tongSoBan)}`}</strong>
                </div>
                <div className="noi-bo-dashboard-pressure__metric">
                  <span>Trống</span>
                  <strong>{dinhDangSoNguyen(soBanTrong)}</strong>
                </div>
                <div className="noi-bo-dashboard-pressure__metric">
                  <span>Giữ chỗ</span>
                  <strong>{dinhDangSoNguyen(soBanGiuCho)}</strong>
                </div>
                <div className="noi-bo-dashboard-pressure__metric">
                  <span>Cần dọn</span>
                  <strong>{dinhDangSoNguyen(soBanCanDon)}</strong>
                </div>
              </div>
            </div>
          )
        })}
      </Space>
    </Card>
  )
}

export default ApLucBanAn
