import { Menu, Icon } from 'antd'
import Link from 'umi/link'

const SubMenu = Menu.SubMenu

function GetUrlRelativePath(url) {
  var arrUrl = url.split('/')

  return `/${arrUrl[1]}`
}

function Menus({ location }) {
  const formatedUrl = GetUrlRelativePath(location.pathname)
  return (
    <Menu
      selectedKeys={[formatedUrl]}
      mode="horizontal"
      theme="dark"
      style={{ lineHeight: '64px' }}>
      <Menu.Item key="/">
        <Link to="/">
          <Icon type="home" />
          Home
        </Link>
      </Menu.Item>
      <Menu.Item key="/explorer">
        <Link to="/explorer">
          <Icon type="search" />
          Explorer
        </Link>
      </Menu.Item>
      <Menu.Item key="/wallet">
        <Link to="/wallet">
          <Icon type="wallet" />
          Wallet
        </Link>
      </Menu.Item>
      <Menu.Item key="/contract">
        <Link to="/contract">
          <Icon type="form" />
          Contract
        </Link>
      </Menu.Item>
      <Menu.Item key="/transfer">
        <Link to="/transfer">
          <Icon type="swap" />
          Transfer
        </Link>
      </Menu.Item>
      <SubMenu
        key="/docs"
        title={
          <span>
            <Icon type="book" />
            <span>Docs</span>
          </span>
        }>
        <Menu.Item key="/laksaDocs">
          <a
            href="//firestack-lab.github.io/Laksa-docs/"
            target="_blank"
            rel="noopener noreferrer">
            Laska Docs
          </a>
        </Menu.Item>
        <Menu.Item key="/scillaDocs">
          <a href="//scilla-lang.org" target="_blank" rel="noopener noreferrer">
            Scilla Docs
          </a>
        </Menu.Item>
        <Menu.Item key="/RPCDocs">
          <a
            href="//apidocs.zilliqa.com"
            target="_blank"
            rel="noopener noreferrer">
            RPC APIs
          </a>
        </Menu.Item>
      </SubMenu>

      <Menu.Item key="/IDE">
        <a
          href="//savant-ide.zilliqa.com/"
          target="_blank"
          rel="noopener noreferrer">
          <Icon type="code" />
          Savant-IDE
        </a>
      </Menu.Item>
      {/* <Menu.Item key="/Setting">
        <Link to="/setting">
          <Icon type="setting" />
          Setting
        </Link>
      </Menu.Item>
      <Menu.Item key="/404">
        <Link to="/page-you-dont-know">
          <Icon type="frown-circle" />
          404
        </Link>
      </Menu.Item> */}
    </Menu>
  )
}

export default Menus
