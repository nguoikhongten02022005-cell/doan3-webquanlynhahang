function docBienMoiTruongBatBuoc(tenBien) {
  const giaTri = process.env[tenBien]

  if (typeof giaTri !== 'string' || !giaTri.trim()) {
    throw new Error(`Thiếu ${tenBien} trong file .env để chạy smoke API.`)
  }

  return giaTri.trim()
}

const apiBaseUrl = docBienMoiTruongBatBuoc('SMOKE_API_BASE_URL')

function taoMa(prefix) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`
}

async function goiApi(path, { method = 'GET', body, token, expectStatus = 200 } = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  let json = null

  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = { raw: text }
  }

  const danhSachTrangThaiHopLe = Array.isArray(expectStatus) ? expectStatus : [expectStatus]

  if (!danhSachTrangThaiHopLe.includes(response.status)) {
    throw new Error(`API ${method} ${path} tra ${response.status}, mong doi ${expectStatus}: ${JSON.stringify(json)}`)
  }

  return json
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function main() {
  const suffix = Date.now()
  const email = `smoke${suffix}@mail.com`
  const matKhau = 'Test@123'
  const maBan = taoMa('BSMOKE')
  const maDatBan = taoMa('DBSMOKE')
  const maDonMangVe = taoMa('DHMVSMOKE')
  const maDonTaiBan = taoMa('DHBANSMOKE')

  console.log('1. Kiem tra thuc don')
  const thucDon = await goiApi('/thuc-don')
  assert(Array.isArray(thucDon.data) && thucDon.data.length > 0, 'Thuc don rong')

  console.log('2. Dang ky va dang nhap')
  const dangKy = await goiApi('/auth/register', {
    method: 'POST',
    expectStatus: [200, 201],
    body: {
      hoTen: `Smoke ${suffix}`,
      email,
      matKhau,
      xacNhanMatKhau: matKhau,
      soDienThoai: `09${String(suffix).slice(-8)}`,
      diaChi: 'Linux Smoke Test',
    },
  })
  assert(dangKy.data?.accessToken, 'Dang ky khong tra accessToken')

  const dangNhap = await goiApi('/auth/login', {
    method: 'POST',
    expectStatus: [200, 201],
    body: { email, matKhau },
  })
  const token = dangNhap.data?.accessToken
  assert(token, 'Dang nhap khong tra accessToken')

  const me = await goiApi('/auth/me', { token })
  assert(me.data?.email === email, 'Thong tin me khong khop')

  console.log('3. Voucher va ban')
  const voucher = await goiApi('/ma-giam-gia/validate', {
    method: 'POST',
    expectStatus: [200, 201],
    body: { maCode: 'WELCOME10', tongTien: 250000 },
  })
  assert(voucher.data?.maCode === 'WELCOME10', 'Validate voucher that bai')

  await goiApi('/ban', {
    method: 'POST',
    expectStatus: [200, 201],
    body: {
      maBan,
      tenBan: 'Ban smoke',
      khuVuc: 'Test',
      soBan: 77,
      soChoNgoi: 4,
      viTri: 'Linux',
      ghiChu: 'Smoke test',
    },
  })

  console.log('4. Dat ban')
  const datBan = await goiApi('/dat-ban', {
    method: 'POST',
    expectStatus: [200, 201],
    body: {
      maDatBan,
      maKH: 'KH001',
      maBan: 'B001',
      ngayDat: '2026-12-31',
      gioDat: '18:00:00',
      gioKetThuc: '20:00:00',
      soNguoi: 2,
      ghiChu: 'Smoke dat ban',
    },
  })
  assert(datBan.data?.maDatBan === maDatBan, 'Tao dat ban that bai')

  console.log('5. Don mang ve')
  const donMangVe = await goiApi('/mang-ve/don-hang', {
    method: 'POST',
    expectStatus: [200, 201],
    body: {
      maDonHang: maDonMangVe,
      maKH: 'KH001',
      diaChiGiao: '123 Smoke Street',
      ghiChu: 'Smoke mang ve',
      items: [
        { maMon: 'M001', soLuong: 2 },
        { maMon: 'M008', soLuong: 1 },
      ],
    },
  })
  assert(donMangVe.data?.donHang?.maDonHang === maDonMangVe, 'Don mang ve sai maDonHang')
  assert(donMangVe.data?.donHang?.tongTien === 100000, 'TongTien don mang ve sai')
  assert(donMangVe.data?.donHang?.pricingSummary?.tamTinh === 95000, 'Tam tinh don mang ve sai')
  assert(donMangVe.data?.donHang?.pricingSummary?.phiDichVu === 5000, 'Phi dich vu don mang ve sai')
  assert(Array.isArray(donMangVe.data?.chiTiet) && donMangVe.data.chiTiet.length === 2, 'Chi tiet don mang ve sai')

  console.log('6. Don tai ban')
  const donTaiBan = await goiApi('/ban/B003/order', {
    method: 'POST',
    expectStatus: [200, 201],
    body: {
      maDonHang: maDonTaiBan,
      items: [
        { maMon: 'M001', soLuong: 1 },
        { maMon: 'M002', soLuong: 2 },
      ],
      ghiChu: 'Smoke tai ban',
    },
  })
  assert(donTaiBan.data?.donHang?.maDonHang === maDonTaiBan, 'Don tai ban sai maDonHang')
  assert(donTaiBan.data?.donHang?.tongTien === 131000, 'TongTien don tai ban sai')
  assert(donTaiBan.data?.donHang?.pricingSummary?.tamTinh === 125000, 'Tam tinh don tai ban sai')
  assert(donTaiBan.data?.donHang?.pricingSummary?.phiDichVu === 6000, 'Phi dich vu don tai ban sai')
  assert(Array.isArray(donTaiBan.data?.chiTiet) && donTaiBan.data.chiTiet.length === 2, 'Chi tiet don tai ban sai')

  console.log('7. Admin flow cap nhat')
  const capNhatDonMangVe = await goiApi(`/mang-ve/admin/don-hang/${maDonMangVe}/trang-thai`, {
    method: 'PATCH',
    body: { trangThai: 'Preparing' },
  })
  assert(capNhatDonMangVe.data?.donHang?.trangThai === 'Preparing', 'Cap nhat trang thai don mang ve that bai')

  const dsDonMangVeAdmin = await goiApi('/mang-ve/admin/don-hang')
  const donMangVeAdmin = Array.isArray(dsDonMangVeAdmin.data)
    ? dsDonMangVeAdmin.data.find((don) => don.MaDonHang === maDonMangVe)
    : null
  assert(donMangVeAdmin, 'Khong tim thay don mang ve moi tao trong danh sach admin')
  assert(Array.isArray(donMangVeAdmin.DanhSachMon) && donMangVeAdmin.DanhSachMon.length === 2, 'DanhSachMon admin khong dung')

  const capNhatDonTaiBan = await goiApi(`/don-hang/${maDonTaiBan}/status`, {
    method: 'PATCH',
    body: { trangThai: 'Confirmed' },
  })
  assert(capNhatDonTaiBan.data?.donHang?.trangThai === 'Confirmed', 'Cap nhat trang thai don tai ban that bai')

  const capNhatDatBan = await goiApi(`/dat-ban/${maDatBan}/status`, {
    method: 'PATCH',
    body: { trangThai: 'Confirmed' },
  })
  assert(capNhatDatBan.data?.trangThai === 'Confirmed', 'Cap nhat trang thai dat ban that bai')

  console.log('8. Danh gia loi nghiep vu')
  await goiApi('/danh-gia', {
    method: 'POST',
    body: {
      maDanhGia: taoMa('DGDUP'),
      maKH: 'KH001',
      maDonHang: 'DH001',
      soSao: 4,
      noiDung: 'Duplicate review',
    },
    expectStatus: 409,
  })

  await goiApi(`/danh-gia/${taoMa('DG404')}/duyet`, {
    method: 'PATCH',
    body: { trangThai: 'Approved', phanHoi: 'Khong ton tai' },
    expectStatus: 404,
  })

  console.log('9. Don dep ban test')
  await goiApi(`/ban/${maBan}`, { method: 'DELETE' })

  console.log('Smoke API PASS')
}

main().catch((error) => {
  console.error('Smoke API FAIL')
  console.error(error.message)
  process.exit(1)
})
