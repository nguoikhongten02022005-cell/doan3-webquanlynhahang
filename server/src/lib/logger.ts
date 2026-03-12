type DuLieuLog = Record<string, unknown>

const ghi = (capDo: 'info' | 'error', thongDiep: string, duLieu?: DuLieuLog) => {
  const banGhi = {
    capDo,
    thongDiep,
    thoiGian: new Date().toISOString(),
    ...(duLieu ? { duLieu } : {}),
  }

  if (capDo === 'error') {
    console.error(JSON.stringify(banGhi))
    return
  }

  console.info(JSON.stringify(banGhi))
}

export const logger = {
  info: (thongDiep: string, duLieu?: DuLieuLog) => ghi('info', thongDiep, duLieu),
  error: (thongDiep: string, duLieu?: DuLieuLog) => ghi('error', thongDiep, duLieu),
}
