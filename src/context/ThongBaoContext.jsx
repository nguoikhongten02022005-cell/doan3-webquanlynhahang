import { useCallback, useMemo } from 'react'
import { App as UngDungAntd } from 'antd'

const THOI_GIAN_THONG_BAO = 2.6

export function useThongBao() {
  const { notification } = UngDungAntd.useApp()

  const hienThongBao = useCallback(({ message, tone = 'neutral', duration = THOI_GIAN_THONG_BAO, title = '' }) => {
    const loaiThongBao = {
      success: 'success',
      danger: 'error',
      warning: 'warning',
      neutral: 'info',
    }[tone] || 'info'

    notification[loaiThongBao]({
      message: title || 'Thong bao',
      description: message,
      duration,
      placement: 'topRight',
    })
  }, [notification])

  const giaTriBoiCanh = useMemo(() => ({
    hienThongBao,
    hienThanhCong: (message, title = 'Thành công') => hienThongBao({ message, tone: 'success', title }),
    hienLoi: (message, title = 'Có lỗi xảy ra') => hienThongBao({ message, tone: 'danger', title }),
    hienCanhBao: (message, title = 'Lưu ý') => hienThongBao({ message, tone: 'warning', title }),
    hienThongTin: (message, title = 'Thông báo') => hienThongBao({ message, tone: 'neutral', title }),
  }), [hienThongBao])

  return giaTriBoiCanh
}
