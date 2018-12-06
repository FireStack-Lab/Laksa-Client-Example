import { Form, Select } from 'antd'
const { Option } = Select
function renderContractOptions(arr) {
  return arr.map(d => {
    return (
      <Option value={d.CodeId} key={d.CodeId}>
        {d.CodeName}
      </Option>
    )
  })
}

function ContractFormBody(props) {
  const { getFieldDecorator } = props.form

  return (
    <Form layout="vertical" hideRequiredMark>
      {props.visible ? (
        <Form.Item label="Contract">
          {getFieldDecorator('contract', {
            rules: [{ required: true, message: 'please select contract' }],
            initialValue: props.defaultValue || null
          })(
            <Select placeholder="Select a contract">
              {renderContractOptions(props.contracts)}
            </Select>
          )}
        </Form.Item>
      ) : null}
    </Form>
  )
}
export default Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    props.selectContract({ CodeId: changedValues.contract })
  }
})(ContractFormBody)
