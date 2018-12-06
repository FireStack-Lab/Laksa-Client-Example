import { Divider, Card, Icon, Collapse } from 'antd'
import { connect } from 'dva'
import { createAction } from '../utils'

const Panel = Collapse.Panel

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 16,
  border: 0,
  overflow: 'hidden'
}
function renderObjects(arr) {
  if (arr.length > 0) {
    return arr.map((s, index) => {
      const keys = Object.keys(s)
      const values = Object.values(s)
      const pair = (key, value) => (
        <div
          key={key}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}>
          <div style={{ fontWeight: '700' }}>{key}: </div>
          <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {JSON.stringify(value)}
          </div>
        </div>
      )
      const pairs = []
      for (let i in keys) {
        pairs[i] = pair(keys[i], values[i])
      }
      return (
        <div key={index}>
          {pairs}
          <Divider />
        </div>
      )
    })
  }
  return null
}

const Contract = ({ address, state, init, code, ...props }) => {
  return (
    <Card
      style={{ width: 400, marginTop: 16, marginRight: 16 }}
      actions={[
        <Icon type="file-search" />,
        <div onClick={() => props.openCode({ code })}>
          <Icon type="code" />
        </div>,
        <Icon type="ellipsis" />
      ]}
      title={address}>
      <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
        <Collapse bordered={false} defaultActiveKey={['1']}>
          <Panel header="State" key="State" style={customPanelStyle}>
            {renderObjects(state)}
          </Panel>
          <Panel header="Init" key="Init" style={customPanelStyle}>
            {renderObjects(init)}
          </Panel>
        </Collapse>
      </div>
    </Card>
  )
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    openCode: payload => dispatch(createAction('contracts/openCode')(payload))
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Contract)
