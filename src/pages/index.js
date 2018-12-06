import { Select, Divider, Drawer, Button, Form, Input, message } from 'antd'
import { connect } from 'dva'
import { Component } from 'react'
import { createAction } from '../utils'

const { Option } = Select
const styles = {
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  settingContainer: {
    marginTop: 64,
    marginBottom: 64,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  }
}

const ProviderContainer = ({
  title,
  provider,
  providerList,
  testConnection,
  testProvider,
  connection,
  setProvider,
  setButtonText
}) => {
  return (
    <div>
      <p style={{ fontSize: 32 }}>{title}</p>
      <Select
        defaultValue={Object.keys(provider)[0]}
        style={{ width: 300 }}
        onSelect={data => {
          const payload = providerList.find(d => data === Object.keys(d)[0])
          testConnection({
            name: Object.keys(payload)[0],
            url: Object.values(payload)[0]
          })
        }}>
        {renderProviderList(providerList)}
      </Select>
      <h2 style={{ marginTop: 32, fontSize: 16 }}>
        Connection Status:
        {` ${connection}`}
      </h2>
      <div style={{ marginTop: 32 }}>
        <Button
          onClick={() => testConnection()}
          style={{ marginRight: 16 }}
          size="large">
          Test Connection
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setProvider({
              name: Object.keys(testProvider)[0],
              url: Object.values(testProvider)[0]
            })
          }}
          disabled={!connection}
          size="large">
          {setButtonText}
        </Button>
      </div>
    </div>
  )
}

function renderProviderList(providers) {
  if (providers.length > 0) {
    return providers.map(d => {
      const key = Object.keys(d)[0]
      const value = Object.values(d)[0]
      return (
        <Option value={key} key={key}>
          <span style={{ marginRight: 16 }}>{key}</span>
          <span>{value}</span>
        </Option>
      )
    })
  }
  return null
}

function ProviderDrawer({ drawerVisible, hideDrawer, addProvider }) {
  const ProviderForm = Form.create()(renderForm)
  return (
    <Drawer
      width={window.screen.availWidth <= 640 ? '100%' : 640}
      title={'Add Provider'}
      visible={drawerVisible}
      onClose={hideDrawer}
      placement="left"
      closable={false}>
      <ProviderForm
        onSubmit={data => {
          addProvider(data)
          hideDrawer()
        }}
        onCancel={hideDrawer}
      />
    </Drawer>
  )
}

function mapStateToProps(state) {
  return {
    provider: state.laksa.provider,
    scillaProvider: state.laksa.scillaProvider,
    testProvider: state.laksa.testProvider,
    testScillaProvider: state.laksa.testScillaProvider,
    providerList: state.laksa.providerList,
    drawerVisible: state.laksa.drawerVisible,
    connection: state.laksa.connection,
    scillaConnection: state.laksa.scillaConnection
  }
}

function mapDispatchtoProps(dispatch) {
  return {
    openDrawer: () => dispatch(createAction('laksa/openDrawer')()),
    hideDrawer: () => dispatch(createAction('laksa/hideDrawer')()),
    addProvider: payload =>
      dispatch(createAction('laksa/addProvider')(payload)),
    setProvider: payload =>
      dispatch(createAction('laksa/setProvider')(payload)),
    setScillaProvider: payload =>
      dispatch(createAction('laksa/setScillaProvider')(payload)),
    testConnection: payload =>
      dispatch(createAction('laksa/testConnection')(payload)),
    testScillaConnection: payload =>
      dispatch(createAction('laksa/testScillaConnection')(payload))
  }
}

function renderForm(props) {
  const { getFieldDecorator } = props.form
  function handleClick(e) {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        props.onSubmit(values)
      }
    })
  }
  function handleCancel(e) {
    e.preventDefault()
    props.onCancel()
  }
  return (
    <Form layout="vertical" hideRequiredMark>
      <Form.Item label="Name">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: 'please enter provider name' }]
        })(<Input placeholder="please enter provider name" />)}
      </Form.Item>
      <Form.Item label="Url">
        {getFieldDecorator('url', {
          rules: [{ required: true, message: 'please enter url' }]
        })(<Input style={{ width: '100%' }} placeholder="please enter url" />)}
      </Form.Item>
      <Form.Item
        wrapperCol={{ span: 24, offset: 0 }}
        style={{ textAlign: 'right' }}>
        <Button onClick={handleCancel} style={{ marginRight: 16 }}>
          cancel
        </Button>
        <Button type="primary" onClick={handleClick}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

function Index(props) {
  return (
    <div style={styles.container}>
      <ProviderDrawer
        drawerVisible={props.drawerVisible}
        hideDrawer={props.hideDrawer}
        addProvider={props.addProvider}
      />

      <div style={styles.settingContainer}>
        <ProviderContainer
          title={'Select Node Provider'}
          provider={props.provider}
          providerList={props.providerList}
          testConnection={props.testConnection}
          testProvider={props.testProvider}
          connection={props.connection}
          setProvider={props.setProvider}
          setButtonText={'Set Provider'}
        />
        <Divider
          type={'vertical'}
          style={{ height: 100, marginLeft: 100, marginRight: 100 }}
        />
        <ProviderContainer
          title={'Select Scilla Runner'}
          provider={props.scillaProvider}
          providerList={props.providerList}
          testConnection={props.testScillaConnection}
          testProvider={props.testScillaProvider}
          connection={props.scillaConnection}
          setProvider={props.setScillaProvider}
          setButtonText={'Set Scilla'}
        />
      </div>

      <Divider>OR</Divider>
      <div style={{ marginTop: 64, marginBottom: 64 }}>
        <p style={{ fontSize: 32 }}>You can add one</p>
        <Button type="primary" onClick={props.openDrawer} size="large">
          Add provider
        </Button>
      </div>
    </div>
  )
}
const error = text => {
  message.error(text)
}

const success = text => {
  message.success(text)
}

class IndexComp extends Component {
  componentDidUpdate(props) {
    if (props.connection) {
      success('Provider is online')
    } else if (!props.connection) {
      error('Provider is off-line')
    }
    if (props.scillaConnection) {
      success('Scilla Provider is online')
    } else if (!props.scillaConnection) {
      error('Scilla Provider is off-line')
    }
  }
  render() {
    return <Index {...this.props} />
  }
}

export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(IndexComp)
