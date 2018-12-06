import { Form, Input, Divider } from 'antd'
import { isArray } from 'laksa-utils'
import { validate } from 'laksa-core-contract'

function InitParamsFormBody(props) {
  const { getFieldDecorator } = props.form
  return (
    <div>
      <Form layout="vertical" hideRequiredMark>
        {props.params.length > 0 ? <Divider>Init Params</Divider> : null}
        {renderFormItemArray(props.params, getFieldDecorator)}
      </Form>
    </div>
  )
}

function renderFormItemArray(arr, getFieldDecorator) {
  return arr.map((d, index) => {
    return (
      <Form.Item label={`${d.name}(${d.type})`} key={index}>
        {getFieldDecorator(d.name, {
          rules: [
            {
              required: true,
              validator: function(rule, value, callback) {
                let valueTransform = value
                if (d.type.match('Uint')) {
                  valueTransform = Number(value, 10)
                }
                const val = validate(d.type, valueTransform)
                if (!val) {
                  callback(`validator ${d.type} failed`)
                } else {
                  callback()
                }
              }
            }
          ]
        })(<Input />)}
      </Form.Item>
    )
  })
}

export default Form.create({
  onFieldsChange: (props, fields, allFields, add) => {
    let noErrors = false
    const fieldKeys = Object.keys(allFields)
    const paramsToBeSet = []
    noErrors =
      fieldKeys
        .map(f => {
          const { errors, value, validating } = allFields[f]
          let result = !validating && !isArray(errors) && value ? 0 : 1
          return result
        })
        .reduce((x, y) => x + y) > 0
        ? false
        : true
    props.initFormValidate(noErrors)

    if (noErrors) {
      fieldKeys.map((f, index) => {
        return (paramsToBeSet[index] = { value: allFields[f].value })
      })
      props.setParamsValues(paramsToBeSet)
    }
  }
})(InitParamsFormBody)
