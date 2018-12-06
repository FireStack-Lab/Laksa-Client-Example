import withRouter from 'umi/withRouter'
import Link from 'umi/link'
import { Layout, Breadcrumb } from 'antd'
import Menus from './Header'
import WalletSign from '../component/WalletSign'
import Code from '../component/Code'
import styles from './index.css'

const { Header, Content, Footer } = Layout
const breadcrumbNameMap = {
  '/explorer': 'Explorer',
  '/explorer/dsBlock': 'DsBlock',
  '/explorer/txBlock': 'TxBlock',
  '/explorer/transaction': 'Transaction',
  '/explorer/account': 'Address',
  '/wallet': 'Wallet',
  '/contract': 'Contract',
  '/transfer': 'Transfer'
  // '/apps/2': 'Application2',
  // '/apps/1/detail': 'Detail',
  // '/apps/2/detail': 'Detail'
}

function BasicLayout(props) {
  const { location } = props
  const pathSnippets = location.pathname.split('/').filter(i => i)
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`

    return (
      <Breadcrumb.Item key={url}>
        {index < 1 ? (
          <Link to={url}>{breadcrumbNameMap[url]}</Link>
        ) : (
          breadcrumbNameMap[url]
        )}
      </Breadcrumb.Item>
    )
  })
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>
  ].concat(extraBreadcrumbItems)
  return (
    <Layout className={styles.normal}>
      <Header>
        <Menus location={props.location} />
      </Header>
      <Content>
        <div style={{ padding: 32, background: '#ffffff' }}>
          <WalletSign />
          <Code />
          <div
            style={{
              textAlign: 'left',
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 64,
              paddingRight: 64,
              fontSize: 16
            }}>
            <Breadcrumb>{breadcrumbItems}</Breadcrumb>
          </div>
          {props.children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Laksa Example ©2018 Created by FireStack
      </Footer>
    </Layout>
  )
}

export default withRouter(BasicLayout)
