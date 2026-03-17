import { useThongBaoStore } from '../stores/thongBaoStore'

function ThongBaoHost() {
  const danhSachThongBao = useThongBaoStore((trangThai) => trangThai.danhSachThongBao)
  const dongThongBao = useThongBaoStore((trangThai) => trangThai.dongThongBao)

  return (
    <div className="notification-stack" aria-live="polite" aria-atomic="true">
      {danhSachThongBao.map((thongBao) => (
        <div key={thongBao.id} className={`notification-card tone-${thongBao.tone}`} role="status">
          <div className="notification-copy">
            {thongBao.title ? <strong>{thongBao.title}</strong> : null}
            <p>{thongBao.message}</p>
          </div>

          <button
            type="button"
            className="notification-close"
            onClick={() => dongThongBao(thongBao.id)}
            aria-label="Đóng thông báo"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default ThongBaoHost
