import { Form, Select, Input, Divider } from 'antd'
import { isArray, isAddress } from 'laksa-utils'
const { Option } = Select

function renderAccountOptions(arr) {
  return arr.map(d => {
    return (
      <Option value={d.address} key={d.address}>
        {`${d.name}(${d.address})`}
      </Option>
    )
  })
}
function AccountFormBody(props) {
  const { getFieldDecorator } = props.form

  return (
    <div>
      {props.visible ? (
        <Form layout="vertical" hideRequiredMark>
          {props.toAddr ? (
            <Form.Item label="toAddr">
              {getFieldDecorator('toAddr', {
                rules: [
                  {
                    required: true,
                    message: 'please input Address',
                    validator: function(rule, value, callback) {
                      if (!value || value === '' || !isAddress(value)) {
                        callback(`please input Address`)
                      } else {
                        callback()
                      }
                    }
                  }
                ],
                initialValue: ''
              })(<Input />)}
            </Form.Item>
          ) : null}
          <Form.Item label="Account">
            {getFieldDecorator('account', {
              rules: [
                {
                  required: true,
                  message: 'please select account',
                  validator: function(rule, value, callback) {
                    if (!value || value === '') {
                      callback(`please select account`)
                    } else {
                      callback()
                    }
                  }
                }
              ],
              initialValue: props.defaultValue || ''
            })(
              <Select placeholder="Select an account">
                {renderAccountOptions(props.accounts)}
              </Select>
            )}
            <div>
              <span style={{ fontWeight: '700' }}>balance:</span>
              <span>{props.balance}</span>
              <span style={{ fontWeight: '700', marginLeft: 16 }}>nonce:</span>
              <span>{props.nonce}</span>
            </div>
          </Form.Item>
          <Form.Item label="password">
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'please input password' }],
              initialValue: ''
            })(<Input disabled={!props.isEncrypted} />)}
          </Form.Item>

          <Divider>Transaction Params</Divider>
          <Form.Item label="amount">
            {getFieldDecorator('amount', {
              rules: [{ required: true, message: 'please select amount' }],
              initialValue: '0'
            })(<Input type="number" />)}
          </Form.Item>

          <Form.Item label="gas limit">
            {getFieldDecorator('gasLimit', {
              rules: [{ required: true, message: 'please select gas Limit' }],
              initialValue: '2000'
            })(<Input type="number" />)}
          </Form.Item>
          <Form.Item label="gas price">
            {getFieldDecorator('gasPrice', {
              rules: [{ required: true, message: 'please select gas price' }],
              initialValue: '100'
            })(<Input type="number" />)}
          </Form.Item>
        </Form>
      ) : null}
    </div>
  )
}

export default Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    if (changedValues.account) props.getBalance(allValues.account)
  },
  onFieldsChange: (props, fields, allFields, add) => {
    const fieldKeys = Object.keys(allFields)
    const sendObject = {}
    const noErrors =
      fieldKeys
        .map(f => {
          const { errors, value, validating } = allFields[f]
          let result = !validating && !isArray(errors) && value ? 0 : 1
          return result
        })
        .reduce((x, y) => x + y) > 0
        ? false
        : true
    props.accountFormValidate(noErrors)
    if (noErrors) {
      fieldKeys.forEach(
        f => (sendObject[allFields[f].name] = allFields[f].value)
      )
      props.setTransactionObject(sendObject)
    }
  }
})(AccountFormBody)
