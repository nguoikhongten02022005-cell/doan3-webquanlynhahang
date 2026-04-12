import { useEffect, useState } from 'react'
import { Alert, Button, Card, Checkbox, Form, Input, Typography } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'
import { datMucLuuTru, layMucLuuTru, xoaMucLuuTru } from '../services/dichVuLuuTru'
import { coSuDungMayChu } from '../services/trinhKhachApi'

const KHOA_NHO_DANG_NHAP = 'restaurant_remember_login'
const KHOA_EMAIL_DA_NHO = 'restaurant_remembered_email'

function DangNhapPage() {
  const [email, setEmail] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [hienMatKhau, setHienMatKhau] = useState(false)
  const [nhoMatKhau, setNhoMatKhau] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [dangGui, setDangGui] = useState(false)
  const [form] = Form.useForm()
  const location = useLocation()
  const navigate = useNavigate()
  const { dangNhap } = useXacThuc()
  const { Title, Paragraph, Text } = Typography
  const backendMode = coSuDungMayChu()

  useEffect(() => {
    const coNhoDangNhap = layMucLuuTru(KHOA_NHO_DANG_NHAP) === '1'
    const emailDaNho = layMucLuuTru(KHOA_EMAIL_DA_NHO) || ''

    setNhoMatKhau(coNhoDangNhap)
    if (coNhoDangNhap && emailDaNho) {
      setEmail(emailDaNho)
      form.setFieldValue('email', emailDaNho)
    }
  }, [form])

  const handleSubmit = async () => {
    if (dangGui) return

    try {
      setDangGui(true)
      const ketQua = await dangNhap(email, matKhau)

      if (!ketQua.success) {
        setLoginError(ketQua.error)
        return
      }

      if (nhoMatKhau) {
        datMucLuuTru(KHOA_NHO_DANG_NHAP, '1')
        datMucLuuTru(KHOA_EMAIL_DA_NHO, email)
      } else {
        xoaMucLuuTru(KHOA_NHO_DANG_NHAP)
        xoaMucLuuTru(KHOA_EMAIL_DA_NHO)
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
          initialValues={{ email, password: '', remember: nhoMatKhau }}
        >
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
            <Input
              size="large"
              placeholder="Nhập email"
              autoComplete="email"
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
              autoComplete="current-password"
              visibilityToggle={{ visible: hienMatKhau, onVisibleChange: setHienMatKhau }}
              value={matKhau}
              onChange={(e) => {
                setMatKhau(e.target.value)
                if (loginError) setLoginError('')
              }}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }} name="remember" valuePropName="checked">
            <Checkbox
              checked={nhoMatKhau}
              onChange={(e) => setNhoMatKhau(e.target.checked)}
            >
              Nhớ mật khẩu
            </Checkbox>
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
