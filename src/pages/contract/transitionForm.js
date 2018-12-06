import { Form, Input, Divider, Select } from 'antd'
import { isArray } from 'laksa-utils'
import { validate } from 'laksa-core-contract'

const { Option } = Select
function renderContractOptions(arr) {
  return arr.map(d => {
    return (
      <Option value={d.name} key={d.name}>
        {d.name}
      </Option>
    )
  })
}

function getTransitionParams(value, array) {
  if (array.length > 0) {
    return array.find(d => d.name === value)
  }
}

function renderFormItemArray(arr, selectedTransition, getFieldDecorator) {
  return arr.map((d, index) => {
    const decorator = JSON.stringify({
      vname: d.name,
      type: d.type
    })

    return (
      <Form.Item label={`${d.name}(${d.type})`} key={index}>
        {getFieldDecorator(decorator, {
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

function TransitionFormBody(props) {
  const { getFieldDecorator } = props.form
  const selectedTransitionName = props.selectedTransition
    ? props.selectedTransition.value
    : undefined
  const transition = getTransitionParams(
    selectedTransitionName,
    props.transitions
  )
  return (
    <div>
      {props.transitions.length > 0 ? (
        <Form layout="vertical" hideRequiredMark>
          <Divider>Transitions</Divider>
          <Form.Item label="Transition">
            {getFieldDecorator('transition', {
              rules: [{ required: true, message: 'please select transition' }]
              // initialValue: props.defaultValue || null
            })(
              <Select placeholder="Select a transition">
                {renderContractOptions(props.transitions)}
              </Select>
            )}
          </Form.Item>
          {transition && transition.params.length > 0
            ? renderFormItemArray(
                transition.params,
                selectedTransitionName,
                getFieldDecorator
              )
            : null}
        </Form>
      ) : null}
    </div>
  )
}

export default Form.create({
  onFieldsChange: (props, fields, allFields, add) => {
    if (fields.transition) {
      props.selectTransition(fields.transition)
    }
    const fieldKeys = Object.keys(allFields)
    const paramsToBeSet = []
    let noErrors = true
    if (!fields.transition) {
      noErrors =
        fieldKeys
          .filter(d => d !== 'transition')
          .map((f, index) => {
            // console.log(allFields[f])
            const { errors, value, validating } = allFields[f]
            if (!validating && !isArray(errors) && value) {
              paramsToBeSet[index] = {
                ...JSON.parse(allFields[f].name),
                value: allFields[f].value
              }
              return 0
            } else {
              return 1
            }
          })
          .reduce((x, y) => x + y) > 0
          ? false
          : true
    } else {
      const { params } = getTransitionParams(
        fields.transition.value,
        props.transitions
      )
      if (params.length > 0) {
        noErrors = false
      } else {
        noErrors = true
      }
    }
    props.transitionFormValidate(noErrors)
    if (noErrors) {
      props.setTransitionParams(paramsToBeSet)
    }
  }
})(TransitionFormBody)
