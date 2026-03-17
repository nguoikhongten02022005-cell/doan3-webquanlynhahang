export const thucHienDangNhap = async (dangNhap, identifier, password) => dangNhap(identifier, password)

export const thucHienDangNhapNoiBo = async (dangNhapNoiBo, tenDangNhapHoacEmail, matKhau) => (
  dangNhapNoiBo(tenDangNhapHoacEmail, matKhau)
)

export const thucHienDangKy = async (dangKy, thongTinDangKy) => dangKy(thongTinDangKy)
