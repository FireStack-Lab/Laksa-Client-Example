import { Form, Drawer, Input, Button } from 'antd'

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
      <Form.Item label="PrivateKey">
        {getFieldDecorator('privateKey', {
          rules: [{ required: true, message: 'please enter privateKey' }]
        })(
          <Input
            style={{ width: '100%' }}
            placeholder="please enter privateKey"
          />
        )}
      </Form.Item>
      <Form.Item label="Name">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: 'please enter account name' }]
        })(<Input placeholder="please enter account name" />)}
      </Form.Item>
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

export default function ImportAccountDrawer({
  drawerVisible,
  hideDrawer,
  importPrivateKey
}) {
  const ImportForm = Form.create()(renderForm)
  return (
    <Drawer
      width={window.screen.availWidth <= 640 ? '100%' : 640}
      title={'Import Account'}
      visible={drawerVisible}
      onClose={hideDrawer}
      placement="left"
      closable={false}>
      <ImportForm
        onSubmit={data => {
          importPrivateKey(data)
          hideDrawer()
        }}
        onCancel={hideDrawer}
      />
    </Drawer>
  )
}
