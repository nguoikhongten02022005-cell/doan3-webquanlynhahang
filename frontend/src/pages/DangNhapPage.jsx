import { useState } from 'react'
import { Alert, Button, Card, Form, Input, Typography } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'
import { coSuDungMayChu } from '../services/trinhKhachApi'

function DangNhapPage() {
  const [email, setEmail] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [hienMatKhau, setHienMatKhau] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [dangGui, setDangGui] = useState(false)
  const [form] = Form.useForm()
  const location = useLocation()
  const navigate = useNavigate()
  const { dangNhap } = useXacThuc()
  const { Title, Paragraph, Text } = Typography
  const backendMode = coSuDungMayChu()

  const handleSubmit = async () => {
    if (dangGui) return

    try {
      setDangGui(true)
      const ketQua = await dangNhap(email, matKhau)

      if (!ketQua.success) {
        setLoginError(ketQua.error)
        return
      }

      setLoginError('')
      navigate(location.state?.from || '/', { replace: true })
    } finally {
      setDangGui(false)
    }
  }

  return (
    <section className="xac-thuc-page">
      <Card className="xac-thuc-card xac-thuc-card-antd" variant="borderless">
        <Title level={1} className="xac-thuc-title">Đăng nhập</Title>
        <Paragraph className="xac-thuc-subtitle">
          Đăng nhập để tiếp tục sử dụng tài khoản khách hàng của bạn.
        </Paragraph>

        {!backendMode ? <Alert type="warning" showIcon title="Ứng dụng chưa kết nối máy chủ. Vui lòng kiểm tra cấu hình hệ thống trước khi đăng nhập." style={{ marginBottom: 16 }} /> : null}

        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleSubmit}
          className="xac-thuc-form xac-thuc-form-antd"
          autoComplete="off"
          initialValues={{ email: '', password: '' }}
        >
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
            <Input
              size="large"
              placeholder="Nhập email"
              autoComplete="off"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (loginError) setLoginError('')
              }}
            />
          </Form.Item>

          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu"
              autoComplete="new-password"
              visibilityToggle={{ visible: hienMatKhau, onVisibleChange: setHienMatKhau }}
              value={matKhau}
              onChange={(e) => {
                setMatKhau(e.target.value)
                if (loginError) setLoginError('')
              }}
            />
          </Form.Item>

          {loginError ? <Alert type="error" showIcon title={loginError} style={{ marginBottom: 16 }} /> : null}

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit" size="large" loading={dangGui}>
              {dangGui ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </Form.Item>
        </Form>

        <p className="xac-thuc-switch-text">
          <Text type="secondary">Chưa có tài khoản? </Text>
          <Link to="/dang-ky" className="xac-thuc-switch-link">
            Đăng ký ngay
          </Link>
        </p>
      </Card>
    </section>
  )
}

export default DangNhapPage
