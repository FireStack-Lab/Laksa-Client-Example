// import Account from 'laksa-account'

export const updateBalance = async account => {
  const result = await account.updateBalance()
  return result
}
export const encryptAccount = async (wallet, address, password) => {
  const result = await wallet.encryptAccountByAddress(address, password)
  return result
}

export const updateAccount = async (wallet, address, newObject) => {
  const result = await wallet.updateAccountByAddress(address, newObject)
  return result
}

export const exportAccount = async (wallet, address, password) => {
  const account = wallet.getAccountByAddress(address)
  const result = await account.toFile(password)
  return result
}

export const importPrivateKey = async (wallet, privateKey) => {
  const result = await wallet.imporAccountFromPrivateKey(privateKey)
  return result
}

export const importKeyStore = async (wallet, keyStore, password) => {
  const importedAccount = await wallet.importAccountFromKeyStore(
    keyStore,
    password
  )
  return importedAccount.privateKey
}

export const decryptAccount = async (wallet, address, password) => {
  const result = await wallet.decryptAccountByAddress(address, password)
  return result
}

export const getAccountBalance = async (wallet, address) => {
  const result = await wallet.messenger.send('GetBalance', address)
  return result
}

export const getABI = async (contract, code) => {
  const result = await contract.decodeABI({ code })
  return result
}

export const createNewContract = (contracts, code, init) => {
  return contracts.new(code, init)
}

export const deployNewContract = async (
  contract,
  contractObject,
  accountObject
) => {
  const { gasLimit, gasPrice } = contractObject
  const { account, password } = accountObject
  const result = await contract.deploy({
    gasLimit,
    gasPrice,
    account,
    password
  })
  return result
}

export const signAndSend = async (contract, contractObject, accountObject) => {
  const { account, password } = accountObject
  const { gasLimit, gasPrice } = contractObject
  const result = await contract
    .setDeployPayload({ gasLimit, gasPrice })
    .sendContract({ account, password })

  return result
}

export const confirmContract = async contract => {
  const result = await contract.transaction.confirm(contract.transaction.TranID)
  return result
}

export const transactionConfirm = async transaction => {
  const result = await transaction.confirm(transaction.TranID)
  return result
}

export const zilConfirmContract = async (zil, txHash) => {
  const result = await zil.confirmTransaction({ txHash })
  return result
}

export const callContract = async (contract, callParams) => {
  const {
    transition,
    params,
    amount,
    gasLimit,
    gasPrice,
    account,
    password
  } = callParams
  const result = await contract
    .setCallPayload({
      transition,
      params,
      amount,
      gasLimit,
      gasPrice
    })
    .sendContract({ account, password })
  return result
}

export const signTransactionAndSend = async (
  account,
  password,
  transaction
) => {
  const signed = await account.signTransaction(transaction, password)
  const result = await signed.sendTransaction()
  return result
}
