import { uuid } from 'laksa-extend-keystore'
import { randomBytes } from 'laksa-core-crypto'
import { createAction, storage } from '../utils'
import ContractsDB from '../services/database/contracts'
const db = new ContractsDB('@@laksaCode@@')

export default {
  namespace: 'contracts',
  state: {
    localCode: [],
    checkedCode: [],
    CodeEditorVisible: false,
    CodeEditorCode: '',
    CodeEditorChange: null,
    CodeCheckStatus: null,
    CodeMeta: {
      CodeName: '',
      CodeId: ''
    },
    CodeFooter: false
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *openCode({ payload }, { put, call }) {
      let CodeEditorCode = ''
      let CodeName = ''
      let CodeId = ''

      if (payload.CodeId) {
        const savedCode = yield call(db.getId, payload.CodeId)
        if (savedCode) {
          CodeEditorCode = savedCode.code
          CodeId = savedCode.CodeId
          CodeName = savedCode.CodeName
          // CodeCheckStatus = savedCode.CodeCheckStatus
        } else {
          CodeEditorCode = payload.code
          CodeId = payload.CodeId
          CodeName = payload.CodeName
          // CodeCheckStatus = payload.CodeCheckStatus
        }
      } else {
        CodeEditorCode = payload.code
      }
      yield put(
        createAction('updateState')({
          CodeEditorVisible: true,
          CodeEditorCode,
          CodeFooter: payload.footer,
          CodeCheckStatus: null,
          CodeMeta: {
            CodeName,
            CodeId
          }
        })
      )
    },
    *saveCodeMeta({ payload }, { put }) {
      yield put(createAction('updateState')({ CodeMeta: payload }))
    },
    *saveCode({ payload }, { put, call, select }) {
      const CodeMeta = yield select(state => state.contracts.CodeMeta)
      const code = yield select(state => state.contracts.CodeEditorCode)
      const CodeCheckStatus = yield select(
        state => state.contracts.CodeCheckStatus
      ) || (payload ? payload.CodeCheckStatus : null)

      let { CodeId } = CodeMeta
      if (CodeId === '') {
        CodeId = uuid.v4({ random: randomBytes(16) })
      }
      try {
        yield call(db.save, { code, ...CodeMeta, CodeId, CodeCheckStatus })
        yield put(createAction('loadLocalCode')())
      } catch (e) {}

      yield put(createAction('hideCode')())
    },
    *removeCodeDB({ payload }, { call, put, select }) {
      yield call(db.remove, payload)
      yield put(createAction('loadLocalCode')())
    },
    *loadLocalCode(_, { call, put, select }) {
      const localCode = yield call(db.getAll) || []
      yield put(createAction('updateState')({ localCode }))
    },
    *checkCode({ payload }, { put, call, select }) {
      const laksa = yield select(state => state.laksa.laksa)
      const code = payload
        ? payload.code
        : yield select(state => state.contracts.CodeEditorCode)
      try {
        const contractResult = yield call(
          laksa.messenger.sendServer,
          '/contract/check',
          {
            code: code
          }
        )
        const checkStatus = contractResult.result === 'success' ? true : false
        if (!payload) {
          yield put(
            createAction('updateState')({
              CodeCheckStatus: checkStatus
            })
          )
        } else {
          yield call(db.save, {
            ...payload,
            CodeCheckStatus: checkStatus
          })
          yield put(createAction('loadLocalCode')())
        }
      } catch (e) {}
    },
    *getChecked(_, { put, call }) {
      const checkedCode = yield call(db.getChecked)
      yield put(createAction('updateState')({ checkedCode }))
    },
    *changeCode({ payload }, { put, call, select }) {
      const { code } = payload
      // console.log(code)
      yield put(
        createAction('updateState')({
          CodeEditorCode: code
        })
      )
    },
    *hideCode(_, { put }) {
      yield put(
        createAction('updateState')({
          CodeEditorVisible: false,
          CodeEditorCode: '',
          CodeFooter: false,
          CodeCheckStatus: null
        })
      )
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'loadLocalCode' })
      dispatch({ type: 'getChecked' })
    }
  }
}
