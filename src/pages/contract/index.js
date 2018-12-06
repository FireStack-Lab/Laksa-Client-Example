import { Tabs, Row, Col, Button, Table, Icon } from 'antd'
import { connect } from 'dva'
import DeployPage from './DeployPage'
import CallPage from './CallPage'
import { createAction } from '../../utils'

const TabPane = Tabs.TabPane

function callback(key) {
  console.log(key)
}

const Contract = props => {
  return (
    <div
      style={{
        paddingLeft: 64,
        paddingRight: 64,
        paddingTop: 32,
        paddingBottom: 32
      }}>
      <DeployPage accounts={props.accounts} drawerOpen={props.drawerOpen} />
      <CallPage accounts={props.accounts} drawerOpen={props.callDrawerOpen} />
      <div style={{ textAlign: 'left' }}>
        <div style={{ marginBottom: 16 }}>
          <Button
            size="large"
            type="primary"
            style={{ marginRight: 16 }}
            onClick={() => props.openCode({ code: '', footer: true })}>
            New Contract
          </Button>
          <Button
            size="large"
            type="default"
            style={{ marginRight: 16 }}
            onClick={() => props.openDrawer()}>
            Deploy Contract
          </Button>
          <Button
            size="large"
            type="default"
            onClick={() => props.openCallDrawer()}>
            Call Contract
          </Button>
        </div>
        <Tabs defaultActiveKey="Deployed" onChange={callback}>
          <TabPane tab="Raw Code" key="Raw Code">
            <Table
              dataSource={props.localCode}
              columns={[
                {
                  title: 'CodeId',
                  dataIndex: 'CodeId',
                  key: 'CodeId',
                  render: (text, data) => (
                    <a
                      href="javascript:;"
                      onClick={e => {
                        e.preventDefault()
                        props.openCode({ ...data, footer: true })
                      }}>
                      {text}
                    </a>
                  )
                },
                {
                  title: 'CodeName',
                  dataIndex: 'CodeName',
                  key: 'CodeName'
                },
                {
                  title: 'Action',
                  key: 'Action',
                  render: (text, data) => (
                    <div>
                      <a
                        href="javascript:;"
                        onClick={e => {
                          e.preventDefault()
                          props.openCode({ ...data, footer: true })
                        }}
                        style={{ marginRight: 16 }}>
                        <Icon type="code" />
                      </a>
                      <a
                        href="javascript:;"
                        onClick={e => {
                          e.preventDefault()
                          props.removeCodeDB({ ...data, footer: true })
                        }}
                        style={{ marginRight: 16 }}>
                        <Icon type="delete" />
                      </a>
                      <a
                        href="javascript:;"
                        onClick={e => {
                          e.preventDefault()
                          props.checkCode({ ...data })
                        }}
                        style={{ marginRight: 16 }}>
                        <Icon type="fork" />
                      </a>
                    </div>
                  )
                },
                {
                  title: 'Parser Check',
                  dataIndex: 'CodeCheckStatus',
                  key: 'CodeCheckStatus',
                  render: (text, data) => (
                    <div style={{ fontWeight: '700' }}>
                      {text !== null ? text.toString() : 'unchecked'}
                    </div>
                  )
                },
                {
                  title: 'Deploy Action',
                  dataIndex: 'CodeCheckStatus',
                  key: 'DeployAction',
                  render: (text, data) => {
                    const deployable = text !== null && text === true
                    return (
                      <div style={{ fontWeight: '700' }}>
                        {deployable ? (
                          <a
                            href="javascript:;"
                            onClick={e => {
                              e.preventDefault()
                              props.openDrawer(data)
                            }}>
                            <Icon type="caret-right" />
                            <span style={{ marginLeft: 8 }}>Deploy</span>
                          </a>
                        ) : (
                          'nah'
                        )}
                      </div>
                    )
                  }
                }
              ]}
              rowKey={data => data.CodeId}
            />
          </TabPane>
          <TabPane tab="Sent" key="Sent">
            <Table
              dataSource={props.sentContracts}
              columns={[
                {
                  title: 'TranID',
                  dataIndex: 'TranID',
                  key: 'TranID',
                  render: (text, data) => (
                    <a
                      href="javascript:;"
                      onClick={e => {
                        e.preventDefault()
                        props.searchTransaction({ txHash: text })
                      }}>
                      {text}
                    </a>
                  )
                },
                {
                  title: 'ContractAddress',
                  dataIndex: 'ContractAddress',
                  key: 'ContractAddress',
                  render: (text, data) => (
                    <a
                      href="javascript:;"
                      onClick={e => {
                        e.preventDefault()
                        props.searchAddress({ address: text })
                      }}>
                      {text}
                    </a>
                  )
                },
                {
                  title: 'Action',
                  key: 'Action',
                  render: (text, data) => (
                    <div>
                      <a
                        href="javascript:;"
                        onClick={e => {
                          e.preventDefault()
                          props.openCode({ ...data, footer: false })
                        }}
                        style={{ marginRight: 16 }}>
                        <Icon type="code" />
                      </a>
                      <a
                        href="javascript:;"
                        onClick={e => {
                          e.preventDefault()
                          props.confirmContract({ ...data })
                        }}
                        style={{ marginRight: 16 }}>
                        Confirm
                      </a>
                    </div>
                  )
                },
                {
                  title: 'Contract Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (text, data) => (
                    <div style={{ fontWeight: '700' }}>
                      {text.toUpperCase()}
                    </div>
                  )
                },
                {
                  title: 'Created Time',
                  dataIndex: 'createdTime',
                  key: 'createdTime',
                  render: (text, data) => <div>{text.toString()}</div>,
                  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.createdTime - b.createdTime
                }
              ]}
              rowKey={data => data.TranID}
            />
          </TabPane>
          <TabPane tab="Rejected" key="Rejected">
            <Table
              dataSource={props.rejectedContracts}
              columns={[
                {
                  title: 'TranID',
                  dataIndex: 'TranID',
                  key: 'TranID',
                  render: (text, data) => (
                    <a
                      href="javascript:;"
                      onClick={e => {
                        e.preventDefault()
                        props.searchTransaction({ txHash: text })
                      }}>
                      {text}
                    </a>
                  )
                },
                {
                  title: 'ContractAddress',
                  dataIndex: 'ContractAddress',
                  key: 'ContractAddress',
                  render: (text, data) => (
                    <a
                      href="javascript:;"
                      onClick={e => {
                        e.preventDefault()
                        props.searchAddress({ address: text })
                      }}>
                      {text}
                    </a>
                  )
                },

                {
                  title: 'Contract Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (text, data) => (
                    <div style={{ fontWeight: '700' }}>
                      {text.toUpperCase()}
                    </div>
                  )
                },
                {
                  title: 'Created Time',
                  dataIndex: 'createdTime',
                  key: 'createdTime',
                  render: (text, data) => <div>{text.toString()}</div>,
                  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.createdTime - b.createdTime
                }
              ]}
              rowKey={data => data.TranID}
            />
          </TabPane>
          <TabPane tab="Deployed" key="Deployed">
            <Table
              dataSource={props.deployedContracts}
              columns={[
                {
                  title: 'TranID',
                  dataIndex: 'TranID',
                  key: 'TranID',
                  render: (text, data) => (
                    <a
                      href="javascript:;"
                      onClick={e => {
                        e.preventDefault()
                        props.searchTransaction({ txHash: text })
                      }}>
                      {text}
                    </a>
                  )
                },
                {
                  title: 'Contract Address',
                  dataIndex: 'ContractAddress',
                  key: 'ContractAddress',
                  render: (text, data) => (
                    <a
                      href="javascript:;"
                      onClick={e => {
                        e.preventDefault()
                        props.searchAddress({ address: text })
                      }}>
                      {text}
                    </a>
                  )
                },
                {
                  title: 'Signer Address',
                  dataIndex: 'signerAccount',
                  key: 'signerAccount',
                  render: (text, data) => (
                    <a
                      href="javascript:;"
                      onClick={e => {
                        e.preventDefault()
                        props.searchAddress({ address: text })
                      }}>
                      {text}
                    </a>
                  )
                },
                {
                  title: 'Contract Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (text, data) => (
                    <div style={{ fontWeight: '700' }}>
                      {text.toUpperCase()}
                    </div>
                  )
                },
                {
                  title: 'Update Time',
                  dataIndex: 'updateTime',
                  key: 'updateTime',
                  render: (text, data) => <div>{text.toString()}</div>,
                  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.updateTime - b.updateTime
                }
              ]}
              rowKey={data => data.TranID}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

