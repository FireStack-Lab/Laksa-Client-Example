import Dexie from 'dexie'

const metaDate = (target, key, descriptor) => {
  const original = descriptor.value
  function interceptor(args) {
    const result = { ...args, updatedTime: new Date() }
    return original.call(this, result)
  }
  descriptor.value = interceptor
  return descriptor
}

class ContractsDB extends Dexie {
  // contracts = []

  constructor(databaseName) {
    super(databaseName)
    this.version(1).stores({
      contracts: 'CodeId,CodeName,code'
    })
    this.opened = this.init()
  }
  init = async () => {
    const opening = await this.open()
    return opening.isOpen()
  }
  @metaDate
  save = async data => {
    if (this.opened) {
      const isExist = await this.getId(data.CodeId)
      const result = !isExist
        ? await this.contracts.add(data)
        : await this.contracts.put(data)
      return result
    }
  }
  remove = async data => {
    if (this.opened) {
      const isExist = await this.getId(data.CodeId)
      const result = !isExist ? false : await this.contracts.delete(data.CodeId)
      return result
    }
  }
  getAll = async () => {
    if (this.opened) {
      const result = await this.contracts.toArray()
      return result
    }
  }
  getChecked = async () => {
    if (this.opened) {
      const result = await this.contracts
        .filter(d => d.CodeCheckStatus)
        .toArray()
      return result
    }
  }
  getId = async id => {
    if (this.opened) {
      const result = await this.contracts.get(id)
      return result
    }
  }
}

export default ContractsDB
