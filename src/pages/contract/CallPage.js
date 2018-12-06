import { Drawer, Spin, Collapse, Icon, Button, Divider } from 'antd'
import { connect } from 'dva'

import { createAction } from '../../utils'
import CallContractForm from './CallContractForm'
import AccountForm from '../../component/AccountForm'
import TransitionForm from './transitionForm'

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
  deployedContracts,
  drawerOpen,
  hideDrawer,
  selectCallContract,
  selectedCallContract,
  selectedTransition,
  selectTransition,
  setTransitionParams,
  accounts,
  getBalance,
  address,
  balance,
  nonce,
  isEncrypted,
  transitions,
  paramsValues,
  loadingABI,
  setParamsValues,
  setTransactionObject,
  transitionFormValidate,
  transitionFormValidateStatus,
  accountFormValidate,
  accountFormValidateStatus,
  callContract,
  callLoading
}) => (
  <div>
    <Collapse bordered={false} defaultActiveKey={['contract']}>
      <Panel
        header={
          <PanelHeader
            validateStatus={transitionFormValidateStatus}
            title="Contract Settings"
          />
        }
        key="contract"
        style={styles.customPanelStyle}>
        <CallContractForm
          selectContract={selectCallContract}
          contracts={deployedContracts}
          defaultValue={selectedCallContract}
          visible={drawerOpen}
        />
        {loadingABI ? (
          <Spinner text={'loading transitions from scilla runner'} />
        ) : (
          <TransitionForm
            transitions={loadingABI ? [] : transitions}
            selectTransition={selectTransition}
            selectedTransition={loadingABI ? undefined : selectedTransition}
            transitionFormValidate={transitionFormValidate}
            transitionFormValidateStatus={transitionFormValidateStatus}
            setTransitionParams={setTransitionParams}
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
      onClick={() => callContract()}
      loading={callLoading}
      disabled={!(transitionFormValidateStatus && accountFormValidateStatus)}>
      Sign And Call
    </Button>
  </div>
)

const CallPage = props => {
  return (
    <Drawer
      width={window.screen.availWidth <= 640 ? '100%' : 640}
      title={'Call Contract'}
      visible={props.drawerOpen}
      onClose={props.hideCallDrawer}
      placement="left"
      closable={false}>
      {props.callStart && !props.callFinished ? (
        <SignProcess {...props} />
      ) : props.sent !== undefined ? (
        <div>
          {typeof props.sent === 'string' ? (
            props.sent
          ) : (
            <div>
              <h3>The Contract is called</h3>
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
    selectedCallContract: state.deploy.selectedCallContract,
    selectedTransition: state.deploy.selectedTransition,
    deployedContracts: state.deploy.deployedContracts,
    address: state.deploy.address,
    balance: state.deploy.balance,
    nonce: state.deploy.nonce,
    isEncrypted: state.deploy.isEncrypted,
    params: state.deploy.params,
    paramsValues: state.deploy.paramsValues,
    transitions: state.deploy.transitions,
    loadingABI: state.deploy.loadingABI,
    transitionFormValidateStatus: state.deploy.transitionFormValidateStatus,
    accountFormValidateStatus: state.deploy.accountFormValidateStatus,
    sent: state.deploy.sent,
    callStart: state.deploy.callStart,
    callFinised: state.deploy.callFinised,
    callLoading: state.deploy.callLoading,
    confirmLoading: state.deploy.confirmLoading,
    confirmStatus: state.deploy.confirmStatus
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getBalance: payload => dispatch(createAction('deploy/getBalance')(payload)),
    hideCallDrawer: () => dispatch(createAction('deploy/hideCallDrawer')()),
    selectCallContract: payload =>
      dispatch(createAction('deploy/selectCallContract')(payload)),
    selectTransition: payload =>
      dispatch(createAction('deploy/selectTransition')(payload)),
    setTransitionParams: payload =>
      dispatch(createAction('deploy/setTransitionParams')(payload)),
    transitionFormValidate: payload =>
      dispatch(createAction('deploy/transitionFormValidate')(payload)),
    setParamsValues: payload =>
      dispatch(createAction('deploy/setParamsValues')(payload)),
    setTransactionObject: payload =>
      dispatch(createAction('deploy/setTransactionObject')(payload)),
    accountFormValidate: payload =>
      dispatch(createAction('deploy/accountFormValidate')(payload)),
    callContract: () => dispatch(createAction('deploy/callContract')())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CallPage)
