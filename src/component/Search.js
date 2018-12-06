import { Input, Select } from 'antd'
import { connect } from 'dva'
import Link from 'umi/link'
import { createAction } from '../utils'

const Search = Input.Search
const Option = Select.Option

const SearchComp = props => {
  const { searchCat, searchValidate } = props

  return (
    <Search
      placeholder={getPlaceHolder(searchCat)}
      enterButton="Search"
      addonBefore={
        <Select
          defaultValue={searchCat}
          style={{ width: 120 }}
          onSelect={data => props.setSearchCat(data)}>
          <Option value="address">Address</Option>
          <Option value="dsBlock">DS Block</Option>
          <Option value="txBlock">TX Block</Option>
          <Option value="transaction">Transaction</Option>
        </Select>
      }
      size="large"
      // disabled={searchValidate}
      onSearch={value => {
        return searchValidate
          ? onSearch({ searchCat, value, method: props.searchOn })
          : null
      }}
      onChange={e =>
        onValidate({
          searchCat,
          value: e.target.value,
          method: props.validateOn
        })
      }
    />
  )
}

function getPlaceHolder(searchCat) {
  if (searchCat === 'address') {
    return `Please input Address, should be 40 chars long `
  } else if (searchCat === 'dsBlock' || searchCat === 'txBlock') {
    return `Please input block number, integer greater than 0, such as 100`
  } else if (searchCat === 'transaction') {
    return 'Please input transaction Hash,should be 66 chars'
  }
}

function onSearch({ searchCat, value, method }) {
  method({ searchCat, value })
}

function onValidate({ searchCat, value, method }) {
  method({ searchCat, value })
}

function mapStateToProps(state) {
  return {
    searchCat: state.explorer.searchCat,
    searchValidate: state.explorer.searchValidate
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setSearchCat: payload =>
      dispatch(createAction('explorer/setSearchCat')(payload)),
    searchOn: payload => dispatch(createAction('explorer/searchOn')(payload)),
    validateOn: payload =>
      dispatch(createAction('explorer/validateOn')(payload))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchComp)
