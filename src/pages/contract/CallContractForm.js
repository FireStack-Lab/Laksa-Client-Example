import { Form, Select } from 'antd'
const { Option } = Select
function renderContractOptions(arr) {
  return arr
    .sort((a, b) => {
      var nameA = a.ContractAddress.toUpperCase()
      var nameB = b.ContractAddress.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }

      return 0
    })
    .reduce((init, current) => {
      if (
        init.length === 0 ||
        init[init.length - 1].ContractAddress !== current.ContractAddress
      ) {
        init.push(current)
      }
      return init
    }, [])
    .map(d => {
      const value = JSON.stringify({
        ContractAddress: d.ContractAddress,
        CodeId: d.CodeId,
        TranID: d.TranID,
        CodeName: d.CodeName
      })
      const key = JSON.stringify({
        ContractAddress: d.ContractAddress,
        CodeId: d.CodeId,
        TranID: d.TranID,
        CodeName: d.CodeName
      })

      const name = `${d.CodeName}:(${d.ContractAddress})`

      return (
        <Option value={value} key={key}>
          {name}
        </Option>
      )
    })
}

function CallContractFormBody(props) {
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
    props.selectContract(changedValues.contract)
  }
})(CallContractFormBody)
