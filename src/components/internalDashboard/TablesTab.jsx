function TablesTab({ scopeLabel, tableSummary }) {
  return (
    <article className="profile-card">
      <div className="host-board-head">
        <h2>Tình trạng bàn ăn</h2>
        <span>{scopeLabel}</span>
      </div>

      <div className="internal-table-grid">
        {tableSummary.map((area) => (
          <article key={area.id} className="host-stat-card internal-table-card">
            <span>{area.name}</span>
            <strong>{area.available}/{area.total}</strong>
            <p className="internal-table-note">
              {area.occupied} bàn đang phục vụ hoặc được giữ chỗ.
            </p>
          </article>
        ))}
      </div>
    </article>
  )
}

export default TablesTab
