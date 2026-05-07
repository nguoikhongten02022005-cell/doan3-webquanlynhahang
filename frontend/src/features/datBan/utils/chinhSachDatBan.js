export const taiDuLieuBanCongKhai = async ({
  coTheVaoNoiBo,
  layDanhSachBanApi,
  layDanhSachDatBanHost,
}) => {
  const [{ duLieu: duLieuBan }, danhSachDatBan] = await Promise.all([
    layDanhSachBanApi(),
    coTheVaoNoiBo ? layDanhSachDatBanHost() : Promise.resolve([]),
  ])

  return {
    duLieuBan: Array.isArray(duLieuBan) ? duLieuBan : [],
    danhSachDatBan: Array.isArray(danhSachDatBan) ? danhSachDatBan : [],
  }
}