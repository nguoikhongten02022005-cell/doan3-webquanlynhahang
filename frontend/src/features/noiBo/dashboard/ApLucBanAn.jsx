import { Card, Progress, Space, Tooltip, Typography } from 'antd'
import DashboardEmptyState from './DashboardEmptyState'

const layMauTheoTai = (percent) => {
  if (percent > 80) return '#ff4d4f'
  if (percent >= 50) return '#fa8c16'
  return '#52c41a'
}

function ApLucBanAn({ tablePressure }) {
  const danhSachKhuVuc = Array.isArray(tablePressure) ? tablePressure : []

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
        {danhSachKhuVuc.map((khuVuc) => {
          const tongSoBan = Number(khuVuc.total) || 0
          const soBanDangBan = Math.max(Number(khuVuc.busyTables) || 0, 0)
          const soBanTrong = Math.max(Number(khuVuc.available) || 0, 0)
          const soBanGiuCho = Math.max(Number(khuVuc.held) || 0, 0)
          const soBanCanDon = Math.max(Number(khuVuc.dirty) || 0, 0)
          const phanTramTai = Math.min(Math.max(Number(khuVuc.percent) || 0, 0), 100)
          const mauTai = layMauTheoTai(phanTramTai)
          const tomTatBan = tongSoBan > 0
            ? `${soBanDangBan}/${tongSoBan} bàn đang bận`
            : 'Chưa có bàn trong khu vực này'

          return (
            <div key={khuVuc.id} className="noi-bo-dashboard-pressure__item">
              <div className="noi-bo-dashboard-pressure__head">
                <div>
                  <Typography.Text strong className="noi-bo-dashboard-pressure__name">{khuVuc.name}</Typography.Text>
                  <Typography.Text className="noi-bo-dashboard-pressure__summary">{tomTatBan}</Typography.Text>
                </div>
                <Typography.Text className="noi-bo-dashboard-pressure__percent" style={{ color: mauTai }}>
                  {phanTramTai}% tải
                </Typography.Text>
              </div>
              <Tooltip title={`${soBanDangBan}/${tongSoBan} bàn bận · ${soBanTrong} trống · ${soBanGiuCho} giữ chỗ · ${soBanCanDon} cần dọn`}>
                <Progress className="noi-bo-dashboard-pressure__bar" percent={phanTramTai} strokeColor={mauTai} size={{ height: 10 }} showInfo={false} />
              </Tooltip>
              <div className="noi-bo-dashboard-pressure__detail">
                Trống: <strong>{soBanTrong}</strong> · Giữ chỗ: <strong>{soBanGiuCho}</strong> · Cần dọn: <strong>{soBanCanDon}</strong>
              </div>
            </div>
          )
        })}
      </Space>
    </Card>
  )
}

export default ApLucBanAn
