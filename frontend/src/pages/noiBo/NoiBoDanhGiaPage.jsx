import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  List,
  Rate,
  Row,
  Segmented,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CommentOutlined,
  LikeOutlined,
  StarFilled,
} from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useXacThuc } from '../../hooks/useXacThuc'

const { Text, Title } = Typography

const MAP_TRANG_THAI = {
  Approved: { color: 'success', label: 'Đã duyệt' },
  Rejected: { color: 'error', label: 'Từ chối' },
  Pending: { color: 'warning', label: 'Chờ duyệt' },
}

const LOC_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Pending', label: 'Chờ duyệt' },
  { value: 'Approved', label: 'Đã duyệt' },
  { value: 'Rejected', label: 'Từ chối' },
]

function NoiBoDanhGiaPage() {
  const { danhSachDanhGia, xuLyDuyetDanhGia } = useOutletContext()
  const { laQuanLy } = useXacThuc()
  const [loc, setLoc] = useState('all')
  const [dangXuLy, setDangXuLy] = useState('')
  const [thongBao, setThongBao] = useState('')
  const [loi, setLoi] = useState('')

  const danhSachLoc = useMemo(() => {
    const arr = Array.isArray(danhSachDanhGia) ? danhSachDanhGia : []
    const sorted = [...arr].sort(
      (a, b) => new Date(b.ngayDanhGia || 0) - new Date(a.ngayDanhGia || 0),
    )
    if (loc === 'all') return sorted
    return sorted.filter((d) => d.trangThai === loc)
  }, [danhSachDanhGia, loc])

  const thongKe = useMemo(() => {
    const arr = Array.isArray(danhSachDanhGia) ? danhSachDanhGia : []
    return {
      tong: arr.length,
      choDuyet: arr.filter((d) => d.trangThai === 'Pending').length,
      daDuyet: arr.filter((d) => d.trangThai === 'Approved').length,
      tuChoi: arr.filter((d) => d.trangThai === 'Rejected').length,
    }
  }, [danhSachDanhGia])

  const xuLyCapNhat = async (maDanhGia, trangThai) => {
    try {
      setDangXuLy(`${maDanhGia}-${trangThai}`)
      setThongBao('')
      setLoi('')
      await xuLyDuyetDanhGia(
        maDanhGia,
        trangThai,
        trangThai === 'Approved'
          ? 'Đã duyệt hiển thị.'
          : 'Đã từ chối hiển thị.',
      )
      setThongBao(
        `Cập nhật thành công đánh giá ${maDanhGia}.`,
      )
    } catch (error) {
      setLoi(error?.message || 'Có lỗi xảy ra.')
    } finally {
      setDangXuLy('')
    }
  }

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Tổng đánh giá"
              value={thongKe.tong}
              prefix={<CommentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Chờ duyệt"
              value={thongKe.choDuyet}
              prefix={<LikeOutlined />}
              styles={{ content: { color: '#d97706' } }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Đã duyệt"
              value={thongKe.daDuyet}
              prefix={<CheckCircleOutlined />}
              styles={{ content: { color: '#059669' } }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Từ chối"
              value={thongKe.tuChoi}
              prefix={<CloseCircleOutlined />}
              styles={{ content: { color: '#dc2626' } }}
            />
          </Card>
        </Col>
      </Row>

      <Card size="small">
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Title level={5} style={{ margin: 0 }}>
              Danh sách đánh giá
            </Title>
            <Segmented
              size="small"
              options={LOC_OPTIONS}
              value={loc}
              onChange={setLoc}
            />
          </Space>

          {thongBao && (
            <Alert
              type="success"
              showIcon
              message={thongBao}
              closable
              onClose={() => setThongBao('')}
            />
          )}
          {loi && (
            <Alert
              type="error"
              showIcon
              message={loi}
              closable
              onClose={() => setLoi('')}
            />
          )}

          {danhSachLoc.length === 0 ? (
            <Empty description="Không có đánh giá nào." />
          ) : (
            <List
              dataSource={danhSachLoc}
              renderItem={(danhGia) => {
                const trangThai = MAP_TRANG_THAI[danhGia.trangThai] || MAP_TRANG_THAI.Pending
                const choDuyet = danhGia.trangThai === 'Pending'
                const dangXL = dangXuLy === `${danhGia.maDanhGia}-${danhGia.trangThai}`
                const tenKhach = danhGia.tenKhachHang || danhGia.maKH || 'Khách'

                return (
                  <List.Item
                    key={danhGia.maDanhGia}
                    actions={
                      choDuyet && laQuanLy
                        ? [
                            <Button
                              key="duyet"
                              type="primary"
                              size="small"
                              icon={<CheckCircleOutlined />}
                              loading={dangXL}
                              onClick={() =>
                                xuLyCapNhat(danhGia.maDanhGia, 'Approved')
                              }
                            >
                              Duyệt
                            </Button>,
                            <Button
                              key="tuchoi"
                              danger
                              size="small"
                              icon={<CloseCircleOutlined />}
                              loading={dangXL}
                              onClick={() =>
                                xuLyCapNhat(danhGia.maDanhGia, 'Rejected')
                              }
                            >
                              Từ chối
                            </Button>,
                          ]
                        : []
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            background: '#e96c4a',
                            verticalAlign: 'middle',
                          }}
                        >
                          {String(tenKhach).charAt(0).toUpperCase()}
                        </Avatar>
                      }
                      title={
                        <Space>
                          <Text strong>{tenKhach}</Text>
                          <Tag color={trangThai.color}>{trangThai.label}</Tag>
                          <Rate
                            disabled
                            value={danhGia.soSao || 5}
                            style={{ fontSize: 12 }}
                          />
                        </Space>
                      }
                      description={
                        <Space orientation="vertical" size={4}>
                          <Text type="secondary">
                            Đơn: {danhGia.maDonHang || '---'} ·{' '}
                            {danhGia.ngayDanhGia
                              ? new Date(
                                  danhGia.ngayDanhGia,
                                ).toLocaleString('vi-VN')
                              : '---'}
                          </Text>
                          <Text>{danhGia.noiDung || 'Không có nội dung.'}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )
              }}
            />
          )}
        </Space>
      </Card>
    </Space>
  )
}

export default NoiBoDanhGiaPage
