import { trinhKhachApi, tachPhanHoiApi, coSuDungMayChu } from '../trinhKhachApi'
import {
  taoPhanHoiOffline,
  layThucDonTheoBanOffline,
  timDonHangOfflineTheoMa,
  timBanOfflineTheoMa,
  taoChiTietDonHangTaiBanOffline,
  capNhatHeThongOffline,
  taoMaDonHangMoiOffline,
} from '../offline/dichVuOfflineStore'

const timOrderDangMoTheoBan = (maBan) => {
  const ban = timBanOfflineTheoMa(maBan)
  if (!ban) {
    throw new Error('Bàn không tồn tại hoặc QR code không hợp lệ')
  }

  const candidate = timDonHangOfflineTheoMa(ban.activeOrderCode || '')
  if (candidate && candidate.loaiDon === 'TAI_QUAN' && candidate.trangThai !== 'Paid' && candidate.trangThai !== 'Cancelled') {
    return candidate
  }

  return null
}

export const layThucDonTheoBanApi = async (maBan) => {
  if (!coSuDungMayChu()) {
    return tachPhanHoiApi(taoPhanHoiOffline(layThucDonTheoBanOffline(maBan), 'Lay thuc don theo ban thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.get(`/ban/${maBan}/thuc-don`))
}

export const guiOrderTaiBanApi = async (maBan, danhSachMon) => {
  if (!coSuDungMayChu()) {
    let duLieu = null

    capNhatHeThongOffline((draft) => {
      const ban = draft.ban.find((item) => String(item.code || item.id) === String(maBan || ''))
      if (!ban) {
        throw new Error('Bàn không tồn tại hoặc QR code không hợp lệ')
      }

      const danhSachChiTiet = Array.isArray(danhSachMon) ? danhSachMon.map((item, index) => {
        const mon = draft.thucDon.find((dish) => String(dish.maMon || dish.MaMon) === String(item.maMon || ''))
        const soLuong = Number(item.soLuong || 0)
        const donGia = Number(mon?.gia || mon?.Gia || 0)
        return {
          maChiTiet: item.maChiTiet || `CTBAN_${Date.now()}_${index}`,
          MaChiTiet: item.maChiTiet || `CTBAN_${Date.now()}_${index}`,
          maMon: item.maMon,
          MaMon: item.maMon,
          tenMon: mon?.tenMon || mon?.TenMon || item.maMon,
          TenMon: mon?.tenMon || mon?.TenMon || item.maMon,
          soLuong,
          SoLuong: soLuong,
          donGia,
          DonGia: donGia,
          thanhTien: donGia * soLuong,
          ThanhTien: donGia * soLuong,
        }
      }) : []

      const tongTien = danhSachChiTiet.reduce((sum, item) => sum + Number(item.thanhTien || 0), 0)
      const maDonHang = ban.activeOrderCode || taoMaDonHangMoiOffline('DH')
      const donHang = {
        maDonHang,
        orderCode: maDonHang,
        maKH: '',
        loaiDon: 'TAI_QUAN',
        trangThai: 'Preparing',
        tongTien,
        phiShip: 0,
        ngayTao: new Date().toISOString(),
        customer: { fullName: '', phone: '', email: '', address: '' },
        items: danhSachChiTiet.map((item) => ({
          id: item.maChiTiet,
          maChiTiet: item.maChiTiet,
          maMon: item.maMon,
          tenMon: item.tenMon,
          soLuong: item.soLuong,
          donGia: item.donGia,
          thanhTien: item.thanhTien,
          quantity: item.soLuong,
          price: item.donGia,
          name: item.tenMon,
        })),
        danhSachMon: danhSachChiTiet.map((item) => ({
          tenMon: item.tenMon,
          soLuong: item.soLuong,
          donGia: item.donGia,
          thanhTien: item.thanhTien,
        })),
      }

      draft.donHang = draft.donHang.filter((order) => String(order.maDonHang || '') !== maDonHang)
      draft.donHang.push(donHang)
      ban.activeOrderCode = maDonHang
      ban.status = 'CO_KHACH'
      duLieu = {
        donHang: { maDonHang, tongTien },
        chiTiet: danhSachChiTiet,
      }
    })

    return tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Gui order thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.post(`/ban/${maBan}/order`, { danhSachMon }))
}

export const layOrderDangMoTaiBanApi = async (maBan) => {
  if (!coSuDungMayChu()) {
    const order = timOrderDangMoTheoBan(maBan)
    return tachPhanHoiApi(taoPhanHoiOffline(order ? taoChiTietDonHangTaiBanOffline(order) : null, 'Lay order dang mo thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.get(`/ban/${maBan}/order`))
}

export const guiYeuCauThanhToanTaiBanApi = async (maBan) => {
  if (!coSuDungMayChu()) {
    capNhatHeThongOffline((draft) => {
      const ban = draft.ban.find((item) => String(item.code || item.id) === String(maBan || ''))
      if (!ban) {
        throw new Error('Bàn không tồn tại hoặc QR code không hợp lệ')
      }
      ban.status = 'CHO_THANH_TOAN'
    })

    return tachPhanHoiApi(taoPhanHoiOffline(null, 'Da gui yeu cau thanh toan'))
  }

  return tachPhanHoiApi(await trinhKhachApi.post(`/ban/${maBan}/yeu-cau-thanh-toan`, {}))
}

export const xacNhanThanhToanTaiBanApi = async (maBan) => {
  if (!coSuDungMayChu()) {
    capNhatHeThongOffline((draft) => {
      const ban = draft.ban.find((item) => String(item.code || item.id) === String(maBan || ''))
      if (!ban) {
        throw new Error('Bàn không tồn tại hoặc QR code không hợp lệ')
      }

      const donHang = draft.donHang.find((item) => String(item.maDonHang || '') === String(ban.activeOrderCode || ''))
      if (donHang) {
        donHang.trangThai = 'Paid'
      }

      ban.status = 'TRONG'
      ban.activeOrderCode = ''
    })

    return tachPhanHoiApi(taoPhanHoiOffline(null, 'Xac nhan thanh toan thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.post(`/ban/${maBan}/xac-nhan-thanh-toan`, {}))
}
