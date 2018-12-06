import { connect } from 'dva'
import { Spin, Divider, Row, Col } from 'antd'
import Contract from '../../../component/Contract'
import TableItem from '../../../component/TableItem'
// import { createAction } from '../../../utils'

function renderContracts(arr) {
  if (arr.length > 0) {
    return arr.map(d => {
      return (
        <Col key={d.address} span={8}>
          <Contract key={d.address} {...d} />
        </Col>
      )
    })
  }
  return null
}

const AccountInfo = props => {
  const {
    loading,
    loadingContracts,
    contracts,
    ...accountInfo
  } = props.accountInfo

  return (
    <div
      style={{
        paddingLeft: 64,
        paddingRight: 64,
        paddingTop: 32,
        paddingBottom: 32,
        textAlign: 'left'
      }}>
      {loading ? <Spin size="large" /> : renderItem(accountInfo)}
      <Divider />
      <h3>
        SmartContracts(
        {contracts.length || 0})
      </h3>
      <div>
        <Row gutter={16}>
          {loadingContracts ? (
            <Spin size="large" />
          ) : (
            renderContracts(contracts)
          )}
        </Row>
      </div>
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
    accountInfo: state.explorer.accountInfo
  }
}

export default connect(mapStateToProps)(AccountInfo)
