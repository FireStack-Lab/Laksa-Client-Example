import { createAction, storage } from '../../../utils'
import {
  updateBalance,
  encryptAccount,
  updateAccount,
  exportAccount,
  decryptAccount,
  getAccountBalance
} from '../../../services/laksa'
import WalletDB from '../../../services/database/wallet'

const db = new WalletDB('@@laksaAccount@@')

export default {
  namespace: 'wallet',
  state: {
    accounts: [],
    signer: null,
    totalBalance: 0,
    createDrawerVisible: false,
    importDrawerVisible: false,
    decryptModalVisible: false,
    setSignerModalVisible: false,
    toDecrypt: {},
    toEncrypt: {},
    exportedStr: ''
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *getLocalAccountsBalance(_, { put, call, select }) {
      const saved = yield call(db.getAll)
      const laksa = yield select(state => state.laksa.laksa)

      if (saved) {
        for (let i in saved) {
          try {
            const result = yield call(
              getAccountBalance,
              laksa.wallet,
              saved[i].address
            )
            const newAccountObject = {
              ...saved[i],
              balance: result.balance,
              nonce: result.nonce
            }
            yield call(
              updateAccount,
              laksa.wallet,
              saved[i].address,
              newAccountObject
            )
            yield put(createAction('updateDB')(newAccountObject))
          } catch (error) {}
        }
      }
    },
    *setSigner({ payload }, { put, call, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      laksa.wallet.setSigner(payload)
      const { signer } = laksa.wallet
      yield put(createAction('updateState')({ signer: signer.address }))
      yield call(db.setSigner, { address: signer.address })
      // storage.write('@@LaksaSigner@@', signer.address)
      yield put(createAction('hideSetSignerModal')())
    },
    *refreshTotalBalance(_, { put, call, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      let totalBalance = 0
      const accounts = laksa.wallet.accounts

      for (let i in accounts) {
        let result = { nonce: 0, balance: '0' }
        try {
          result = yield call(getAccountBalance, laksa.wallet, accounts[i])
        } catch (error) {}

        totalBalance += Number(result.balance || 0, 10)
      }

      yield put(createAction('updateState')({ totalBalance }))
    },
    *concatToWallet(_, { put, call, select }) {
      const saved = yield call(db.getAll)
      const laksa = yield select(state => state.laksa.laksa)
      const walletAccounts = laksa.wallet.getWalletAccounts()

      if (saved && saved.length > walletAccounts.length) {
        saved.map(d => laksa.wallet.addAccount(d))
      }
      const signer = yield call(db.getSigner)

      if (signer.length > 0) {
        laksa.wallet.setSigner(signer[0].address)
        yield put(createAction('updateState')({ signer: signer[0].address }))
      }

      yield put(createAction('updateState')({ accounts: saved }))
    },
    *importPrivateKey({ payload }, { put, call, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      const account = laksa.wallet.importAccountFromPrivateKey(
        payload.privateKey
      )
      if (account) {
        const encryptedAccount = yield call(
          encryptAccount,
          laksa.wallet,
          account.address,
          payload.password
        )
        try {
          yield call(updateBalance, account)
        } catch (error) {}

        encryptedAccount.name = payload.name

        yield call(
          updateAccount,
          laksa.wallet,
          account.address,
          encryptedAccount
        )

        yield put(
          createAction('saveAccountString')({
            account: encryptedAccount
          })
        )
      }
    },
    *decryptAccount({ payload }, { put, call, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      const decryptedAccount = yield call(
        decryptAccount,
        laksa.wallet,
        payload.account.address,
        payload.password
      )

      yield put(
        createAction('updateDB')({
          ...decryptedAccount,
          name: payload.account.name,
          balance: payload.account.balance,
          nonce: payload.account.nonce
        })
      )
    },
    *encryptAccount({ payload }, { put, call, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      const encryptedAccount = yield call(
        encryptAccount,
        laksa.wallet,
        payload.account.address,
        payload.password
      )
      yield put(
        createAction('saveAccountString')({
          account: {
            ...encryptedAccount,
            name: payload.account.name,
            balance: payload.account.balance,
            nonce: payload.account.nonce
          }
        })
      )
    },
    *createAccount({ payload }, { put, call, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      const account = laksa.wallet.createAccount()

      const encryptedAccount = yield call(
        encryptAccount,
        laksa.wallet,
        account.address,
        payload.password
      )

      encryptedAccount.name = payload.name
      yield put(
        createAction('saveAccountString')({
          account: encryptedAccount
        })
      )
      yield call(updateAccount, laksa.wallet, account.address, encryptedAccount)
      yield put(createAction('getAccountBalance')(encryptedAccount))
    },
    *getAccountBalance({ payload }, { put, call, select }) {
      try {
        const laksa = yield select(state => state.laksa.laksa)

        const AccountObject = yield call(updateBalance, payload)

        yield put(
          createAction('saveAccountString')({
            account: AccountObject
          })
        )
        yield call(updateAccount, laksa.wallet, payload.address, AccountObject)
      } catch (error) {}
    },
    *exportAccount({ payload }, { put, call, select }) {
      yield put(
        createAction('updateState')({
          exportedStr: JSON.stringify(payload.account)
        })
      )
    },
    *saveAccountString({ payload }, { put, call, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      const str = yield call(
        exportAccount,
        laksa.wallet,
        payload.account.address
      )
      const strObj = {
        ...payload.account,
        ...JSON.parse(str),
        name: payload.account.name
      }

      yield put(createAction('updateDB')(strObj))
    },
    *updateDB({ payload }, { put, call }) {
      yield call(db.save, payload)
      yield put(createAction('loadDBToState')())
      yield put(createAction('refreshTotalBalance')())
    },
    *loadDBToState(_, { put, call }) {
      const saved = yield call(db.getAll)
      yield put(createAction('updateState')({ accounts: saved }))
      const signer = yield call(db.getSigner)
      if (signer.length > 0) {
        yield put(createAction('updateState')({ signer: signer[0].address }))
      }
    },
    *openCreateDrawer(_, { put }) {
      yield put(
        createAction('updateState')({
          createDrawerVisible: true
        })
      )
    },
    *hideCreateDrawer(_, { put }) {
      yield put(
        createAction('updateState')({
          createDrawerVisible: false
        })
      )
    },
    *openImportDrawer(_, { put }) {
      yield put(
        createAction('updateState')({
          importDrawerVisible: true
        })
      )
    },
    *hideImportDrawer(_, { put }) {
      yield put(
        createAction('updateState')({
          importDrawerVisible: false
        })
      )
    },
    *openSetSignerModal(_, { put }) {
      yield put(
        createAction('updateState')({
          setSignerModalVisible: true
        })
      )
    },
    *hideSetSignerModal(_, { put }) {
      yield put(
        createAction('updateState')({
          setSignerModalVisible: false
        })
      )
    },
    *openDecryptModal({ payload }, { put }) {
      const { type } = payload
      if (type === 'decrypt') {
        yield put(
          createAction('updateState')({
            toDecrypt: payload.account,
            toEncrypt: {},
            decryptModalVisible: true
          })
        )
      } else {
        yield put(
          createAction('updateState')({
            toDecrypt: {},
            toEncrypt: payload.account,
            decryptModalVisible: true
          })
        )
      }
    },
    *hideDecryptModal(_, { put }) {
      yield put(
        createAction('updateState')({
          toEncrypt: {},
          toDecrypt: {},
          decryptModalVisible: false
        })
      )
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'concatToWallet' })
      dispatch({ type: 'getLocalAccountsBalance' })
    }
  }
}
