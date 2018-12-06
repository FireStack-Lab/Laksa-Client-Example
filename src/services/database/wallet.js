import Dexie from 'dexie'

class WalletDB extends Dexie {
  // contracts = []

  constructor(databaseName) {
    super(databaseName)
    this.version(1).stores({
      wallet: 'address',
      signer: 'address'
    })
    this.opened = this.init()
  }
  init = async () => {
    const opening = await this.open()
    return opening.isOpen()
  }
  save = async data => {
    delete data.messenger
    delete data.getBalance
    delete data.encrypt
    delete data.decrypt
    delete data.sign
    delete data.signTransaction
    delete data.signTransactionWithPassword
    delete data.toFile
    delete data.fromFile

    if (this.opened) {
      const isExist = await this.getId(data.address)
      const result = !isExist
        ? await this.wallet.add(data)
        : await this.wallet.put(data)
      return result
    }
  }
  remove = async data => {
    if (this.opened) {
      const isExist = await this.getId(data.address)
      const result = !isExist ? false : await this.wallet.delete(data.address)
      return result
    }
  }
  getAll = async () => {
    if (this.opened) {
      const result = await this.wallet.toArray()
      return result
    }
  }
  getId = async id => {
    if (this.opened) {
      const result = await this.wallet.get(id)
      return result
    }
  }
  setSigner = async data => {
    if (this.opened) {
      await this.signer.clear()
      const result = await this.signer.put(data)
      return result
    }
  }
  getSigner = async () => {
    if (this.opened) {
      const result = await this.signer.toArray()
      return result
    }
  }
}

export default WalletDB
