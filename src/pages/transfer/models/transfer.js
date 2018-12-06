import { isPrivateKey, Long, BN } from 'laksa-utils'
import { createAction } from '../../../utils'
import {
  transactionConfirm,
  decryptAccount,
  encryptAccount,
  signTransactionAndSend
} from '../../../services/laksa'

import WalletDB from '../../../services/database/wallet'
import TranDB from '../../../services/database/transactions'
const AccountsDB = new WalletDB('@@laksaAccount@@')
const TransactionsDB = new TranDB('@@laksaTransaction@@')

const initialState = {
  toAddr: '',
  address: '',
  balance: '0',
  nonce: 0,
  password: '',
  isEncrypted: false,
  gasLimit: undefined,
  gasPrice: undefined,
  amount: undefined,
  transferLoading: false,
  transferStart: false,
  transferFinished: false,
  confirmLoading: false,
  confirmStatus: {
    status: undefined,
    gas: undefined
  },
  sent: undefined
}

export default {
  state: {
    ...initialState
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *getBalance({ payload }, { put, call, select }) {
      yield put(
        createAction('updateState')({
          address: payload,
          balance: '-',
          nonce: '-',
          isEncrypted: false,
          password: ''
        })
      )
      const laksa = yield select(state => state.laksa.laksa)
      try {
        const { privateKey } = yield call(AccountsDB.getId, payload)

        const result = yield call(laksa.zil.getBalance, { address: payload })

        yield put(
          createAction('updateState')({
            ...result,
            isEncrypted: !isPrivateKey(privateKey),
            address: payload
          })
        )
      } catch (error) {}
    },

    *accountFormValidate({ payload }, { call, put }) {
      yield put(
        createAction('updateState')({ accountFormValidateStatus: payload })
      )
    },
    *setTransactionObject({ payload }, { call, put }) {
      if (payload) {
        yield put(
          createAction('updateState')({
            ...payload,
            address: payload.account
          })
        )
      }
    },
    *transferToken(_, { call, put, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      const toAddr = yield select(state => state.transfer.toAddr)
      const address = yield select(state => state.transfer.address)
      const password = yield select(state => state.transfer.password)
      const gasLimit = yield select(state => state.transfer.gasLimit)
      const gasPrice = yield select(state => state.transfer.gasPrice)
      const amount = yield select(state => state.transfer.amount)
      try {
        yield put(createAction('updateState')({ transferLoading: true }))
        yield call(decryptAccount, laksa.wallet, address, password)
        const accountWithFunction = yield call(
          encryptAccount,
          laksa.wallet,
          address,
          password
        )
        const transactionObject = laksa.transactions.new({
          version: 0,
          toAddr,
          gasLimit: Long.fromNumber(gasLimit),
          gasPrice: new BN(gasPrice),
          amount: new BN(amount)
        })

        const transferResult = yield call(
          signTransactionAndSend,
          accountWithFunction,
          password,
          transactionObject
        )
        const saveToDB = {
          ...transferResult.transaction,
          gas: 'unknown',
          TranID: transferResult.transaction.TranID,
          createdTime: new Date(),
          updateTime: new Date(),
          signerAccount: address
        }
        yield call(TransactionsDB.save, saveToDB)
        yield put(
          createAction('updateState')({
            sent: saveToDB,
            transferStart: false,
            transferFinished: true,
            transferLoading: false
          })
        )
        // yield put(createAction('deploy/getSent')())
        yield put(
          createAction('confirmTxn')({
            Transaction: transferResult.transaction,
            createdTime: saveToDB.createdTime,
            signerAccount: address
          })
        )
      } catch (error) {
        console.log(error)
      }
    },
    *confirmTxn({ payload }, { call, put, select }) {
      yield put(createAction('updateState')({ confirmLoading: true }))
      const { Transaction } = payload

      try {
        const confirmTransaction = yield call(transactionConfirm, Transaction)
        yield put(
          createAction('updateState')({
            confirmStatus: {
              status:
                confirmTransaction && confirmTransaction.status
                  ? confirmTransaction.status
                  : 'sent',
              gas:
                confirmTransaction && confirmTransaction.receipt
                  ? confirmTransaction.receipt.cumulative_gas
                  : 'unknown'
            }
          })
        )

        yield call(TransactionsDB.save, {
          ...Transaction,
          updateTime: new Date()
        })
        yield put(
          createAction('updateState')({
            toAddr: '',
            address: '',
            balance: '0',
            nonce: 0,
            password: '',
            isEncrypted: false,
            gasLimit: undefined,
            gasPrice: undefined,
            amount: undefined,
            confirmLoading: false,
            transferLoading: false,
            transferStart: false,
            transferFinished: false
          })
        )
      } catch (error) {
        console.log(error)
      }

      // yield put(createAction('getSent')())
      // yield put(createAction('getRejected')())
      // yield put(createAction('getDeployed')())
    },
    *clearPage(_, { put }) {
      yield put(
        createAction('updateState')({
          ...initialState
        })
      )
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      const pathname = history.location.pathname

      if (!!pathname.match('/transfer')) {
        dispatch({
          type: 'updateState',
          payload: { ...initialState }
        })
      }
    }
  }
}
