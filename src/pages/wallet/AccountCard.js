import { Card, Icon, Dropdown, Menu } from 'antd'
import randomColor from 'randomcolor'
import { PandaIcon, AddressIcon } from '../../component/Icon'
import { connect } from 'dva'
import { createAction } from '../../utils'

const styles = {
  cardBottom: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 16,
    color: '#3399ff',
    cursor: 'pointer'
  }
}
function colorGroups(str) {
  if (str.length === 40) {
    const strGroups = []
    for (let i = 0; i < str.length; i += 5) {
      strGroups.push(
        randomColor({
          seed: str.substring(i, i + 5)
          // luminosity: 'dark'
        })
      )
    }
    return strGroups
  }
}

function handleMenuClick(
  e,
  account,
  { exportAccount, openDecryptModal, searchAddress }
) {
  switch (e.key) {
    case 'export':
      exportAccount({ account })
      break
    case 'decrypt':
      openDecryptModal({ account, type: 'decrypt' })
      // decryptAccount({ account })
      break
    case 'encrypt':
      openDecryptModal({ account, type: 'encrypt' })
      // decryptAccount({ account })
      break
    case 'detail':
      // console.log('detail')
      // gotoDetail({ account, type: 'detail' })
      searchAddress(account)
      break
    default:
      break
  }
}

const AccountCardTop = ({ encrypted, name, signer, address }) => {
  const colors = colorGroups(address)
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
      <span>
        {encrypted ? (
          <AddressIcon colors={colors} style={{ fontSize: 32 }} />
        ) : (
          <Icon type="unlock" style={{ color: '#f25718', fontSize: 32 }} />
        )}

        <div
          style={{
            marginLeft: 16,
            fontWeight: '700',
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'inline-block'
          }}>
          {name}
        </div>
      </span>
      {signer ? (
        <Icon
          type="heart"
          theme="twoTone"
          twoToneColor="#eb2f96"
          style={{ alignSelf: 'flex-end', fontSize: 24 }}
        />
      ) : null}
    </div>
  )
}

const DropdownMenus = ({
  encrypted,
  account,
  exportAccount,
  openDecryptModal,
  searchAddress
}) => {
  return (
    <Dropdown
      overlay={
        <Menu
          onClick={e =>
            handleMenuClick(e, account, {
              exportAccount,
              openDecryptModal,
              searchAddress
            })
          }>
          {encrypted ? (
            <Menu.Item key="export">
              <Icon type="export" theme="outlined" />
              Export
            </Menu.Item>
          ) : null}
          {encrypted ? (
            <Menu.Item key="decrypt">
              <Icon type="user" />
              Decrypt
            </Menu.Item>
          ) : null}
          {!encrypted ? (
            <Menu.Item key="encrypt">
              <Icon type="user" />
              Encrypt
            </Menu.Item>
          ) : null}
          <Menu.Item key="detail">
            <Icon type="search" />
            Detail
          </Menu.Item>
        </Menu>
      }>
      <Icon type="ellipsis" theme="outlined" />
    </Dropdown>
  )
}

const AccountCard = ({
  account,
  address,
  name,
  exportAccount,
  openDecryptModal,
  searchAddress,
  signer
}) => {
  const encrypted = typeof account.crypto === 'object'
  return (
    <Card bordered={false} style={{ textAlign: 'left', width: '100%' }}>
      <AccountCardTop
        encrypted={encrypted}
        name={name}
        signer={signer}
        address={address}
      />
      <div style={{ wordBreak: 'break-all', marginBottom: 16 }}>{address}</div>
      <div style={styles.cardBottom}>
        <div>
          <Icon type="pound" theme="outlined" />
          <span style={{ marginLeft: 8, wordBreak: 'break-all' }}>
            {account.balance}
          </span>
        </div>
        <DropdownMenus
          encrypted={encrypted}
          account={account}
          exportAccount={exportAccount}
          openDecryptModal={openDecryptModal}
          searchAddress={searchAddress}
        />
      </div>
    </Card>
  )
}

function mapStateToProps(state) {
  return {}
}
function mapDispatchToProps(dispatch) {
  return {
    searchAddress: payload =>
      dispatch(createAction('explorer/searchAddress')(payload))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountCard)
