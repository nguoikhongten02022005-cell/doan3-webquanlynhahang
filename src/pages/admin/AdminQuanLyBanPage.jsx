import { useEffect, useMemo, useState } from 'react'
import { Avatar, Button, Card, Col, Form, Input, InputNumber, Modal, Popconfirm, QRCode, Row, Segmented, Select, Space, Statistic, Table, Tag, Tooltip, Typography } from 'antd'
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, PlusOutlined, PrinterOutlined, QrcodeOutlined, TableOutlined } from '@ant-design/icons'
import { capNhatBanApi, layDanhSachBanApi, layQrBanApi, taoBanApi, xoaBanApi } from '../../services/api/apiBanAn'
import { layOrderDangMoTaiBanApi, xacNhanThanhToanTaiBanApi } from '../../services/api/apiBanTaiBan'
import { dinhDangTienTeVietNam } from '../../utils/tienTe'

const DANH_SACH_KHU_VUC = ['Trong nhà', 'Ngoài sân', 'Khu riêng', 'Tầng 2']
const NHAN_TRANG_THAI = {
  TRONG: { label: 'TRỐNG', color: 'green' },
  CO_KHACH: { label: 'CÓ KHÁCH', color: 'orange' },
  CHO_THANH_TOAN: { label: 'CHỜ THANH TOÁN', color: 'red' },
}

const trangThaiNoiBo = (trangThai) => {
  if (trangThai === 'TRONG' || trangThai === 'Available') return 'TRONG'
  if (trangThai === 'CO_KHACH' || trangThai === 'Occupied') return 'CO_KHACH'
  return 'CHO_THANH_TOAN'
}

