import { Alert, Button, Card, Col, Empty, Row, Space, Statistic, Tag, Typography } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, CommentOutlined, LikeOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useXacThuc } from '../../hooks/useXacThuc'

const { Title, Paragraph, Text } = Typography

const layTagTrangThai = (trangThai) => {
  if (trangThai === 'Approved') return <Tag color="green">APPROVED</Tag>
  if (trangThai === 'Rejected') return <Tag color="red">REJECTED</Tag>
  return <Tag color="gold">PENDING</Tag>
}

function NoiBoDanhGiaPage() {
  const { danhSachDanhGia, danhSachDanhGiaChoDuyet, xuLyDuyetDanhGia } = useOutletContext()
  const { laQuanLy } = useXacThuc()
  const [dangXuLy, setDangXuLy] = useState('')
  const [thongBao, setThongBao] = useState('')
  const [loi, setLoi] = useState('')

  const danhSachSapXep = useMemo(() => (
    [...(Array.isArray(danhSachDanhGia) ? danhSachDanhGia : [])]
      .sort((a, b) => new Date(b.ngayDanhGia || 0).getTime() - new Date(a.ngayDanhGia || 0).getTime())
  ), [danhSachDanhGia])

  const tongDaDuyet = useMemo(() => danhSachSapXep.filter((item) => item.trangThai === 'Approved').length, [danhSachSapXep])

  const xuLyCapNhat = async (maDanhGia, trangThai) => {
    try {
      setDangXuLy(`${maDanhGia}-${trangThai}`)
      setThongBao('')
      setLoi('')
      const ketQua = await xuLyDuyetDanhGia(maDanhGia, trangThai, trangThai === 'Approved' ? 'Đã duyệt hiển thị công khai.' : 'Đã từ chối hiển thị công khai.')

      if (!ketQua?.duLieu) {
        setLoi('Không thể cập nhật trạng thái đánh giá.')
        return
      }

      setThongBao(`Đã cập nhật đánh giá ${maDanhGia} sang trạng thái ${trangThai}.`)
    } catch (error) {
      setLoi(error?.message || 'Không thể cập nhật đánh giá lúc này.')
    } finally {
      setDangXuLy('')
    }
  }

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Tổng đánh giá" value={danhSachSapXep.length} prefix={<CommentOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Chờ duyệt" value={danhSachDanhGiaChoDuyet.length} styles={{ content: { color: '#d97706' } }} prefix={<LikeOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Đã duyệt" value={tongDaDuyet} styles={{ content: { color: '#059669' } }} prefix={<CheckCircleOutlined />} /></Card>
        </Col>
      </Row>

      <Card>
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Duyệt đánh giá khách hàng</Title>
            <Paragraph type="secondary" style={{ marginBottom: 0 }}>Duyệt hoặc từ chối phản hồi trước khi hiển thị trên trang công khai.</Paragraph>
          </div>

          {thongBao ? <Alert type="success" showIcon title={thongBao} /> : null}
          {loi ? <Alert type="error" showIcon title={loi} /> : null}

          {danhSachSapXep.length === 0 ? (
            <Card variant="borderless"><Empty description="Chưa có đánh giá nào trong hệ thống." /></Card>
          ) : (
            <Space orientation="vertical" size={16} style={{ width: '100%' }}>
              {danhSachSapXep.map((danhGia) => {
                const dangChoDuyet = danhGia.trangThai === 'Pending'
                const dangDuyet = dangXuLy === `${danhGia.maDanhGia}-Approved`
                const dangTuChoi = dangXuLy === `${danhGia.maDanhGia}-Rejected`

                return (
                  <Card key={danhGia.maDanhGia} size="small" title={<Space wrap><Text strong>{danhGia.maDanhGia}</Text>{layTagTrangThai(danhGia.trangThai)}<Tag>{danhGia.soSao}/5 sao</Tag></Space>} extra={dangChoDuyet ? null : <Text type="secondary">Đã xử lý</Text>}>
                    <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                      <Row gutter={[12, 12]}>
                        <Col xs={24} md={8}>
                          <Card size="small" styles={{ body: { padding: 12 } }}>
                            <Text type="secondary">Khách</Text>
                            <div><Text strong>{danhGia.tenKhachHang || danhGia.maKH}</Text></div>
                            {danhGia.email ? <div><Text type="secondary">{danhGia.email}</Text></div> : null}
                          </Card>
                        </Col>
                        <Col xs={24} md={8}>
                          <Card size="small" styles={{ body: { padding: 12 } }}>
                            <Text type="secondary">Đơn hàng</Text>
                            <div><Text strong>{danhGia.maDonHang}</Text></div>
                          </Card>
                        </Col>
                        <Col xs={24} md={8}>
                          <Card size="small" styles={{ body: { padding: 12 } }}>
                            <Text type="secondary">Ngày đánh giá</Text>
                            <div><Text strong>{danhGia.ngayDanhGia ? new Date(danhGia.ngayDanhGia).toLocaleString('vi-VN') : '---'}</Text></div>
                          </Card>
                        </Col>
                      </Row>

                      <Card size="small" styles={{ body: { padding: 14 } }}>
                        <Paragraph style={{ margin: 0 }}>{danhGia.noiDung || 'Không có nội dung đánh giá.'}</Paragraph>
                      </Card>

                      {danhGia.phanHoi ? (
                        <Alert type="info" showIcon title={<span><strong>Phản hồi nội bộ:</strong> {danhGia.phanHoi}</span>} />
                      ) : null}

                      {dangChoDuyet && laQuanLy ? (
                        <Space wrap>
                          <Button type="primary" onClick={() => xuLyCapNhat(danhGia.maDanhGia, 'Approved')} loading={dangDuyet} icon={<CheckCircleOutlined />}>Duyệt</Button>
                          <Button danger onClick={() => xuLyCapNhat(danhGia.maDanhGia, 'Rejected')} loading={dangTuChoi} icon={<CloseCircleOutlined />}>Từ chối</Button>
                        </Space>
                      ) : dangChoDuyet ? (
                        <Alert type="info" showIcon title="Nhân viên chỉ được xem danh sách đánh giá chờ duyệt." />
                      ) : (
                        <Alert type="success" title="Đánh giá này đã được xử lý và không cần thao tác thêm." />
                      )}
                    </Space>
                  </Card>
                )
              })}
            </Space>
          )}
        </Space>
      </Card>
    </Space>
  )
}

export default NoiBoDanhGiaPage
