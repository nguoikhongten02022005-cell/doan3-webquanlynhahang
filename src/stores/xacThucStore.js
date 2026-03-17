import { create } from 'zustand'
import { VAI_TRO_XAC_THUC, layNguoiDungHienTai } from '../services/dichVuXacThuc'

const layVaiTro = (nguoiDungHienTai) => nguoiDungHienTai?.role ?? VAI_TRO_XAC_THUC.KHACH_HANG

export const useXacThucStore = create((set) => ({
  nguoiDungHienTai: layNguoiDungHienTai(),
  dangKhoiTaoXacThuc: true,
  datNguoiDungHienTai: (nguoiDungHienTai) => set({ nguoiDungHienTai }),
  datDangKhoiTaoXacThuc: (dangKhoiTaoXacThuc) => set({ dangKhoiTaoXacThuc }),
  xoaPhienHienTai: () => set({ nguoiDungHienTai: null, dangKhoiTaoXacThuc: false }),
  layTrangThaiDaTinhToan: () => set((trangThai) => {
    const vaiTro = layVaiTro(trangThai.nguoiDungHienTai)
    const laAdmin = vaiTro === VAI_TRO_XAC_THUC.QUAN_TRI
    const laNhanVien = vaiTro === VAI_TRO_XAC_THUC.NHAN_VIEN

    return {
      vaiTro,
      laAdmin,
      laNhanVien,
      coTheVaoNoiBo: laAdmin || laNhanVien,
      daDangNhap: Boolean(trangThai.nguoiDungHienTai),
    }
  }),
}))
