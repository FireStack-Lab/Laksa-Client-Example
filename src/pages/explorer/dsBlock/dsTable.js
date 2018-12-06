import { Table } from 'antd'

export default function DSTable({
  dataSource,
  current,
  total,
  onClick,
  onChange
}) {
  return (
    <Table
      dataSource={dataSource}
      columns={[
        {
          title: 'BlockNum',
          dataIndex: 'BlockNum',
          width: '30%',
          render: data => {
            return (
              <span
                style={{ cursor: 'pointer', color: '#3399ff' }}
                onClick={() => {
                  onClick({ blockNumber: `${data}` })
                }}>
                {data}
              </span>
            )
          }
        },
        {
          title: 'Hash',
          dataIndex: 'Hash',
          render: (text, record) => {
            return (
              <span
                style={{ cursor: 'pointer', color: '#3399ff' }}
                onClick={() => {
                  onClick({
                    blockNumber: `${record.BlockNum}`
                  })
                }}>
                {text.toUpperCase()}
              </span>
            )
          }
        }
      ]}
      pagination={{
        current: current,
        total: total,
        onChange: current => {
          onChange({ page: current })
        }
      }}
      rowKey={record => record.BlockNum}
    />
  )
}
