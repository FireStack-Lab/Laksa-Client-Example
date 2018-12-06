import { createAction } from '../../../utils'
export default {
  namespace: 'account',
  state: {
    balance: '0',
    nonce: 0
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *getBalance({ payload }, { put, call, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      const result = yield call(laksa.zil.getBalance, payload)
      yield put(createAction('updateState')({ ...result }))
    }
  },
  subscriptions: {}
}
