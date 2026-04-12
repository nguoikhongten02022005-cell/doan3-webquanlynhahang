import { useEffect, useState } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { Alert, Button, Card, Checkbox, Form, Input, Typography } from 'antd'
import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { VAI_TRO_XAC_THUC } from '../services/dichVuXacThuc'
import { useXacThuc } from '../hooks/useXacThuc'
import { coSuDungMayChu } from '../services/trinhKhachApi'
import { datMucLuuTru, layMucLuuTru, xoaMucLuuTru } from '../services/dichVuLuuTru'

const { Title, Paragraph, Text } = Typography
const KHOA_NHO_NOI_BO = 'restaurant_remember_internal_login'
const KHOA_EMAIL_NOI_BO = 'restaurant_remembered_internal_email'

function DangNhapNoiBoPage() {
  const [tenDangNhapHoacEmail, setTenDangNhapHoacEmail] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [hienMatKhau, setHienMatKhau] = useState(false)
  const [nhoDangNhap, setNhoDangNhap] = useState(false)
  const [loiDangNhap, setLoiDangNhap] = useState('')
  const [dangGui, setDangGui] = useState(false)
  const [canhBaoPhienHetHan, setCanhBaoPhienHetHan] = useState(false)
  const [form] = Form.useForm()
  const location = useLocation()
  const { coTheVaoNoiBo, daDangNhap, dangNhapNoiBo, dangXuat } = useXacThuc()
  const backendMode = coSuDungMayChu()
  const duongDanChuyenHuongSauDangNhap = location.state?.from || '/noi-bo/dashboard'

  useEffect(() => {
    if (layMucLuuTru(STORAGE_KEYS.PHIEN_HET_HAN)) {
      setCanhBaoPhienHetHan(true)
      xoaMucLuuTru(STORAGE_KEYS.PHIEN_HET_HAN)
    }
    const coNhoDangNhap = layMucLuuTru(KHOA_NHO_NOI_BO) === '1'
    const emailDaNho = layMucLuuTru(KHOA_EMAIL_NOI_BO) || ''

    setNhoDangNhap(coNhoDangNhap)
    if (coNhoDangNhap && emailDaNho) {
      setTenDangNhapHoacEmail(emailDaNho)
      form.setFieldValue('identifier', emailDaNho)
    }
  }, [form])

  if (daDangNhap && coTheVaoNoiBo) {
    return <Navigate to={duongDanChuyenHuongSauDangNhap} replace />
  }

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

      if (nhoDangNhap) {
        datMucLuuTru(KHOA_NHO_NOI_BO, '1')
        datMucLuuTru(KHOA_EMAIL_NOI_BO, tenDangNhapHoacEmail)
      } else {
        xoaMucLuuTru(KHOA_NHO_NOI_BO)
        xoaMucLuuTru(KHOA_EMAIL_NOI_BO)
      }

      setLoiDangNhap('')
    } finally {
      setDangGui(false)
    }
  }

  return (
    <section className="xac-thuc-page">
      <Card className="xac-thuc-card xac-thuc-card-antd" variant="borderless">
            <Title level={1} className="xac-thuc-title">Đăng nhập</Title>
            <Paragraph className="xac-thuc-subtitle">
              Đăng nhập để tiếp tục sử dụng tài khoản nội bộ của bạn.
            </Paragraph>
            {!backendMode ? <Alert type="warning" showIcon title="Ứng dụng chưa bật backend mode. Hãy cấu hình VITE_USE_BACKEND=true để đăng nhập nội bộ bằng API thật." style={{ marginBottom: 16 }} /> : null}

            {canhBaoPhienHetHan ? <Alert type="warning" showIcon title="Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục vào khu vực quản trị." style={{ marginBottom: 16 }} /> : null}
            {loiDangNhap ? <Alert type="error" showIcon title={loiDangNhap} style={{ marginBottom: 16 }} /> : null}

            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onFinish={handleSubmit}
              className="xac-thuc-form xac-thuc-form-antd"
              initialValues={{ identifier: tenDangNhapHoacEmail, password: '', remember: nhoDangNhap }}
            >
              <Form.Item label="Email" name="identifier" rules={[{ required: true, message: 'Vui lòng nhập email nội bộ' }]}>
                <Input
                  prefix={null}
                  size="large"
                  placeholder="Nhập email nội bộ"
                  autoComplete="username"
                  value={tenDangNhapHoacEmail}
                  onChange={(e) => {
                    setTenDangNhapHoacEmail(e.target.value)
                    if (loiDangNhap) setLoiDangNhap('')
                  }}
                />
              </Form.Item>

              <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                <Input.Password
                  prefix={null}
                  size="large"
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  visibilityToggle={{ visible: hienMatKhau, onVisibleChange: setHienMatKhau }}
                  value={matKhau}
                  onChange={(e) => {
                    setMatKhau(e.target.value)
                    if (loiDangNhap) setLoiDangNhap('')
                  }}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 6, span: 18 }} name="remember" valuePropName="checked">
                <Checkbox checked={nhoDangNhap} onChange={(e) => setNhoDangNhap(e.target.checked)}>
                  Nhớ mật khẩu
                </Checkbox>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                <Button htmlType="submit" type="primary" size="large" loading={dangGui}>
                  {dangGui ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </Form.Item>
            </Form>

            <p className="xac-thuc-switch-text">
              <Text type="secondary">Muốn chuyển sang khu vực khách hàng? </Text>
              <Link to="/dang-nhap">Mở đăng nhập khách hàng</Link>
            </p>
      </Card>
    </section>
  )
}

export default DangNhapNoiBoPage
