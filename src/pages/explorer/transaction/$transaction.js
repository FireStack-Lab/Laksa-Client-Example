import { connect } from 'dva'
import { Spin } from 'antd'
import { createAction } from '../../../utils'
import TableItem from '../../../component/TableItem'

const TransactionInfo = props => {
  const { receipt, loading, ...rest } = props.transactionInfo
  const renderBody = (
    <div>
      {renderItem(rest, props.searchAddress)}
      {renderItem(receipt)}
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

function renderItem(obj, action) {
  const keys = Object.keys(obj)
  return keys.map(data => {
    if (typeof data !== 'object') {
      return (
        <TableItem
          key={data}
          label={data}
          value={obj[data]}
          link={
            data === 'toAddr' || data === 'fromAddr'
              ? '/explorer/account'
              : null
          }
          linkAction={action}
        />
      )
    } else {
      return null
    }
  })
}

function mapStateToProps(state) {
  return {
    transactionInfo: state.explorer.transactionInfo
  }
}
function mapDispatchToProps(dispatch) {
  return {
    searchAddress: payload =>
      dispatch(createAction('explorer/searchAddress')(payload))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionInfo)
