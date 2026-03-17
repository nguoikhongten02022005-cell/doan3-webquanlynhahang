import { create } from 'zustand'

let demThongBao = 0

export const useThongBaoStore = create((set) => ({
  danhSachThongBao: [],
  hienThongBao: ({ message, tone = 'neutral', duration = 2600, title = '' }) => {
    const id = `thong-bao-${Date.now()}-${demThongBao++}`

    set((trangThai) => ({
      danhSachThongBao: [...trangThai.danhSachThongBao, { id, message, tone, duration, title }],
    }))

    if (typeof window !== 'undefined' && duration > 0) {
      window.setTimeout(() => {
        set((trangThai) => ({
          danhSachThongBao: trangThai.danhSachThongBao.filter((thongBao) => thongBao.id !== id),
        }))
      }, duration)
    }
  },
  dongThongBao: (id) => set((trangThai) => ({
    danhSachThongBao: trangThai.danhSachThongBao.filter((thongBao) => thongBao.id !== id),
  })),
}))
