import { Modal, Input, Form } from 'antd'

const DecryptModal = ({
  visible,
  handleOk,
  handleCancel,
  toDecrypt,
  toEncrypt
}) => {
  let value
  const DecryptForm = Form.create({
    onValuesChange: (props, changedValues, allValues) => {
      value = changedValues.password
    }
  })(renderForm)
  const handleObject = toDecrypt.name ? toDecrypt : toEncrypt
  const handleTitle = toDecrypt.name ? 'Decrypt' : 'Encrypt'
  return (
    <div>
      <Modal
        title={`${handleTitle} Account:${handleObject.name}`}
        visible={visible}
        onOk={() => handleOk({ account: handleObject, password: value })}
        onCancel={handleCancel}>
        <DecryptForm />
      </Modal>
    </div>
  )
}

function renderForm(props) {
  const { getFieldDecorator } = props.form

  return (
    <Form layout="vertical" hideRequiredMark>
      <Form.Item label="Password">
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'please enter password' }]
        })(
          <Input
            style={{ width: '100%' }}
            placeholder="please enter password"
          />
        )}
      </Form.Item>
    </Form>
  )
}

export default DecryptModal
