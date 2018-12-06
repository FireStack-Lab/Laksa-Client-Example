import { connect } from 'dva'
import { Spin } from 'antd'
import TableItem from '../../../component/TableItem'
// import { createAction } from '../../../utils'

const DSBlockInfo = props => {
  const { header, signature, loading } = props.dsBlockInfo
  const renderBody = (
    <div>
      {renderItem(header)}
      <TableItem label={'Signature'} value={signature} />
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
    dsBlockInfo: state.explorer.dsBlockInfo
  }
}

export default connect(mapStateToProps)(DSBlockInfo)
