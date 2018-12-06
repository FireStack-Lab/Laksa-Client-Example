import Laksa from 'laksa'
import { createAction, storage } from '../utils'

const DEFAULT_NODE = 'https://api-scilla.zilliqa.com'
const DEFAULT_SCILLA = 'https://scilla-runner.zilliqa.com'

const laksa = new Laksa()
const provider = new laksa.Modules.HttpProvider(DEFAULT_NODE)
const scillaProvider = new laksa.Modules.HttpProvider(DEFAULT_SCILLA)
laksa.setNodeProvider(provider)
laksa.setScillaProvider(scillaProvider)

export default {
  namespace: 'laksa',
  state: {
    laksa,
    connection: false,
    scillaConnection: false,
    provider: { TestNet: provider.url },
    scillaProvider: { ScillaTestNet: scillaProvider.url },
    testProvider: { TestNet: provider.url },
    testScillaProvider: { ScillaTestNet: scillaProvider.url },
    providerList: [
      { TestNet: provider.url },
      { ScillaTestNet: scillaProvider.url }
    ],
    drawerVisible: false,
    WalletSignVisible: false
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *setDefaultProvider(_, { put }) {
      const LocalProvider = storage.readObject('provider')
      const LocalScillaProvider = storage.readObject('scillaProvider')
      if (LocalProvider || LocalScillaProvider) {
        yield put(
          createAction('setProvider')({
            name: Object.keys(LocalProvider)[0],
            url: Object.values(LocalProvider)[0]
          })
        )
        yield put(
          createAction('setScillaProvider')({
            name: Object.keys(LocalScillaProvider)[0],
            url: Object.values(LocalScillaProvider)[0]
          })
        )
      } else {
        yield put(
          createAction('setProvider')({
            name: 'TestNet',
            url: DEFAULT_NODE
          })
        )
        yield put(
          createAction('setScillaProvider')({
            name: 'ScillaTestNet',
            url: DEFAULT_SCILLA
          })
        )
      }
    },
    *setProvider(
      {
        payload: { url, name }
      },
      { put, call, select }
    ) {
      const newProvider = new laksa.Modules.HttpProvider(url)
      laksa.setNodeProvider(newProvider)
      const newProviderObject = {}
      newProviderObject[name] = newProvider.url
      storage.writeObject('provider', newProviderObject)
      yield put(
        createAction('updateState')({
          provider: newProviderObject
        })
      )
    },
    *setScillaProvider(
      {
        payload: { url, name }
      },
      { put, call, select }
    ) {
      const newProvider = new laksa.Modules.HttpProvider(url)
      laksa.setScillaProvider(newProvider)
      const newProviderObject = {}
      newProviderObject[name] = newProvider.url
      storage.writeObject('scillaProvider', newProviderObject)
      yield put(
        createAction('updateState')({
          scillaProvider: newProviderObject
        })
      )
    },
    *addProvider(
      {
        payload: { url, name }
      },
      { put, select }
    ) {
      const providerObject = {}
      providerObject[name] = url
      const providerList = yield select(state => state.laksa.providerList)

      if (
        providerList.find(
          d => Object.keys(d)[0] === Object.keys(providerObject)[0]
        ) === undefined
      ) {
        providerList.push(providerObject)
      }
      yield put(
        createAction('updateState')({
          providerList
        })
      )
    },
    *openDrawer(_, { put }) {
      yield put(
        createAction('updateState')({
          drawerVisible: true
        })
      )
    },
    *hideDrawer(_, { put }) {
      yield put(
        createAction('updateState')({
          drawerVisible: false
        })
      )
    },
    *openWalletSign(_, { put }) {
      yield put(
        createAction('updateState')({
          WalletSignVisible: true
        })
      )
    },
    *hideWalletSign(_, { put }) {
      yield put(
        createAction('updateState')({
          WalletSignVisible: false
        })
      )
    },

    *testConnection({ payload }, { call, put, select }) {
      const currentProvider = yield select(state => state.laksa.testProvider)
      let providerUrl = payload
        ? payload.url
        : Object.values(currentProvider)[0]
      let providerName = payload
        ? payload.name
        : Object.keys(currentProvider)[0]
      const newProviderObject = {}
      newProviderObject[providerName] = providerUrl

      try {
        const newProvider = new laksa.Modules.HttpProvider(providerUrl)
        const newMessenger = new laksa.Modules.Messenger(newProvider)
        const connection = yield call(newMessenger.send, 'GetNetworkId', [])
        if (typeof connection === 'string') {
          yield put(
            createAction('updateState')({
              connection: true,
              testProvider: newProviderObject
            })
          )
        }
      } catch (error) {
        yield put(
          createAction('updateState')({
            connection: false,
            testProvider: newProviderObject
          })
        )
      }
    },
    *testScillaConnection({ payload }, { call, put, select }) {
      const currentProvider = yield select(
        state => state.laksa.testScillaProvider
      )
      let providerUrl = payload
        ? payload.url
        : Object.values(currentProvider)[0]
      let providerName = payload
        ? payload.name
        : Object.keys(currentProvider)[0]
      const newProviderObject = {}
      newProviderObject[providerName] = providerUrl

      try {
        const code = `
        contract TestScilla
        (owner: ByStr20)
        `
        const newProvider = new laksa.Modules.HttpProvider(providerUrl)
        const newMessenger = new laksa.Modules.Messenger(newProvider)
        const connection = yield call(
          newMessenger.sendServer,
          '/contract/check',
          { code }
        )
        if (connection.result === 'success') {
          yield put(
            createAction('updateState')({
              scillaConnection: true,
              testScillaProvider: newProviderObject
            })
          )
        } else {
          yield put(
            createAction('updateState')({
              scillaConnection: false,
              testScillaProvider: newProviderObject
            })
          )
        }
      } catch (error) {
        yield put(
          createAction('updateState')({
            scillaConnection: false,
            testScillaProvider: newProviderObject
          })
        )
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'setDefaultProvider' })
      dispatch({ type: 'testConnection' })
      dispatch({ type: 'testScillaConnection' })
      dispatch({ type: 'loadLocalCode' })
      // dispatch({ type: 'openWalletSign' })
      // dispatch({ type: 'openCode', payload: { code: '' } })
    }
  }
}
