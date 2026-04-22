import { Empty } from 'antd'

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
