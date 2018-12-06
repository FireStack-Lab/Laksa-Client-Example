import { Drawer, Spin, Collapse, Icon, Button, Divider } from 'antd'
import { connect } from 'dva'

import { createAction } from '../../utils'
import ContractForm from './ContractForm'
import AccountForm from '../../component/AccountForm'
import InitParamsForm from './InitParamsForm'

const Panel = Collapse.Panel

const styles = {
  customPanelStyle: {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden'
  }
}

const PanelHeader = ({ validateStatus, title }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }}>
    <div style={{ fontWeight: '700', fontSize: 16 }}>{title}</div>
    {validateStatus ? (
      <Icon type="check" style={{ color: '#3399ff', marginLeft: 16 }} />
    ) : (
      <Icon type="close" style={{ color: '#f25718', marginLeft: 16 }} />
    )}
  </div>
)

const Spinner = ({ text }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    }}>
    <Spin tip={text} style={{ textAlign: 'center' }} />
  </div>
)

const SignProcess = ({
  checkedCode,
  drawerOpen,
  hideDrawer,
  selectContract,
  selectedContract,
  accounts,
  getBalance,
  address,
  balance,
  nonce,
  isEncrypted,
  params,
  paramsValues,
  loadingABI,
  setParamsValues,
  setTransactionObject,
  initFormValidate,
  initFormValidateStatus,
  accountFormValidate,
  accountFormValidateStatus,
  signContract,
  signingLoading
}) => (
  <div>
    <Collapse bordered={false} defaultActiveKey={['contract']}>
      <Panel
        header={
          <PanelHeader
            validateStatus={initFormValidateStatus}
            title="Contract Settings"
          />
        }
        key="contract"
        style={styles.customPanelStyle}>
        <ContractForm
          selectContract={selectContract}
          contracts={checkedCode}
          defaultValue={selectedContract}
          visible={drawerOpen}
        />
        {loadingABI ? (
          <Spinner text="Loading ABI from scilla runner" />
        ) : (
          <InitParamsForm
            params={loadingABI ? [] : params}
            initFormValidate={initFormValidate}
            initFormValidateStatus={initFormValidateStatus}
            setParamsValues={setParamsValues}
          />
        )}
      </Panel>
      <Panel
        header={
          <PanelHeader
            validateStatus={accountFormValidateStatus}
            title="Transaction Settings"
          />
        }
        key="transaction"
        style={styles.customPanelStyle}>
        <AccountForm
          visible={drawerOpen}
          getBalance={getBalance}
          accounts={accounts}
          defaultValue={address}
          balance={balance}
          nonce={nonce}
          isEncrypted={isEncrypted}
          accountFormValidate={accountFormValidate}
          setTransactionObject={setTransactionObject}
        />
      </Panel>
    </Collapse>
    <Button
      type="primary"
      size="large"
      block
      onClick={() => signContract()}
      loading={signingLoading}
      disabled={!(initFormValidateStatus && accountFormValidateStatus)}>
      Sign And Deploy
    </Button>
  </div>
)

const DeployPage = props => {
  return (
    <Drawer
      width={window.screen.availWidth <= 640 ? '100%' : 640}
      title={'Deploy Contract'}
      visible={props.drawerOpen}
      onClose={props.hideDrawer}
      placement="left"
      closable={false}>
      {props.signStart && !props.signFinished ? (
        <SignProcess {...props} />
      ) : props.sent !== undefined ? (
        <div>
          {typeof props.sent === 'string' ? (
            props.sent
          ) : (
            <div>
              <h3>The Contract is sent</h3>
              <h4>Transaction ID</h4>
              <p>{props.sent.TranID}</p>
              <h4>Contract Address</h4>
              <p>{props.sent.ContractAddress}</p>
              <h4>Created Time</h4>
              <p>{props.sent.createdTime.toString()}</p>
              <Divider />
              {props.confirmLoading ? (
                <div>
                  <Spinner text="Confirming Contract Transaction" />
                </div>
              ) : (
                <div>
                  <h4>Deploy Status</h4>
                  <p>{props.confirmStatus.status}</p>
                  <h4>Gas Fee</h4>
                  <p>{props.confirmStatus.gas}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </Drawer>
  )
}

function mapStateToProps(state) {
  return {
    selectedContract: state.deploy.selectedContract,
    checkedCode: state.contracts.checkedCode,
    address: state.deploy.address,
    balance: state.deploy.balance,
    nonce: state.deploy.nonce,
    isEncrypted: state.deploy.isEncrypted,
    params: state.deploy.params,
    paramsValues: state.deploy.paramsValues,
    loadingABI: state.deploy.loadingABI,
    initFormValidateStatus: state.deploy.initFormValidateStatus,
    accountFormValidateStatus: state.deploy.accountFormValidateStatus,
    sent: state.deploy.sent,
    signStart: state.deploy.signStart,
    signFinished: state.deploy.signFinished,
    signingLoading: state.deploy.signingLoading,
    confirmLoading: state.deploy.confirmLoading,
    confirmStatus: state.deploy.confirmStatus
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getBalance: payload => dispatch(createAction('deploy/getBalance')(payload)),
    hideDrawer: () => dispatch(createAction('deploy/hideDrawer')()),
    selectContract: payload =>
      dispatch(createAction('deploy/selectContract')(payload)),
    initFormValidate: payload =>
      dispatch(createAction('deploy/initFormValidate')(payload)),
    setParamsValues: payload =>
      dispatch(createAction('deploy/setParamsValues')(payload)),
    setTransactionObject: payload =>
      dispatch(createAction('deploy/setTransactionObject')(payload)),
    accountFormValidate: payload =>
      dispatch(createAction('deploy/accountFormValidate')(payload)),
    signContract: () => dispatch(createAction('deploy/signContract')())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeployPage)
