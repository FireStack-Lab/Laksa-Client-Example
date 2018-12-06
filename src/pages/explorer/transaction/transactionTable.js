import { Table } from 'antd'

export default function TransactionTable({
  dataSource,
  current,
  total,
  onClick,
  onChange
}) {
  const txnHashes = dataSource || []
  const newTxnHashes = []
  txnHashes.forEach(
    (d, index) =>
      (newTxnHashes[index] = {
        key: d,
        txn: d
      })
  )
  return (
    <Table
      dataSource={newTxnHashes}
      columns={[
        {
          title: 'Transaction Hash',
          dataIndex: 'txn',
          render: (text, record) => {
            return (
              <span
                style={{ cursor: 'pointer', color: '#3399ff' }}
                onClick={() => {
                  onClick({
                    txHash: `${record.txn}`
                  })
                }}>
                {record.txn.toUpperCase()}
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
      rowKey={record => record.key}
    />
  )
}