function mapState(state) {
  return {
    checkedCode: state.contracts.checkedCode,
    localCode: state.contracts.localCode,
    accounts: state.wallet.accounts,
    drawerOpen: state.deploy.drawerOpen,
    callDrawerOpen: state.deploy.callDrawerOpen,
    deployedContracts: state.deploy.deployedContracts,
    sentContracts: state.deploy.sentContracts,
    rejectedContracts: state.deploy.rejectedContracts
  }
}
function mapDispatch(dispatch) {
  return {
    openCode: payload => dispatch(createAction('contracts/openCode')(payload)),
    checkCode: payload =>
      dispatch(createAction('contracts/checkCode')(payload)),
    removeCodeDB: payload =>
      dispatch(createAction('contracts/removeCodeDB')(payload)),
    openDrawer: payload => dispatch(createAction('deploy/openDrawer')(payload)),
    openCallDrawer: payload =>
      dispatch(createAction('deploy/openCallDrawer')(payload)),
    searchTransaction: payload =>
      dispatch(createAction('explorer/searchTransaction')(payload)),
    searchAddress: payload =>
      dispatch(createAction('explorer/searchAddress')(payload)),
    confirmContract: payload =>
      dispatch(createAction('deploy/confirmContract')(payload))
  }
}

export default connect(
  mapState,
  mapDispatch
)(Contract)
