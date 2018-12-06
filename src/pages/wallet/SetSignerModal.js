import { Modal, Input, Form, Select } from 'antd'

const { Option } = Select

const SetSignerModal = ({ visible, handleOk, handleCancel, accounts }) => {
  let value
  const DecryptForm = Form.create({
    onValuesChange: (props, changedValues, allValues) => {
      value = changedValues.account
    }
  })(renderForm)

  return (
    <div>
      <Modal
        title={`Set Signer for Wallet`}
        visible={visible}
        onOk={() => handleOk(value)}
        onCancel={handleCancel}>
        <DecryptForm accounts={accounts} />
      </Modal>
    </div>
  )
}

function renderForm(props) {
  const { getFieldDecorator } = props.form
  return (
    <Form layout="vertical" hideRequiredMark>
      <Form.Item label="Account">
        {getFieldDecorator('account', {
          rules: [{ required: true, message: 'please select account' }]
        })(
          <Select placeholder="Select an account">
            {renderOptions(props.accounts)}
          </Select>
        )}
      </Form.Item>
    </Form>
  )
}

function renderOptions(arr) {
  return arr.map(d => {
    return (
      <Option value={d.address} key={d.address}>
        {d.name}
      </Option>
    )
  })
}

export default SetSignerModal
