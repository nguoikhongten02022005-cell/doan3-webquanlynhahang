import { useCallback, useMemo } from 'react'
import { useThongBaoStore } from '../stores/thongBaoStore'

const THOI_GIAN_THONG_BAO = 2600

export function useThongBao() {
  const hienThongBaoStore = useThongBaoStore((trangThai) => trangThai.hienThongBao)

  const hienThongBao = useCallback(({ message, tone = 'neutral', duration = THOI_GIAN_THONG_BAO, title = '' }) => {
    hienThongBaoStore({ message, tone, duration, title })
  }, [hienThongBaoStore])

  return useMemo(() => ({
    hienThongBao,
    hienThanhCong: (message, title = 'Thành công') => hienThongBao({ message, tone: 'success', title }),
    hienLoi: (message, title = 'Có lỗi xảy ra') => hienThongBao({ message, tone: 'danger', title }),
    hienCanhBao: (message, title = 'Lưu ý') => hienThongBao({ message, tone: 'warning', title }),
    hienThongTin: (message, title = 'Thông báo') => hienThongBao({ message, tone: 'neutral', title }),
  }), [hienThongBao])
}
