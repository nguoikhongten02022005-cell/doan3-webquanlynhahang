import {
  CAC_CA_KHUNG_GIO_DAT_BAN,
  CAC_SO_KHACH_DAT_BAN,
  NHAN_TIN_HIEU_KHA_DUNG_DAT_BAN,
} from '../../data/duLieuDatBan'
import { Alert, Button, Card, Col, DatePicker, Row, Space, Tag, Typography } from 'antd'
import dayjs from 'dayjs'

const { Title, Paragraph, Text } = Typography

const MAU_ANTD_DAT_BAN = {
  nutChon: { borderColor: '#ead7c5', background: '#fffaf4', color: '#2b1b14' },
  nutDangChon: { borderColor: '#e8664a', background: '#e8664a', color: '#ffffff' },
  nutVoHieu: { borderColor: '#ede5db', background: '#f7f1ea', color: '#b2a79a' },
  canhBao: { borderColor: '#facc15', background: '#fffbeb' },
}

function BuocMotDatBan({
  formData,
  dateOptions,
  selectedDateLabel,
  selectedDayLabel,
  minDate,
  maxDate,
  availabilityByArea,
  areaOptions,
  timeSlotOptions,
  selectedAreaUnavailableMessage,
  largePartyNotice,
  onGuestSelect,
  onDateSelect,
  onDateInputChange,
  onTimeSelect,
  onAreaToggle,
}) {
  const hasSelectedDate = Boolean(formData.date)
  const hasSelectedTime = Boolean(formData.time)
  const hasSelectedGuests = Boolean(Number(formData.guests) > 0)

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Title level={3} style={{ margin: 0 }}>Chọn số khách, ngày, giờ và khu vực bạn muốn ưu tiên.</Title>
      </Card>

      <Card title="Chọn số khách" extra={<Text type="secondary">Nhóm từ 6 khách nên đặt sớm để có bàn phù hợp.</Text>}>
        <div className="dat-ban-flow-section-head">
        </div>

        <Row gutter={[12, 12]} role="list" aria-label="Chọn số khách">
          {CAC_SO_KHACH_DAT_BAN.map((guestCount) => {
            const isActive = String(guestCount) === String(formData.guests)
            return (
              <Col xs={12} sm={8} md={6} lg={4} key={guestCount}>
                <Button type={isActive ? 'primary' : 'default'} block style={isActive ? MAU_ANTD_DAT_BAN.nutDangChon : MAU_ANTD_DAT_BAN.nutChon} onClick={() => onGuestSelect(String(guestCount))}>
                  {guestCount} khách
                </Button>
              </Col>
            )
          })}

          <Col xs={12} sm={8} md={6} lg={4}>
            <Button block danger onClick={() => onGuestSelect('10')}>10+ Gọi hotline</Button>
          </Col>
        </Row>

        {largePartyNotice ? (
          <Alert type="warning" showIcon title={<span><strong>Nhóm lớn vui lòng gọi hotline.</strong> <a href="tel:02838256789">{largePartyNotice}</a></span>} style={{ marginTop: 16 }} />
        ) : null}
      </Card>

      <Card title="Chọn ngày" extra={<Text type="secondary">Cuối tuần được đánh dấu nhẹ vì thường kín chỗ hơn.</Text>}>
        <Row gutter={[12, 12]} role="list" aria-label="Ngày dùng bữa gợi ý">
          {dateOptions.map((option) => {
            const isActive = option.value === formData.date
            const trangThaiStyle = option.isDisabled ? MAU_ANTD_DAT_BAN.nutVoHieu : isActive ? MAU_ANTD_DAT_BAN.nutDangChon : MAU_ANTD_DAT_BAN.nutChon
            return (
              <Col xs={12} sm={8} md={6} xl={4} key={option.value}>
                <Button
                  type={isActive ? 'primary' : 'default'}
                  block
                  disabled={option.isDisabled}
                  title={option.isDisabled ? option.disabledReason : option.dayLabel}
                  style={trangThaiStyle}
                  onClick={() => onDateSelect(option.value)}
                >
                  {option.label} • {option.dayLabel}{option.isDisabled ? ' 🚫' : ''}
                </Button>
              </Col>
            )
          })}
        </Row>

        <div style={{ marginTop: 16 }}>
          <Text strong>Xem lịch đầy đủ</Text>
          <div style={{ marginTop: 8 }}>
            <DatePicker value={formData.date ? dayjs(formData.date) : null} format="DD/MM/YYYY" onChange={(value) => onDateInputChange({ target: { value: value ? value.format('YYYY-MM-DD') : '' } })} minDate={dayjs(minDate)} maxDate={dayjs(maxDate)} style={{ width: '100%' }} />
          </div>
          <Text type="secondary">Chỉ nhận đặt bàn trong vòng 30 ngày tới.</Text>
        </div>
      </Card>

      <Card title="Chọn khung giờ" extra={hasSelectedDate ? <Text type="secondary">{selectedDateLabel} {selectedDayLabel ? `· ${selectedDayLabel}` : ''}</Text> : null}>
        <div className="dat-ban-flow-section-head">
        </div>

        {!hasSelectedDate ? (
          <Alert type="info" showIcon title="Chọn ngày trước để xem khung giờ." description="Ngay khi có ngày dùng bữa, chúng tôi sẽ gợi ý các khung giờ còn phù hợp với lựa chọn của bạn." />
        ) : (
          <Space orientation="vertical" size={16} style={{ width: '100%' }}>
            {CAC_CA_KHUNG_GIO_DAT_BAN.map((period) => (
              <Card key={period.id} size="small" title={<span>{period.icon} {period.label}</span>} extra={<Text type="secondary">{period.timeRange}</Text>}>
                <div className="dat-ban-time-period-head">
                  <Text type="secondary">🟢 {NHAN_TIN_HIEU_KHA_DUNG_DAT_BAN.AVAILABLE} · 🟡 {NHAN_TIN_HIEU_KHA_DUNG_DAT_BAN.LIMITED} · 🔴 {NHAN_TIN_HIEU_KHA_DUNG_DAT_BAN.FULL}</Text>
                </div>

                <Row gutter={[12, 12]}>
                  {period.slots.map((slot) => {
                    const slotOption = timeSlotOptions.find((item) => item.time === slot)
                    if (!slotOption) return null

                    const isActive = slotOption.time === formData.time
                    return (
                      <Col xs={12} md={8} lg={6} key={slotOption.time}>
                        <Button type={isActive ? 'primary' : 'default'} block disabled={slotOption.isDisabled} onClick={() => onTimeSelect(slotOption.time)} style={slotOption.isDisabled ? MAU_ANTD_DAT_BAN.nutVoHieu : isActive ? MAU_ANTD_DAT_BAN.nutDangChon : MAU_ANTD_DAT_BAN.nutChon}>
                          {slotOption.time} • {slotOption.availabilityLabel}
                        </Button>
                      </Col>
                    )
                  })}
                </Row>
              </Card>
            ))}
          </Space>
        )}
      </Card>

      <Card title="Chọn khu vực (tuỳ chọn)" extra={<Text type="secondary">Nhà hàng sẽ cố gắng sắp xếp theo ưu tiên này nhưng không cam kết 100%.</Text>}>

        {!hasSelectedTime ? (
          <Alert type="info" showIcon title="Chọn giờ dùng bữa để xem khu vực phù hợp." description="Khi đã có ngày và giờ, hệ thống sẽ gợi ý mức độ khả dụng của từng khu vực để bạn chọn nhanh hơn." />
        ) : !hasSelectedGuests ? (
          <Alert type="info" showIcon title="Chọn số khách để xem bàn phù hợp." description="Sau khi biết số khách, hệ thống sẽ tính số bàn phù hợp theo từng khu vực để bạn chọn nhanh và chính xác hơn." />
        ) : (
          <>
            <Row gutter={[12, 12]}>
              {areaOptions.map((area) => {
                const availability = availabilityByArea[area.value]
                const isActive = formData.seatingArea === area.value
                return (
                  <Col xs={24} md={12} xl={8} key={area.value}>
                    <Card hoverable size="small" style={availability.count === 0 ? MAU_ANTD_DAT_BAN.nutVoHieu : isActive ? MAU_ANTD_DAT_BAN.nutDangChon : MAU_ANTD_DAT_BAN.nutChon} onClick={() => availability.count > 0 && onAreaToggle(area.value)}>
                      <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                        <Space>
                          <span>{area.icon}</span>
                          <Text strong>{area.label}</Text>
                        </Space>
                        {area.recommendationBadge ? <Tag color="gold">{area.recommendationBadge}</Tag> : null}
                        <Paragraph style={{ marginBottom: 0 }}>{area.description}</Paragraph>
                        {area.recommendationNote ? <Text type="secondary">{area.recommendationNote}</Text> : null}
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Tag color={availability.count <= 0 ? 'red' : availability.tone === 'limited' ? 'gold' : 'green'}>{availability.label}</Tag>
                          <Text type="secondary">Còn: {availability.count} bàn</Text>
                        </Space>
                      </Space>
                    </Card>
                  </Col>
                )
              })}
            </Row>
            {selectedAreaUnavailableMessage ? <Alert style={{ marginTop: 16 }} type="error" showIcon title={selectedAreaUnavailableMessage} /> : null}
          </>
        )}
      </Card>
    </Space>
  )
}

export default BuocMotDatBan
