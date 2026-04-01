import { Alert, Button, Card, Col, Form, Input, Row, Select, Space, Tag, Typography } from 'antd'
import { CAC_GOI_Y_GHI_CHU_DAT_BAN, CAC_DIP_DAT_BAN } from '../../data/duLieuDatBan'

const { TextArea } = Input

function BuocHaiDatBan({
  formData,
  fieldErrors,
  onFieldChange,
  onFieldBlur,
  onSuggestionClick,
}) {
  const noteLength = formData.notes.length

  return (
    <Card title="Thông tin liên hệ" variant="borderless">
      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Họ và tên *" validateStatus={fieldErrors.name ? 'error' : ''} help={fieldErrors.name || ''}>
              <Input placeholder="Nguyễn Văn A" value={formData.name} onChange={onFieldChange('name')} onBlur={onFieldBlur('name')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Số điện thoại *" validateStatus={fieldErrors.phone ? 'error' : ''} help={fieldErrors.phone || ''}>
              <Input placeholder="0901 234 567" value={formData.phone} onChange={onFieldChange('phone')} onBlur={onFieldBlur('phone')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Email" validateStatus={fieldErrors.email ? 'error' : ''} help={fieldErrors.email || ''}>
              <Input placeholder="example@gmail.com" value={formData.email} onChange={onFieldChange('email')} onBlur={onFieldBlur('email')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Dịp dùng bữa">
              <Select value={formData.occasion} onChange={(value) => onFieldChange('occasion')({ target: { value } })} options={[{ value: '', label: 'Không có' }, ...CAC_DIP_DAT_BAN.map((occasion) => ({ value: occasion, label: occasion }))]} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Ghi chú cho nhà hàng" validateStatus={fieldErrors.notes ? 'error' : ''} help={fieldErrors.notes || 'Tối đa 200 ký tự.'}>
              <TextArea rows={4} placeholder="VD: Có trẻ em, cần ghế cao, muốn bàn gần cửa sổ..." value={formData.notes} onChange={onFieldChange('notes')} onBlur={onFieldBlur('notes')} />
            </Form.Item>
            <div style={{ textAlign: 'right', marginTop: -8 }}><Typography.Text type="secondary">{noteLength}/200</Typography.Text></div>
          </Col>
        </Row>
      </Form>

      <Space wrap>
        {CAC_GOI_Y_GHI_CHU_DAT_BAN.map((item) => (
          <Tag key={item} color="default" style={{ cursor: 'pointer', padding: '6px 10px' }} onClick={() => onSuggestionClick(item)}>
            {item}
          </Tag>
        ))}
      </Space>
    </Card>
  )
}

export default BuocHaiDatBan
