// import brace from 'brace'
import { Modal, Button, Input } from 'antd'
import AceEditor from 'react-ace'
import { createAction } from '../utils'
import { connect } from 'dva'

import 'brace/mode/ocaml'
import 'brace/mode/json'
import 'brace/theme/monokai'

const CodeEditor = ({ mode, name, onLoad, onChange, code, ...props }) => {
  return (
    <AceEditor
      mode={mode}
      theme="monokai"
      name={name}
      onLoad={onLoad}
      onChange={onChange}
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      height={'600px'}
      width={'100%'}
      value={code}
      setOptions={{
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2
      }}
    />
  )
}

const CodeEditorModal = props => {
  return (
    <Modal
      visible={props.CodeEditorVisible}
      width={800}
      onCancel={() => props.hideCode()}
      bodyStyle={{ paddingTop: 44 }}
      centered
      footer={
        props.CodeFooter
          ? [
              <span key="message" style={{ marginRight: 30 }}>
                {props.CodeCheckStatus === null
                  ? null
                  : props.CodeCheckStatus === true
                    ? 'Message: Code Check Success!'
                    : 'Message: Code Check Failure'}
              </span>,
              <Input
                defaultValue={props.CodeMeta.CodeName}
                key={props.CodeMeta.CodeId}
                style={{
                  display: 'inline-block',
                  width: 150,
                  marginRight: 16,
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  color: '#333333',
                  fontWeight: '700',
                  textAlign: 'left'
                }}
                onChange={e => {
                  const { value } = e.target
                  props.saveCodeMeta({ ...props.CodeMeta, CodeName: value })
                }}
              />,

              <Button
                key="cancel"
                onClick={() => {
                  props.hideCode()
                }}>
                Cancel
              </Button>,

              <Button
                key="event"
                onClick={() => {
                  console.log('event')
                }}>
                Event
              </Button>,
              <Button
                key="check"
                onClick={() => {
                  props.checkCode()
                }}>
                Check
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={() => {
                  props.saveCode()
                }}>
                Save
              </Button>
            ]
          : null
      }>
      <CodeEditor
        name="SmartContract"
        mode="ocaml"
        code={props.CodeEditorCode}
        onLoad={() => console.log('Contract Loaded')}
        onChange={data => {
          const result = {
            code: data.toString(),
            type: 'SmartContract'
          }
          props.changeCode(result)
        }}
      />
    </Modal>
  )
}

function mapStateToProps(state) {
  return {
    CodeEditorVisible: state.contracts.CodeEditorVisible,
    CodeEditorCode: state.contracts.CodeEditorCode,
    CodeCheckStatus: state.contracts.CodeCheckStatus,
    CodeFooter: state.contracts.CodeFooter,
    CodeMeta: state.contracts.CodeMeta
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hideCode: () => dispatch(createAction('contracts/hideCode')()),
    changeCode: payload =>
      dispatch(createAction('contracts/changeCode')(payload)),
    checkCode: payload =>
      dispatch(createAction('contracts/checkCode')(payload)),
    saveCode: () => dispatch(createAction('contracts/saveCode')()),
    saveCodeMeta: payload =>
      dispatch(createAction('contracts/saveCodeMeta')(payload))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeEditorModal)
