import { Avatar, Row, Col, Divider, Button } from 'antd'

const styles = {
  title: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 0,
    textAlign: 'left',
    color: '#a0a0a0'
  },
  text: {
    fontSize: 30,
    textAlign: 'left',
    margin: 0
  },
  avatar: { backgroundColor: '#dddddd', marginTop: -32 },
  walletTitleContainer: {
    display: 'inline-block',
    marginLeft: 32,
    marginTop: 16
  },
  walletTitle: { fontSize: 24, textAlign: 'left', margin: 0 },
  walletSubTitle: {
    fontSize: 12,
    color: '#a0a0a0',
    textAlign: 'left',
    margin: 0
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 32
  }
}

const WalletTop = ({
  accountLength,
  openCreateDrawer,
  openImportDrawer,
  totalBalance
}) => {
  return (
    <div style={{ background: '#ffffff' }}>
      <Row gutter={24}>
        <Col span={12} style={{ textAlign: 'left' }}>
          <Avatar size={64} icon="user" shape="circle" style={styles.avatar} />
          <div style={styles.walletTitleContainer}>
            <p style={styles.walletTitle}>My Wallet</p>
            <p style={styles.walletSubTitle}>In Crypto We Don't Need Trust</p>
          </div>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <div style={{ display: 'inline-block', marginRight: 16 }}>
            <p style={styles.title}>Assets</p>
            <p style={styles.text}>{totalBalance}</p>
          </div>
          <Divider type="vertical" />
          <div style={{ display: 'inline-block' }}>
            <p style={{ ...styles.title, textAlign: 'right' }}>Accounts</p>
            <p style={{ ...styles.text, textAlign: 'right' }}>
              {accountLength}
            </p>
          </div>
        </Col>
      </Row>
      <div style={styles.buttonContainer}>
        <Button type="primary" size="large" onClick={() => openCreateDrawer()}>
          Create Account
        </Button>
        <Button
          type="dashed"
          size="large"
          style={{ marginLeft: 16 }}
          onClick={() => openImportDrawer()}>
          Import Account
        </Button>
      </div>
    </div>
  )
}

export default WalletTop
