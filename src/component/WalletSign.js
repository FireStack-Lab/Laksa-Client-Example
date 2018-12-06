import { Modal } from 'antd'
import { connect } from 'dva'

const WalletSign = ({ WalletSignVisible, accounts }) => {
  return (
    <Modal visible={WalletSignVisible}>
      <p>wallet sign</p>
      {renderArray(accounts)}
    </Modal>
  )
}

function renderArray(arr) {
  return arr.map(d => {
    return <p key={d.address}>{d.address}</p>
  })
}

function mapStateToProps(state) {
  return {
    WalletSignVisible: state.laksa.WalletSignVisible,
    accounts: state.wallet.accounts
  }
}
export default connect(mapStateToProps)(WalletSign)
