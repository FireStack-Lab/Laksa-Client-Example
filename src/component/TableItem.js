import { Row, Col } from 'antd'

const RenderLink = ({ link, value, linkAction }) => {
  if (typeof link === 'string' && value !== 'UNDEFINED') {
    return <a onClick={() => linkAction({ address: value })}>{value}</a>
  } else return <span>{value}</span>
}

export default ({ label, value, link, linkAction }) => {
  let renderValue
  if (value === undefined) {
    renderValue = `${value}`.toUpperCase()
  } else if (typeof value !== 'string' && value !== undefined) {
    renderValue = JSON.stringify(value).toUpperCase()
  } else {
    renderValue = value.toUpperCase()
  }

  return (
    <div
      style={{
        fontFamily:
          '"Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
      }}>
      <Row gutter={24}>
        <Col
          span={4}
          style={{
            color: '#3399ff',
            fontSize: 14
          }}>
          {label.toUpperCase()}
        </Col>
        <Col
          span={20}
          style={{
            color: '#333333',
            fontSize: 14,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-all'
          }}>
          <RenderLink link={link} value={renderValue} linkAction={linkAction} />
        </Col>
      </Row>
    </div>
  )
}