function AdminQuanLyBanPage() {
  const [danhSachBan, setDanhSachBan] = useState([])
  const [dangTai, setDangTai] = useState(true)
  const [boLocTrangThai, setBoLocTrangThai] = useState('ALL')
  const [boLocKhuVuc, setBoLocKhuVuc] = useState('Tất cả')
  const [dangMoForm, setDangMoForm] = useState(false)
  const [banDangSua, setBanDangSua] = useState(null)
  const [qrDangXem, setQrDangXem] = useState(null)
  const [orderDangXem, setOrderDangXem] = useState(null)
  const [dangXuLy, setDangXuLy] = useState('')
  const [form] = Form.useForm()

  const taiLai = async () => {
    setDangTai(true)
    try {
      const { duLieu } = await layDanhSachBanApi()
      setDanhSachBan(Array.isArray(duLieu) ? duLieu : [])
    } finally {
      setDangTai(false)
    }
  }

  useEffect(() => {
    taiLai()
    const intervalId = window.setInterval(() => taiLai(), 3000)
    return () => window.clearInterval(intervalId)
  }, [])

  const thongKe = useMemo(() => ({
    tong: danhSachBan.length,
    trong: danhSachBan.filter((ban) => trangThaiNoiBo(ban.status) === 'TRONG').length,
    coKhach: danhSachBan.filter((ban) => trangThaiNoiBo(ban.status) === 'CO_KHACH').length,
    choThanhToan: danhSachBan.filter((ban) => trangThaiNoiBo(ban.status) === 'CHO_THANH_TOAN').length,
  }), [danhSachBan])

  const danhSachHienThi = useMemo(() => danhSachBan.filter((ban) => {
    const matchTrangThai = boLocTrangThai === 'ALL' || trangThaiNoiBo(ban.status) === boLocTrangThai
    const matchKhuVuc = boLocKhuVuc === 'Tất cả' || (ban.rawAreaText || '').includes(boLocKhuVuc)
    return matchTrangThai && matchKhuVuc
  }), [boLocKhuVuc, boLocTrangThai, danhSachBan])

  const moModalThem = () => {
    setBanDangSua(null)
    form.setFieldsValue({ maBan: '', tenBan: '', khuVuc: 'Trong nhà', sucChua: 4, ghiChu: '' })
    setDangMoForm(true)
  }

  const moModalSua = (ban) => {
    setBanDangSua(ban)
    form.setFieldsValue({ maBan: ban.code, tenBan: ban.name, khuVuc: ban.rawAreaText || 'Trong nhà', sucChua: ban.capacity, ghiChu: ban.note || '' })
    setDangMoForm(true)
  }

  const luuBan = async (values) => {
    const payload = {
      maBan: values.maBan,
      tenBan: values.tenBan,
      khuVuc: values.khuVuc,
      soChoNgoi: Number(values.sucChua),
      ghiChu: values.ghiChu || '',
      soBan: Number(String(values.tenBan).replace(/\D/g, '')) || 0,
      viTri: values.khuVuc,
    }

    if (banDangSua) {
      await capNhatBanApi(banDangSua.code, payload)
    } else {
      await taoBanApi(payload)
    }
    setBanDangSua(null)
    setDangMoForm(false)
    form.resetFields()
    await taiLai()
  }

  const moQr = async (ban) => {
    const { duLieu } = await layQrBanApi(ban.code)
    setQrDangXem(duLieu)
  }

  const taiQrVe = () => {
    if (!qrDangXem?.qrBase64) return
    const a = document.createElement('a')
    a.href = qrDangXem.qrBase64
    a.download = `${qrDangXem.tenBan || qrDangXem.maBan || 'qr-ban'}.png`
    a.click()
  }

  const moOrder = async (ban) => {
    const { duLieu } = await layOrderDangMoTaiBanApi(ban.code)
    setOrderDangXem({ ban, duLieu })
  }

  const xoaBan = async (ban) => {
    await xoaBanApi(ban.code)
    await taiLai()
  }

  const xacNhanThanhToan = async (ban) => {
    setDangXuLy(ban.code)
    try {
      await xacNhanThanhToanTaiBanApi(ban.code)
      setOrderDangXem(null)
      await taiLai()
    } finally {
      setDangXuLy('')
    }
  }

  const cotBan = [
    {
      title: 'Bàn',
      dataIndex: 'name',
      key: 'name',
      render: (_, ban) => (
        <Space>
          <Avatar icon={<TableOutlined />} style={{ background: '#f07d5c' }} />
          <div>
            <Typography.Text strong>{ban.name}</Typography.Text>
            <div><Typography.Text type="secondary">{ban.rawAreaText || 'Trong nhà'} • {ban.capacity} người</Typography.Text></div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, ban) => {
        const trangThai = NHAN_TRANG_THAI[trangThaiNoiBo(ban.status)]
        return <Tag color={trangThai.color}>{trangThai.label}</Tag>
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (value) => value || '---',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, ban) => {
        const coTheXoa = trangThaiNoiBo(ban.status) === 'TRONG'
        const canXacNhanThanhToan = trangThaiNoiBo(ban.status) === 'CHO_THANH_TOAN'
        return (
          <Space wrap>
            <Button icon={<EyeOutlined />} onClick={() => moOrder(ban)}>Xem order</Button>
            <Button icon={<QrcodeOutlined />} onClick={() => moQr(ban)}>QR Code</Button>
            <Button icon={<EditOutlined />} onClick={() => moModalSua(ban)}>Sửa</Button>
            <Tooltip title={coTheXoa ? '' : 'Bàn đang có khách'}>
              <span>
                <Popconfirm title="Xóa bàn này?" onConfirm={() => xoaBan(ban)} disabled={!coTheXoa}>
                  <Button icon={<DeleteOutlined />} danger disabled={!coTheXoa}>Xóa</Button>
                </Popconfirm>
              </span>
            </Tooltip>
            {canXacNhanThanhToan ? <Button type="primary" loading={dangXuLy === ban.code} onClick={() => xacNhanThanhToan(ban)}>Xác nhận thanh toán</Button> : null}
          </Space>
        )
      },
    },
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Tổng bàn" value={thongKe.tong} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Trống" value={thongKe.trong} valueStyle={{ color: '#059669' }} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Có khách" value={thongKe.coKhach} valueStyle={{ color: '#d97706' }} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Chờ thanh toán" value={thongKe.choThanhToan} valueStyle={{ color: '#dc2626' }} /></Card></Col>
      </Row>

      <Card title="Quản lý bàn" extra={<Button type="primary" icon={<PlusOutlined />} onClick={moModalThem}>Thêm bàn</Button>}>
        <Space wrap style={{ marginBottom: 16 }}>
          <Segmented options={[{ label: 'Tất cả', value: 'ALL' }, { label: 'Trống', value: 'TRONG' }, { label: 'Có khách', value: 'CO_KHACH' }, { label: 'Chờ thanh toán', value: 'CHO_THANH_TOAN' }]} value={boLocTrangThai} onChange={setBoLocTrangThai} />
          <Select value={boLocKhuVuc} onChange={setBoLocKhuVuc} style={{ minWidth: 180 }} options={['Tất cả', ...DANH_SACH_KHU_VUC].map((muc) => ({ label: muc, value: muc }))} />
        </Space>
        <Table rowKey="code" loading={dangTai} columns={cotBan} dataSource={danhSachHienThi} pagination={{ pageSize: 8 }} scroll={{ x: 920 }} />
      </Card>

      <Modal open={Boolean(qrDangXem)} title={qrDangXem?.tenBan} footer={null} onCancel={() => setQrDangXem(null)}>
        {qrDangXem ? (
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Typography.Text type="secondary">{qrDangXem.khuVuc}</Typography.Text>
            <div style={{ display: 'flex', justifyContent: 'center' }}><QRCode value={qrDangXem.url || ''} size={240} /></div>
            <Typography.Paragraph copyable={{ text: qrDangXem.url }} style={{ marginBottom: 0 }}>{qrDangXem.url}</Typography.Paragraph>
            <Space>
              <Button icon={<DownloadOutlined />} onClick={taiQrVe}>Tải QR về</Button>
              <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>In QR</Button>
            </Space>
          </Space>
        ) : null}
      </Modal>

      <Modal open={Boolean(orderDangXem)} title={orderDangXem ? `Order của ${orderDangXem.ban.name}` : 'Order'} onCancel={() => setOrderDangXem(null)} footer={null} width={720}>
        {orderDangXem ? (
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Table
              rowKey={(row, index) => `${row.MaMon || row.maMon}-${index}`}
              pagination={false}
              dataSource={orderDangXem.duLieu?.ChiTiet || orderDangXem.duLieu?.chiTiet || []}
              columns={[
                { title: 'Tên món', dataIndex: 'TenMon', key: 'TenMon', render: (_, row) => row.TenMon || row.tenMon },
                { title: 'Số lượng', dataIndex: 'SoLuong', key: 'SoLuong', width: 100, render: (_, row) => `x${row.SoLuong || row.soLuong}` },
                { title: 'Thành tiền', dataIndex: 'ThanhTien', key: 'ThanhTien', width: 140, render: (_, row) => dinhDangTienTeVietNam(row.ThanhTien || row.thanhTien) },
              ]}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography.Text strong>Tổng cộng</Typography.Text>
              <Typography.Text strong>{dinhDangTienTeVietNam(orderDangXem.duLieu?.DonHang?.TongTien || orderDangXem.duLieu?.donHang?.tongTien || 0)}</Typography.Text>
            </div>
            <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
              <Button onClick={() => setOrderDangXem(null)}>Đóng</Button>
              {trangThaiNoiBo(orderDangXem.ban.status) === 'CHO_THANH_TOAN' ? <Button type="primary" onClick={() => xacNhanThanhToan(orderDangXem.ban)}>Xác nhận thanh toán</Button> : null}
            </Space>
          </Space>
        ) : null}
      </Modal>

      <Modal open={dangMoForm} footer={null} onCancel={() => { setBanDangSua(null); setDangMoForm(false); form.resetFields(); }} title={banDangSua ? 'Sửa bàn' : 'Thêm bàn mới'} destroyOnClose>
        <Form layout="vertical" form={form} onFinish={luuBan}>
          <Form.Item label="Mã bàn" name="maBan" rules={[{ required: true }]}><Input readOnly={Boolean(banDangSua)} /></Form.Item>
          <Form.Item label="Tên bàn" name="tenBan" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Khu vực" name="khuVuc" rules={[{ required: true }]}><Select options={DANH_SACH_KHU_VUC.map((muc) => ({ label: muc, value: muc }))} /></Form.Item>
          <Form.Item label="Sức chứa" name="sucChua" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Ghi chú" name="ghiChu"><Input /></Form.Item>
          <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button onClick={() => { setBanDangSua(null); setDangMoForm(false); form.resetFields(); }}>Hủy</Button>
            <Button type="primary" htmlType="submit">Lưu bàn</Button>
          </Space>
        </Form>
      </Modal>
    </Space>
  )
}

export default AdminQuanLyBanPage
