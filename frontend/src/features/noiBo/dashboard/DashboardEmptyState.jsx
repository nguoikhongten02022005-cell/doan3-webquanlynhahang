import { Empty } from 'antd'

const layKichThuocAnh = ({ compact, table }) => {
  if (table) return { height: 42 }
  if (compact) return { height: 36 }
  return { height: 48 }
}

function DashboardEmptyState({ title, description, compact = false, table = false }) {
  const className = [
    'noi-bo-dashboard-empty',
    compact ? 'noi-bo-dashboard-empty--compact' : '',
    table ? 'noi-bo-dashboard-empty--table' : '',
  ].filter(Boolean).join(' ')

  return (
    <Empty
      className={className}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      imageStyle={layKichThuocAnh({ compact, table })}
      description={(
        <div className="noi-bo-dashboard-empty__description">
          <strong>{title}</strong>
          <span>{description}</span>
        </div>
      )}
    />
  )
}

export default DashboardEmptyState
