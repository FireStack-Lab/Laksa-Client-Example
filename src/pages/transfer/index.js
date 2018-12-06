import { Row, Col, Button, Divider } from 'antd'
import AccountForm from '../../component/AccountForm'
import Result from '../../component/Result'
import { connect } from 'dva'
import { createAction } from '../../utils'

const Transfer = props => {
  return (
    <div style={{ padding: 32 }}>
      <Row gut={24}>
        <Col span={props.confirmLoading ? 4 : 8} />
        <Col span={8}>
          <AccountForm
            visible
            toAddr={true}
            getBalance={props.getBalance}
            accounts={props.accounts}
            defaultValue={props.address}
            balance={props.balance}
            nonce={props.nonce}
            isEncrypted={props.isEncrypted}
            accountFormValidate={props.accountFormValidate}
            setTransactionObject={props.setTransactionObject}
          />
          <Button
            type="primary"
            block
            size="large"
            loading={props.transferLoading}
            onClick={e => {
              e.preventDefault()
              props.sent ? props.clearPage() : props.transferToken()
            }}
            disabled={props.confirmLoading}>
            {props.sent ? 'Clear' : 'Transfer'}
          </Button>
        </Col>
        <Col span={props.sent ? 8 : 0}>
          <Result {...props} />
        </Col>
        <Col span={props.confirmLoading ? 4 : 8} />
      </Row>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    address: state.transfer.address,
    balance: state.transfer.balance,
    nonce: state.transfer.nonce,
    isEncrypted: state.transfer.isEncrypted,
    gasLimit: state.transfer.gasLimit,
    gasPrice: state.transfer.gasPrice,
    accounts: state.wallet.accounts,
    transferStart: state.transfer.transferStart,
    transferFinished: state.transfer.transferFinished,
    transferLoading: state.transfer.transferLoading,
    sent: state.transfer.sent,
    confirmLoading: state.transfer.confirmLoading,
    confirmStatus: state.transfer.confirmStatus
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getBalance: payload =>
      dispatch(createAction('transfer/getBalance')(payload)),
    setTransactionObject: payload =>
      dispatch(createAction('transfer/setTransactionObject')(payload)),
    accountFormValidate: payload =>
      dispatch(createAction('transfer/accountFormValidate')(payload)),
    transferToken: () => dispatch(createAction('transfer/transferToken')()),
    clearPage: () => dispatch(createAction('transfer/clearPage')())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transfer)
