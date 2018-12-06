import { connect } from 'dva'
import { createAction } from '../../utils'

import WalletTop from './WalletTop'
import WalletBody from './WalletBody'
import CreateAccountDrawer from './CreateAccountDrawer'
import ImportAccountDrawer from './ImportAccountDrawer'
import DecryptModal from './DecryptModal'
import SetSignerModal from './SetSignerModal'

const styles = {
  container: {
    paddingLeft: 64,
    paddingRight: 64,
    paddingTop: 32,
    paddingBottom: 32
  }
}

const Wallet = props => {
  return (
    <div style={styles.container}>
      <CreateAccountDrawer
        drawerVisible={props.createDrawerVisible}
        hideDrawer={props.hideCreateDrawer}
        createAccount={props.createAccount}
      />
      <ImportAccountDrawer
        drawerVisible={props.importDrawerVisible}
        hideDrawer={props.hideImportDrawer}
        importPrivateKey={props.importPrivateKey}
      />
      <DecryptModal
        visible={props.decryptModalVisible}
        toDecrypt={props.toDecrypt}
        toEncrypt={props.toEncrypt}
        handleOk={data => {
          props.toDecrypt.name
            ? props.decryptAccount(data)
            : props.encryptAccount(data)
          props.hideDecryptModal()
        }}
        handleCancel={props.hideDecryptModal}
      />
      <SetSignerModal
        visible={props.setSignerModalVisible}
        handleOk={props.setSigner}
        handleCancel={props.hideSetSignerModal}
        accounts={props.accounts}
      />
      <WalletTop
        accountLength={props.accounts.length}
        totalBalance={props.totalBalance}
        openCreateDrawer={props.openCreateDrawer}
        openImportDrawer={props.openImportDrawer}
      />
      <WalletBody
        accounts={props.accounts}
        exportAccount={props.exportAccount}
        decryptAccount={props.decryptAccount}
        openDecryptModal={props.openDecryptModal}
        openSetSignerModal={props.openSetSignerModal}
        setSigner={props.setSigner}
        signer={props.signer}
      />
    </div>
  )
}

function mapStateToProps(state) {
  return {
    accounts: state.wallet.accounts,
    createDrawerVisible: state.wallet.createDrawerVisible,
    importDrawerVisible: state.wallet.importDrawerVisible,
    decryptModalVisible: state.wallet.decryptModalVisible,
    setSignerModalVisible: state.wallet.setSignerModalVisible,
    toDecrypt: state.wallet.toDecrypt,
    toEncrypt: state.wallet.toEncrypt,
    totalBalance: state.wallet.totalBalance,
    signer: state.wallet.signer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createAccount: payload =>
      dispatch(createAction('wallet/createAccount')(payload)),
    exportAccount: payload =>
      dispatch(createAction('wallet/exportAccount')(payload)),
    encryptAccount: payload =>
      dispatch(createAction('wallet/encryptAccount')(payload)),
    decryptAccount: payload =>
      dispatch(createAction('wallet/decryptAccount')(payload)),
    importPrivateKey: payload =>
      dispatch(createAction('wallet/importPrivateKey')(payload)),
    openCreateDrawer: () => dispatch(createAction('wallet/openCreateDrawer')()),
    hideCreateDrawer: () => dispatch(createAction('wallet/hideCreateDrawer')()),
    openImportDrawer: () => dispatch(createAction('wallet/openImportDrawer')()),
    hideImportDrawer: () => dispatch(createAction('wallet/hideImportDrawer')()),
    openSetSignerModal: payload =>
      dispatch(createAction('wallet/openSetSignerModal')(payload)),
    hideSetSignerModal: () =>
      dispatch(createAction('wallet/hideSetSignerModal')()),
    openDecryptModal: payload =>
      dispatch(createAction('wallet/openDecryptModal')(payload)),
    hideDecryptModal: () => dispatch(createAction('wallet/hideDecryptModal')()),
    setSigner: payload => dispatch(createAction('wallet/setSigner')(payload))
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet)
