import { TestScilla, ContractStatus } from 'laksa-core-contract'
import { TxStatus } from 'laksa-core-transaction'
import { isPrivateKey, Long, BN } from 'laksa-utils'
import { createAction } from '../../../utils'
import {
  getABI,
  createNewContract,
  confirmContract,
  decryptAccount,
  encryptAccount,
  signAndSend,
  zilConfirmContract,
  callContract
} from '../../../services/laksa'
import ContractsDB from '../../../services/database/contracts'
import WalletDB from '../../../services/database/wallet'
import TranDB from '../../../services/database/transactions'

const CodeDB = new ContractsDB('@@laksaCode@@')
const AccountsDB = new WalletDB('@@laksaAccount@@')
const TransactionsDB = new TranDB('@@laksaTransaction@@')
const initialState = {
  toAddr: '',
  address: '',
  balance: '0',
  nonce: 0,
  password: '',
  isEncrypted: false,
  drawerOpen: false,
  callDrawerOpen: false,
  selectedContract: undefined,
  selectedCallContract: undefined,
  selectedTransition: undefined,
  params: [],
  paramsValues: [],
  transitions: [],
  transitionParams: [],
  loadingABI: false,
  transitionFormValidateStatus: false,
  initFormValidateStatus: false,
  accountFormValidateStatus: false,
  currentStep: 1,
  gasLimit: '',
  gasPrice: '',
  ammout: '',
  confirmLoading: false,
  signingLoading: false,
  sent: undefined,
  signStart: false,
  signFinished: false,
  callLoading: false,
  callStart: false,
  callFinished: false,
  confirmStatus: {
    status: undefined,
    gas: undefined
  },
  deployedContracts: [],
  sentContracts: [],
  rejectedContracts: []
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
    *getABI({ payload }, { put, call, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      const { code } = payload
      yield put(
        createAction('updateState')({
          loadingABI: true,
          initFormValidateStatus: false
        })
      )
      try {
        const contract = new TestScilla(
          laksa.contracts.messenger,
          laksa.contracts.signer
        )
        const { abi } = yield call(getABI, contract, code)
        yield put(
          createAction('updateState')({ params: abi.params, loadingABI: false })
        )
      } catch (error) {}
    },
    *setParamsValues({ payload }, { call, put, select }) {
      try {
        const params = yield select(state => state.deploy.params)
        if (params.length !== payload.length) {
          throw new Error('params and values length not match')
        }
        params.forEach((d, index) => {
          if (d.type.match('Uint')) {
            return Object.assign(d, { value: Number(payload[index].value, 10) })
          }
          return Object.assign(d, payload[index])
        })
        yield put(createAction('updateState')({ paramsValues: params }))
      } catch (error) {}
    },
    *selectContract({ payload }, { call, put }) {
      yield put(
        createAction('updateState')({ selectedContract: payload.CodeId })
      )
      try {
        const { code } = yield call(CodeDB.getId, payload.CodeId)
        yield put(createAction('getABI')({ code }))
      } catch (e) {}
    },
    *selectCallContract({ payload }, { call, put, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      const selectedCallContract = JSON.parse(payload)
      yield put(
        createAction('updateState')({
          selectedCallContract,
          loadingABI: true
        })
      )

      try {
        const code = yield call(laksa.zil.getSmartContractCode, {
          address: selectedCallContract.ContractAddress
        })

        if (code && code.code) {
          const contract = new TestScilla(
            laksa.contracts.messenger,
            laksa.contracts.signer
          )
          const { abi } = yield call(getABI, contract, code.code)

          yield put(
            createAction('updateState')({
              transitions: abi.transitions,
              loadingABI: false
            })
          )
        }
      } catch (error) {
        console.log(error)
      }
    },
    *selectTransition({ payload }, { call, put }) {
      yield put(createAction('updateState')({ selectedTransition: payload }))
    },
    *setTransitionParams({ payload }, { call, put }) {
      yield put(createAction('updateState')({ transitionParams: payload }))
    },
    *transitionFormValidate({ payload }, { call, put }) {
      yield put(
        createAction('updateState')({ transitionFormValidateStatus: payload })
      )
    },
    *initFormValidate({ payload }, { call, put }) {
      yield put(
        createAction('updateState')({ initFormValidateStatus: payload })
      )
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
      const toAddr = yield select(state => state.deploy.toAddr)
      const address = yield select(state => state.deploy.address)
      const password = yield select(state => state.deploy.password)
      const gasLimit = yield select(state => state.deploy.gasLimit)
      const gasPrice = yield select(state => state.deploy.gasPrice)
      try {
        yield call(decryptAccount, laksa.wallet, address, password)
        const accountWithFunction = yield call(
          encryptAccount,
          laksa.wallet,
          address,
          password
        )
        console.log({
          toAddr,
          account: accountWithFunction,
          password,
          gasLimit,
          gasPrice
        })
      } catch (error) {}
    },
    *signContract(_, { call, put, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      const paramsValues = yield select(state => state.deploy.paramsValues)
      const CodeId = yield select(state => state.deploy.selectedContract)
      const address = yield select(state => state.deploy.address)
      const password = yield select(state => state.deploy.password)
      const gasLimit = yield select(state => state.deploy.gasLimit)
      const gasPrice = yield select(state => state.deploy.gasPrice)
      try {
        yield put(createAction('updateState')({ signingLoading: true }))
        const contract = yield call(CodeDB.getId, CodeId)
        // const account = yield call(AccountsDB.getId, address)
        yield call(decryptAccount, laksa.wallet, address, password)
        const accountWithFunction = yield call(
          encryptAccount,
          laksa.wallet,
          address,
          password
        )

        const newContract = yield call(
          createNewContract,
          laksa.contracts,
          contract.code,
          paramsValues
        )
        newContract.setInitParamsValues(paramsValues, paramsValues)
        const deployObject = {
          gasLimit: Long.fromNumber(Number(gasLimit, 10)),
          gasPrice: new BN(Number(gasPrice, 10))
        }
        const accountObject = {
          account: accountWithFunction,
          password
        }
        const sent = yield call(
          signAndSend,
          newContract,
          deployObject,
          accountObject
        )

        const saveToDB = {
          ...sent,
          CodeId,
          CodeName: contract.CodeName,
          gas: 'unknown',
          TranID: sent.transaction.TranID,
          createdTime: new Date(),
          updateTime: new Date(),
          signerAccount: accountObject.account.address
        }

        yield call(TransactionsDB.save, saveToDB)
        yield put(
          createAction('updateState')({
            sent: saveToDB,
            signStart: false,
            signFinished: true,
            signingLoading: false
          })
        )
        yield put(createAction('getSent')())
        yield put(
          createAction('confirmContract')({
            CodeId,
            CodeName: contract.CodeName,
            TranID: sent.transaction.TranID,
            contract: sent,
            createdTime: saveToDB.createdTime,
            signerAccount: accountObject.account.address
          })
        )
      } catch (e) {
        yield put(
          createAction('updateState')({
            sent: e.toString(),
            signStart: false,
            signFinished: true,
            signingLoading: false
          })
        )
        yield put(createAction('getRejected')())
      }
    },
    *callContract(_, { call, put, select }) {
      const laksa = yield select(state => state.laksa.laksa)

      const transitionParams = yield select(
        state => state.deploy.transitionParams
      )
      const selectedCallContract = yield select(
        state => state.deploy.selectedCallContract
      )
      const address = yield select(state => state.deploy.address)
      const selectedTransition = yield select(
        state => state.deploy.selectedTransition
      )
      const password = yield select(state => state.deploy.password)
      const amount = yield select(state => state.deploy.amount)
      const gasLimit = yield select(state => state.deploy.gasLimit)
      const gasPrice = yield select(state => state.deploy.gasPrice)
      try {
        yield put(createAction('updateState')({ callLoading: true }))
        // const contract = yield call(CodeDB.getId, CodeId)
        // const account = yield call(AccountsDB.getId, address)
        yield call(decryptAccount, laksa.wallet, address, password)
        // console.log(selectedCallContract)
        const contractObject = yield call(
          TransactionsDB.getContractById,
          selectedCallContract.ContractAddress
        )
        const { CodeId } = selectedCallContract
        const contractToCall = laksa.contracts.at(contractObject[0])

        const accountWithFunction = yield call(
          encryptAccount,
          laksa.wallet,
          address,
          password
        )

        const callResult = yield call(callContract, contractToCall, {
          transition: selectedTransition.value,
          params: transitionParams,
          amount: new BN(amount),
          gasLimit: Long.fromNumber(Number(gasLimit, 10)),
          gasPrice: new BN(Number(gasPrice, 10)),
          account: accountWithFunction,
          password
        })

        const saveToDB = {
          ...callResult,
          ContractAddress: selectedCallContract.ContractAddress,
          CodeName: selectedCallContract.CodeName,
          CodeId,
          gas: 'unknown',
          TranID: callResult.transaction.TranID,
          createdTime: new Date(),
          updateTime: new Date(),
          signerAccount: address
        }

        yield call(TransactionsDB.save, saveToDB)
        yield put(
          createAction('updateState')({
            sent: saveToDB,
            callStart: false,
            callFinished: true,
            callLoading: false
          })
        )
        yield put(createAction('getSent')())
        yield put(
          createAction('confirmContract')({
            CodeId,
            ContractAddress: selectedCallContract.ContractAddress,
            CodeName: selectedCallContract.CodeName,
            TranID: callResult.transaction.TranID,
            contract: callResult,
            createdTime: saveToDB.createdTime,
            signerAccount: address
          })
        )
      } catch (e) {
        console.log(e)
        yield put(
          createAction('updateState')({
            sent: e.toString(),
            callStart: false,
            callFinished: true,
            callLoading: false
          })
        )
        yield put(createAction('getRejected')())
      }
    },
    *confirmContract({ payload }, { call, put, select }) {
      yield put(createAction('updateState')({ confirmLoading: true }))
      const laksa = yield select(state => state.laksa.laksa)
      const {
        TranID,
        contract,
        signerAccount,
        createdTime,
        ContractAddress,
        CodeName
      } = payload
      let confirmTransaction
      if (contract !== undefined) {
        try {
          confirmTransaction = yield call(confirmContract, contract)
        } catch (error) {}
        yield put(
          createAction('updateState')({
            confirmStatus: {
              status:
                confirmTransaction && confirmTransaction.status
                  ? confirmTransaction.status
                  : ContractStatus.SENT,
              gas:
                confirmTransaction && confirmTransaction.receipt
                  ? confirmTransaction.receipt.cumulative_gas
                  : 'unknown'
            }
          })
        )
        yield put(createAction('updateState')({ confirmLoading: false }))
      } else {
        try {
          confirmTransaction = yield call(zilConfirmContract, laksa.zil, TranID)
        } catch (error) {}
      }
      let switchStatus =
        confirmTransaction && confirmTransaction.status
          ? confirmTransaction.status
          : 'default'
      switch (switchStatus) {
        case TxStatus.Confirmed: {
          payload.status = ContractStatus.DEPLOYED
          payload.gas = confirmTransaction.receipt.cumulative_gas
          break
        }
        case TxStatus.Rejected: {
          payload.status = ContractStatus.REJECTED
          payload.gas = 'unknown'
          break
        }
        default:
          break
      }

      if (contract !== undefined) {
        yield call(TransactionsDB.save, {
          ...contract,
          ...payload,
          signerAccount,
          createdTime,
          updateTime: new Date(),
          ContractAddress: ContractAddress || contract.ContractAddress,
          CodeName
        })
      } else {
        yield call(TransactionsDB.save, {
          ...payload,
          updateTime: new Date()
        })
      }
      yield put(createAction('getSent')())
      yield put(createAction('getRejected')())
      yield put(createAction('getDeployed')())
    },
    *getDeployed(_, { call, put }) {
      const deployedContracts = yield call(TransactionsDB.getDeployedContracts)
      yield put(createAction('updateState')({ deployedContracts }))
    },
    *getSent(_, { call, put }) {
      const sentContracts = yield call(TransactionsDB.getSentContracts)

      yield put(createAction('updateState')({ sentContracts }))
    },
    *getRejected(_, { call, put }) {
      const rejectedContracts = yield call(TransactionsDB.getRejectedContracts)
      yield put(createAction('updateState')({ rejectedContracts }))
    },
    *openDrawer({ payload }, { put }) {
      yield put(
        createAction('updateState')({
          drawerOpen: true,
          sent: undefined,
          signStart: true,
          signFinished: false
        })
      )
      if (payload) {
        yield put(createAction('selectContract')(payload))
      }
    },
    *hideDrawer(_, { put }) {
      yield put(
        createAction('updateState')({
          address: '',
          balance: '0',
          nonce: 0,
          password: '',
          isEncrypted: false,
          drawerOpen: false,
          callDrawerOpen: false,
          selectedContract: undefined,
          params: [],
          paramsValues: [],
          loadingABI: false,
          initFormValidateStatus: false,
          accountFormValidateStatus: false,
          currentStep: 1,
          gasLimit: '',
          gasPrice: '',
          ammout: '',
          confirmLoading: false,
          signingLoading: false,
          sent: undefined,
          signStart: false,
          signFinished: false,
          confirmStatus: {
            status: undefined,
            gas: undefined
          }
        })
      )
    },
    *openCallDrawer({ payload }, { put }) {
      yield put(
        createAction('updateState')({
          callDrawerOpen: true,
          sent: undefined,
          callStart: true,
          callFinished: false
        })
      )
      if (payload) {
        yield put(createAction('selectContract')(payload))
      }
    },
    *hideCallDrawer(_, { put }) {
      yield put(
        createAction('updateState')({
          address: '',
          balance: '0',
          nonce: 0,
          password: '',
          isEncrypted: false,
          drawerOpen: false,
          callDrawerOpen: false,
          selectedCallContract: undefined,
          selectedTransition: undefined,
          params: [],
          paramsValues: [],
          transitions: [],
          transitionParams: [],
          loadingABI: false,
          transitionFormValidateStatus: false,
          accountFormValidateStatus: false,
          currentStep: 1,
          gasLimit: '',
          gasPrice: '',
          ammout: '',
          confirmStatus: {
            status: undefined,
            gas: undefined
          },
          callLoading: false,
          callStart: false,
          callFinished: false
        })
      )
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'getSent' })
      dispatch({ type: 'getDeployed' })
      dispatch({ type: 'getRejected' })
    }
  }
}
