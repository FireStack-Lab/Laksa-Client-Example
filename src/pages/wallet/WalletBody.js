import { Row, Col, Card, Icon } from 'antd'
import AccountCard from './AccountCard'

const gridStyle = {
  // width: '25%'
  // height: 150
  // textAlign: 'center'
}

const styles = {
  featuresContainer: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  label: { fontWeight: '700', fontSize: 16, marginLeft: 8 }
}

function renderAccountGrid(
  accounts,
  { exportAccount, openDecryptModal, signer }
) {
  if (accounts.length > 0) {
    return accounts.map(d => {
      return (
        <Card.Grid style={gridStyle} key={d.address}>
          <AccountCard
            account={d}
            address={d.address}
            name={d.name}
            exportAccount={exportAccount}
            openDecryptModal={openDecryptModal}
            signer={signer ? d.address === signer : false}
          />
        </Card.Grid>
      )
    })
  } else {
    return null
  }
}

const WalletBody = ({
  accounts,
  exportAccount,
  openDecryptModal,
  openSetSignerModal,
  setSigner,
  signer
}) => {
  return (
    <div style={{ marginTop: 64 }}>
      <Row gutter={24}>
        <Col span={16} style={{ textAlign: 'left' }}>
          <Card title="Accounts">
            {renderAccountGrid(accounts, {
              exportAccount,
              openDecryptModal,
              signer
            })}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Features" style={{ textAlign: 'left' }}>
            <Card.Grid style={gridStyle}>
              <div
                onClick={() => openSetSignerModal()}
                style={styles.featuresContainer}>
                <Icon
                  type="heart"
                  theme="twoTone"
                  twoToneColor="#eb2f96"
                  style={{ fontSize: 18 }}
                />
                <div style={styles.label}>Signer</div>
              </div>
            </Card.Grid>

            <Card.Grid style={gridStyle}>
              <div
                onClick={() => console.log('sss')}
                style={styles.featuresContainer}>
                <Icon type="copy" theme="twoTone" twoToneColor="#eb2f96" />
                <div style={styles.label}>Creates</div>
              </div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <div
                onClick={() => console.log('sss')}
                style={styles.featuresContainer}>
                <Icon
                  type="plus-circle"
                  theme="twoTone"
                  twoToneColor="#eb2f96"
                  style={{ fontSize: 18 }}
                />
                <div style={styles.label}>Imports</div>
              </div>
            </Card.Grid>

            <Card.Grid style={gridStyle}>
              <div
                onClick={() => console.log('sss')}
                style={styles.featuresContainer}>
                <Icon type="lock" theme="twoTone" twoToneColor="#eb2f96" />
                <div style={styles.label}>Encrypts</div>
              </div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <div
                onClick={() => console.log('sss')}
                style={styles.featuresContainer}>
                <Icon type="file-text" theme="twoTone" twoToneColor="#eb2f96" />
                <div style={styles.label}>Exports</div>
              </div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <div
                onClick={() => console.log('sss')}
                style={styles.featuresContainer}>
                <Icon type="delete" theme="twoTone" twoToneColor="#eb2f96" />
                <div style={styles.label}>Removes</div>
              </div>
            </Card.Grid>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default WalletBody
