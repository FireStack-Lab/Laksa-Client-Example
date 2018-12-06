import router from 'umi/router'
import { createAction } from '../../../utils'

export default {
  namespace: 'explorer',
  state: {
    searchCat: 'address',
    searchValidate: false,
    dsBlockListing: { data: [], maxPages: undefined, current: undefined },
    txBlockListing: { data: [], maxPages: undefined, current: undefined },
    transactionListing: {
      TxnHashes: [],
      number: undefined,
      current: undefined
    },
    accountInfo: {
      loading: false,
      address: undefined,
      balance: undefined,
      nonce: undefined,
      loadingContracts: false,
      contracts: []
    },
    dsBlockInfo: {
      loading: false,
      header: {
        blockNum: undefined,
        difficulty: undefined,
        leaderPubKey: undefined,
        prevhash: undefined,
        timestamp: undefined
      },
      signature: undefined
    },
    txBlockInfo: {
      loading: false,
      body: {
        HeaderSign: undefined,
        MicroBlockEmpty: undefined,
        MicroBlockHashes: undefined
      },
      header: {
        BlockNum: undefined,
        DSBlockNum: undefined,
        GasLimit: undefined,
        GasUsed: undefined,
        MinerPubKey: undefined,
        NumMicroBlocks: undefined,
        NumTxns: undefined,
        Rewards: undefined,
        StateHash: undefined,
        Timestamp: undefined,
        TxnHash: undefined,
        prevBlockHash: undefined,
        type: undefined,
        version: undefined
      }
    },
    transactionInfo: {
      loading: false,
      ID: undefined,
      amount: undefined,
      nonce: undefined,
      receipt: {
        cumulative_gas: undefined,
        success: undefined
      },
      senderPubKey: undefined,
      signature: undefined,
      toAddr: undefined,
      fromAddr: undefined,
      version: undefined
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *setSearchCat({ payload }, { put }) {
      yield put(createAction('updateState')({ searchCat: payload }))
      yield put(createAction('updateState')({ searchValidate: false }))
    },
    *searchOn({ payload }, { put }) {
      const { searchCat, value } = payload
      switch (searchCat) {
        case 'address':
          yield put(createAction('searchAddress')({ address: value }))
          break
        case 'dsBlock':
          yield put(createAction('searchDSBlock')({ blockNumber: value }))
          break
        case 'txBlock':
          yield put(createAction('searchTXBlock')({ blockNumber: value }))
          break
        case 'transaction':
          yield put(createAction('searchTransaction')({ txHash: value }))
          break
        default:
          break
      }
    },
    *validateOn({ payload }, { put, select }) {
      const { searchCat, value } = payload
      const laksa = yield select(state => state.laksa.laksa)
      switch (searchCat) {
        case 'address':
          if (laksa.util.isAddress(value)) {
            yield put(createAction('updateState')({ searchValidate: true }))
          } else {
            yield put(createAction('updateState')({ searchValidate: false }))
          }
          break
        case 'dsBlock':
          if (laksa.util.isInt(Number(value, 10))) {
            yield put(createAction('updateState')({ searchValidate: true }))
          } else {
            yield put(createAction('updateState')({ searchValidate: false }))
          }
          break
        case 'txBlock':
          if (laksa.util.isInt(Number(value, 10))) {
            yield put(createAction('updateState')({ searchValidate: true }))
          } else {
            yield put(createAction('updateState')({ searchValidate: false }))
          }
          break
        case 'transaction':
          if (laksa.util.isHash(value)) {
            yield put(createAction('updateState')({ searchValidate: true }))
          } else {
            yield put(createAction('updateState')({ searchValidate: false }))
          }
          break
        default:
          break
      }
    },
    *searchAddress({ payload }, { put, call, select }) {
      const { address } = payload
      router.push(`/explorer/account/${address}`)
      const laksa = yield select(state => state.laksa.laksa)
      // const accountInfoState = yield select(state => state.explorer.accountInfo)
      const accountInfoState = {
        loading: false,
        address: undefined,
        balance: undefined,
        nonce: undefined,
        loadingContracts: false,
        contracts: []
      }
      yield put(
        createAction('updateState')({
          accountInfo: { ...accountInfoState, loading: true }
        })
      )
      const accountInfo = yield call(laksa.zil.getBalance, { address })

      yield put(createAction('updateState')({ searchValidate: false }))
      yield put(
        createAction('updateState')({
          accountInfo: {
            address,
            loading: false,
            ...accountInfo,
            contracts: []
          }
        })
      )
      yield put(createAction('getContractsFromAccountAddress')({ address }))
    },
    *getContractsFromAccountAddress({ payload }, { call, put, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      const accountInfo = yield select(state => state.explorer.accountInfo)
      yield put(
        createAction('updateState')({
          accountInfo: {
            ...accountInfo,
            loadingContracts: true
          }
        })
      )
      const contractsArray = yield call(laksa.zil.getSmartContracts, {
        address: payload.address
      })

      if (laksa.util.isArray(contractsArray)) {
        for (let i in contractsArray) {
          const init = yield call(laksa.zil.getSmartContractInit, {
            address: contractsArray[i].address
          })
          const { code } = yield call(laksa.zil.getSmartContractCode, {
            address: contractsArray[i].address
          })

          Object.assign(contractsArray[i], { init, code })
        }
      }

      yield put(
        createAction('updateState')({
          accountInfo: {
            ...accountInfo,
            contracts: contractsArray || [],
            loadingContracts: false
          }
        })
      )
    },
    *searchDSBlock({ payload }, { put, call, select }) {
      const { blockNumber } = payload
      router.push(`/explorer/dsBlock/${blockNumber}`)
      const laksa = yield select(state => state.laksa.laksa)
      // const dsBlockInfoState = yield select(state => state.explorer.dsBlockInfo)
      const dsBlockInfoState = {
        loading: false,
        header: {
          blockNum: undefined,
          difficulty: undefined,
          leaderPubKey: undefined,
          prevhash: undefined,
          timestamp: undefined
        },
        signature: undefined
      }
      yield put(
        createAction('updateState')({
          dsBlockInfo: { ...dsBlockInfoState, loading: true }
        })
      )
      const dsBlockInfo = yield call(laksa.zil.getDsBlock, { blockNumber })

      yield put(createAction('updateState')({ searchValidate: false }))
      // console.log(dsBlockInfo)
      yield put(
        createAction('updateState')({
          dsBlockInfo: { loading: false, blockNumber, ...dsBlockInfo }
        })
      )
    },
    *searchTXBlock({ payload }, { put, call, select }) {
      const { blockNumber } = payload
      router.push(`/explorer/txBlock/${blockNumber}`)
      const laksa = yield select(state => state.laksa.laksa)
      // const txBlockInfoState = yield select(state => state.explorer.txBlockInfo)
      const txBlockInfoState = {
        loading: false,
        body: {
          HeaderSign: undefined,
          MicroBlockEmpty: undefined,
          MicroBlockHashes: undefined
        },
        header: {
          BlockNum: undefined,
          DSBlockNum: undefined,
          GasLimit: undefined,
          GasUsed: undefined,
          MinerPubKey: undefined,
          NumMicroBlocks: undefined,
          NumTxns: undefined,
          Rewards: undefined,
          StateHash: undefined,
          Timestamp: undefined,
          TxnHash: undefined,
          prevBlockHash: undefined,
          type: undefined,
          version: undefined
        }
      }
      yield put(
        createAction('updateState')({
          txBlockInfo: { ...txBlockInfoState, loading: true }
        })
      )
      const txBlockInfo = yield call(laksa.zil.getTxBlock, { blockNumber })
      // console.log(txBlockInfo)

      yield put(createAction('updateState')({ searchValidate: false }))
      yield put(
        createAction('updateState')({
          txBlockInfo: {
            blockNumber,
            loading: false,
            ...txBlockInfo
          }
        })
      )
    },
    *searchTransaction({ payload }, { put, call, select }) {
      const { txHash } = payload
      router.push(`/explorer/transaction/${txHash}`)
      const laksa = yield select(state => state.laksa.laksa)
      // const txInfoState = yield select(state => state.explorer.transactionInfo)
      const txInfoState = {
        loading: false,
        ID: undefined,
        amount: undefined,
        nonce: undefined,
        receipt: {
          cumulative_gas: undefined,
          success: undefined
        },
        senderPubKey: undefined,
        signature: undefined,
        toAddr: undefined,
        fromAddr: undefined,
        version: undefined
      }
      yield put(
        createAction('updateState')({
          transactionInfo: { ...txInfoState, loading: true }
        })
      )
      const txnInfo = yield call(laksa.zil.getTransaction, { txHash })

      if (!txnInfo.error) {
        yield put(
          createAction('updateState')({
            transactionInfo: {
              txHash,
              loading: false,
              ...txnInfo,
              fromAddr: laksa.util.getAddressFromPublicKey(
                laksa.util.strip0x(txnInfo.senderPubKey)
              )
            }
          })
        )
      } else {
        yield put(
          createAction('updateState')({
            transactionInfo: {
              ...txInfoState,
              loading: false
            }
          })
        )
      }
    },
    *getLatestDsBlocks({ payload }, { call, put, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      try {
        const dsBlockListing = yield call(laksa.zil.getDSBlockListing, payload)
        // console.log(dsBlockListing)
        yield put(
          createAction('updateState')({
            dsBlockListing: { ...dsBlockListing, current: payload.page }
          })
        )
      } catch (error) {}
    },
    *getLatestTxBlocks({ payload }, { call, put, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      try {
        const txBlockListing = yield call(laksa.zil.getTxBlockListing, payload)
        // console.log(txBlockListing)

        yield put(
          createAction('updateState')({
            txBlockListing: { ...txBlockListing, current: payload.page }
          })
        )
      } catch (error) {}
    },
    *getLatestTransactions({ payload }, { call, put, select }) {
      if (!payload.page) {
        const laksa = yield select(state => state.laksa.laksa)
        try {
          const transactionListing = yield call(
            laksa.zil.getRecentTransactions,
            payload
          )
          // console.log(transactionListing)
          yield put(
            createAction('updateState')({
              transactionListing: { ...transactionListing, current: 1 }
            })
          )
        } catch (error) {}
      } else {
        const transactionListing = yield select(
          state => state.explorer.transactionListing
        )
        yield put(
          createAction('updateState')({
            transactionListing: { ...transactionListing, current: payload.page }
          })
        )
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'getLatestDsBlocks', payload: { page: 1 } })
      dispatch({ type: 'getLatestTxBlocks', payload: { page: 1 } })
      dispatch({ type: 'getLatestTransactions', payload: {} })

      const pathname = history.location.pathname
      if (!!pathname.match('/explorer/account/')) {
        dispatch({
          type: 'searchOn',
          payload: { searchCat: 'address', value: pathname.substring(18, 58) }
        })
      } else if (!!pathname.match('/explorer/dsBlock/')) {
        dispatch({
          type: 'searchOn',
          payload: { searchCat: 'dsBlock', value: pathname.substring(18) }
        })
      } else if (!!pathname.match('/explorer/txBlock/')) {
        dispatch({
          type: 'searchOn',
          payload: { searchCat: 'txBlock', value: pathname.substring(18) }
        })
      } else if (!!pathname.match('/explorer/transaction/')) {
        dispatch({
          type: 'searchOn',
          payload: { searchCat: 'transaction', value: pathname.substring(22) }
        })
      }
    }
  }
}
