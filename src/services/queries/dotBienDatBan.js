export const thucHienGuiDatBan = async (createBooking, duLieuDatBan, duLieuXacNhan) => createBooking({
  booking: duLieuDatBan,
  confirmationPayload: duLieuXacNhan,
})
