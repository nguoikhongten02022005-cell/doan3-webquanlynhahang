import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { Alert, Avatar, Button, Card, Col, Form, Input, List, Row, Space, Typography } from 'antd'
import { LockOutlined, LoginOutlined, MailOutlined } from '@ant-design/icons'
import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { VAI_TRO_XAC_THUC } from '../services/dichVuXacThuc'
import { useXacThuc } from '../hooks/useXacThuc'
import { coSuDungMayChu } from '../services/trinhKhachApi'
import { layMucLuuTru, xoaMucLuuTru } from '../services/dichVuLuuTru'

const { Title, Paragraph, Text } = Typography

const TAI_KHOAN_NOI_BO_LOCAL = Object.freeze([
  {
    identifier: 'admin@nhahang.com',
    username: 'ND001',
    password: '123',
    roleLabel: 'Admin local',
  },
  {
    identifier: 'an.nv@nhahang.com',
    username: 'ND002',
    password: '123',
    roleLabel: 'Nhân viên local',
  },
])

function DangNhapNoiBoPage() {
  const [tenDangNhapHoacEmail, setTenDangNhapHoacEmail] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [loiDangNhap, setLoiDangNhap] = useState('')
  const [dangGui, setDangGui] = useState(false)
  const [canhBaoPhienHetHan, setCanhBaoPhienHetHan] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { coTheVaoNoiBo, daDangNhap, dangNhapNoiBo, dangXuat } = useXacThuc()
  const backendMode = coSuDungMayChu()

  if (daDangNhap && coTheVaoNoiBo) {
    return <Navigate to="/admin/dashboard" replace />
  }

  useEffect(() => {
    if (layMucLuuTru(STORAGE_KEYS.PHIEN_HET_HAN)) {
      setCanhBaoPhienHetHan(true)
      xoaMucLuuTru(STORAGE_KEYS.PHIEN_HET_HAN)
    }
  }, [])

  const handleSubmit = async () => {
    if (dangGui) return

    setDangGui(true)
    try {
      const ketQua = await dangNhapNoiBo(tenDangNhapHoacEmail, matKhau)

      if (!ketQua.success) {
        setLoiDangNhap(ketQua.error)
        return
      }

      if (![VAI_TRO_XAC_THUC.QUAN_TRI, VAI_TRO_XAC_THUC.NHAN_VIEN].includes(ketQua.user?.role)) {
        await dangXuat()
        setLoiDangNhap('Tài khoản này không có quyền truy cập khu vực nội bộ.')
        return
      }

      setLoiDangNhap('')
      navigate(location.state?.from || '/admin/dashboard', { replace: true })
    } finally {
      setDangGui(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: 24, background: '#f5f5f5' }}>
      <Row align="middle" justify="center" style={{ minHeight: '100vh' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={9}>
            <Card variant="borderless" style={{ boxShadow: '0 20px 48px rgba(15,23,42,0.10)' }}>
              <Space orientation="vertical" size={18} style={{ width: '100%' }}>
              <Space align="center" size={14}>
                <Avatar size={56} style={{ background: '#e96c4a' }}>NH</Avatar>
                <div>
                  <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.16em' }}>Nguyên Vị</Text>
                  <Title level={4} style={{ margin: 0 }}>Operations Console</Title>
                </div>
              </Space>

              <div>
                <Title level={2} style={{ marginBottom: 8 }}>Đăng nhập quản trị</Title>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {backendMode
                    ? 'Đăng nhập bằng tài khoản nội bộ thật để truy cập Admin Panel và dữ liệu backend local.'
                    : 'Frontend hiện không kết nối backend. Hãy bật backend mode để dùng tài khoản nội bộ thật.'}
                </Paragraph>
              </div>

              {canhBaoPhienHetHan ? <Alert type="warning" showIcon title="Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục vào khu vực quản trị." /> : null}
              {loiDangNhap ? <Alert type="error" showIcon title={loiDangNhap} /> : null}

              <Card size="small" title="Tài khoản nội bộ local">
                <List
                  dataSource={TAI_KHOAN_NOI_BO_LOCAL}
                  renderItem={(account) => (
                    <List.Item>
                      <Button
                        type="text"
                        style={{ width: '100%', height: 'auto', padding: 0, textAlign: 'left' }}
                        onClick={() => {
                          setTenDangNhapHoacEmail(account.identifier)
                          setMatKhau(account.password)
                          setLoiDangNhap('')
                        }}
                      >
                        <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
                          <div>
                            <Text strong>{account.roleLabel}</Text>
                            <div><Text type="secondary">{account.identifier}</Text></div>
                          </div>
                          <Text style={{ color: '#ea580c', fontWeight: 700 }}>{account.username} / {account.password}</Text>
                        </Space>
                      </Button>
                    </List.Item>
                  )}
                />
              </Card>

              <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
                <Form.Item label="Email nội bộ" required>
                  <Input prefix={<MailOutlined />} size="large" value={tenDangNhapHoacEmail} onChange={(e) => { setTenDangNhapHoacEmail(e.target.value); if (loiDangNhap) setLoiDangNhap('') }} placeholder="Nhập email nội bộ" />
                </Form.Item>
                <Form.Item label="Mật khẩu" required>
                  <Input.Password prefix={<LockOutlined />} size="large" value={matKhau} onChange={(e) => { setMatKhau(e.target.value); if (loiDangNhap) setLoiDangNhap('') }} placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Button htmlType="submit" type="primary" icon={<LoginOutlined />} loading={dangGui} block size="large">
                  {dangGui ? 'Đang đăng nhập...' : 'Vào Admin Panel'}
                </Button>
              </Form>

              <Text type="secondary">Bạn là khách hàng? <Link to="/dang-nhap">Đăng nhập tại đây</Link></Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DangNhapNoiBoPage
