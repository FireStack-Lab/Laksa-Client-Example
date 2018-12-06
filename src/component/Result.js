import { Spin, Divider } from 'antd'

const Spinner = ({ text }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    }}>
    <Spin tip={text} style={{ textAlign: 'center' }} />
  </div>
)

const Result = props => {
  return (
    <div style={{ paddingLeft: 32, paddingRight: 32, textAlign: 'left' }}>
      {props.transferStart && !props.transferFinished ? null : props.sent !==
      undefined ? (
        <div>
          {typeof props.sent === 'string' ? (
            props.sent
          ) : (
            <div>
              <h3>The Transaction is sent</h3>
              <h4>Transaction ID</h4>
              <p>{props.sent.TranID}</p>
              <h4>Contract Address</h4>
              <p>{props.sent.ContractAddress || 'Non Contract Transaction'}</p>
              <h4>Created Time</h4>
              <p>{props.sent.createdTime.toString()}</p>
              <Divider />
              {props.confirmLoading ? (
                <div>
                  <Spinner text="Confirming Transaction" />
                </div>
              ) : (
                <div>
                  <h4>Deploy Status</h4>
                  <p>{props.confirmStatus.status}</p>
                  <h4>Gas Fee</h4>
                  <p>{props.confirmStatus.gas}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default Result
