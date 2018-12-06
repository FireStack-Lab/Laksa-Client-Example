import { connect } from 'dva'
import { Spin } from 'antd'
import TableItem from '../../../component/TableItem'

// import { createAction } from '../../../utils'

const TXBlockInfo = props => {
  const { header, body, loading } = props.txBlockInfo
  const renderBody = (
    <div>
      {renderItem(header)}
      {renderItem(body)}
    </div>
  )
  return (
    <div
      style={{
        paddingLeft: 64,
        paddingRight: 64,
        paddingTop: 32,
        paddingBottom: 32,
        textAlign: 'left'
      }}>
      {loading ? <Spin size="large" /> : renderBody}
    </div>
  )
}

function renderItem(obj) {
  const keys = Object.keys(obj)
  return keys.map(data => {
    return <TableItem key={data} label={data} value={obj[data]} />
  })
}

function mapStateToProps(state) {
  return {
    txBlockInfo: state.explorer.txBlockInfo
  }
}

export default connect(mapStateToProps)(TXBlockInfo)
