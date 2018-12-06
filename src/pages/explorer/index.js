import { Row, Col, Table } from 'antd'
import { connect } from 'dva'
import { createAction } from '../../utils'
import SearchComp from '../../component/Search'
import DSTable from './dsBlock/dsTable'
import TXTable from './txBlock/txTable'
import TransactionTable from './transaction/transactionTable'

const Explorer = props => {
  return (
    <div
      style={{
        paddingLeft: 64,
        paddingRight: 64,
        paddingTop: 32,
        paddingBottom: 32
      }}>
      <Row gutter={24}>
        <Col>
          <div style={{ padding: 32 }}>
            <SearchComp />
          </div>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <h2>Latest DS Blocks</h2>
          <DSTable
            dataSource={props.dsBlockListing.data}
            current={props.dsBlockListing.current}
            total={props.dsBlockListing.maxPages}
            onClick={props.searchDSBlock}
            onChange={props.getLatestDsBlocks}
          />
        </Col>
        <Col span={8}>
          <h2>Latest TX Blocks</h2>
          <TXTable
            dataSource={props.txBlockListing.data}
            current={props.txBlockListing.current}
            total={props.txBlockListing.maxPages}
            onClick={props.searchTXBlock}
            onChange={props.getLatestTxBlocks}
          />
        </Col>
        <Col span={8}>
          <h2>Latest Transactions</h2>
          <TransactionTable
            dataSource={props.transactionListing.TxnHashes}
            current={props.transactionListing.current}
            total={props.transactionListing.number}
            onClick={props.searchTransaction}
            onChange={props.getLatestTransactions}
          />
        </Col>
      </Row>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    dsBlockListing: state.explorer.dsBlockListing,
    txBlockListing: state.explorer.txBlockListing,
    transactionListing: state.explorer.transactionListing
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getLatestDsBlocks: payload =>
      dispatch(createAction('explorer/getLatestDsBlocks')(payload)),
    getLatestTxBlocks: payload =>
      dispatch(createAction('explorer/getLatestTxBlocks')(payload)),
    getLatestTransactions: payload =>
      dispatch(createAction('explorer/getLatestTransactions')(payload)),
    searchDSBlock: payload =>
      dispatch(createAction('explorer/searchDSBlock')(payload)),
    searchTXBlock: payload =>
      dispatch(createAction('explorer/searchTXBlock')(payload)),
    searchTransaction: payload =>
      dispatch(createAction('explorer/searchTransaction')(payload))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Explorer)
