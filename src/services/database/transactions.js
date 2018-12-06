import Dexie from 'dexie'

class TransactionsDB extends Dexie {
  // contracts = []

  constructor(databaseName) {
    super(databaseName)
    this.version(1).stores({
      transactions: 'TranID,ContractAddress,CodeId'
    })
    this.opened = this.init()
  }
  init = async () => {
    const opening = await this.open()
    return opening.isOpen()
  }
  save = async data => {
    delete data.signer
    delete data.on
    delete data.messenger
    delete data.transaction
    delete data.contract

    if (this.opened) {
      const isExist = await this.getId(data.TranID)
      const result = !isExist
        ? await this.transactions.add(data)
        : await this.transactions.put(data)
      return result
    }
  }
  remove = async data => {
    if (this.opened) {
      const isExist = await this.getId(data.TranID)
      const result = !isExist
        ? false
        : await this.transactions.delete(data.TranID)
      return result
    }
  }
  getAll = async () => {
    if (this.opened) {
      const result = await this.transactions.toArray()
      return result
    }
  }
  getDeployedContracts = async () => {
    if (this.opened) {
      const result = await this.transactions

        .filter(d => d.status === 'deployed' && d.ContractAddress !== undefined)
        .toArray()
      // .sort((x, y) => y.updateTime - x.updateTime)
      return result
    }
  }
  getSentContracts = async () => {
    if (this.opened) {
      const result = await this.transactions

        .filter(d => d.status === 'sent' && d.ContractAddress !== undefined)
        .toArray()
      // .sort((x, y) => x.updateTime > y.updateTime)
      return result
    }
  }
  getRejectedContracts = async () => {
    if (this.opened) {
      const result = await this.transactions
        .filter(d => d.status === 'rejected' && d.ContractAddress !== undefined)
        .toArray()
      return result
    }
  }
  getId = async id => {
    if (this.opened) {
      const result = await this.transactions.get(id)
      return result
    }
  }
  getContractById = async id => {
    if (this.opened) {
      const result = await this.transactions
        .where('ContractAddress')
        .equalsIgnoreCase(id)
        .toArray()
      return result
    }
  }
}

export default TransactionsDB
