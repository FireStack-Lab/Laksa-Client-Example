# Simple example using Laksa to access to Zilliqa's Blockchain

**DO NOT USE IT AS PRODUCTION**

## Abount this example

We just demostrate how to use (`Laksa`)[https://github.com/FireStack-Lab/Laksa] to build a fully front-end app as client-side and have all the abillities to access Zilliqa's blockchain.


## system requirement

1. node.js (v10.0.0+)
   
```bash
node -v //check your node.js version
```

2. latest npm or yarn (**Recommended**)

```bash
npm i -g yarn
```
3. google chrome(firefox is not tested yet)

## install && run

1. git clone
```bash
git clone git@github.com:FireStack-Lab/Laksa-Client-Example.git && cd Laksa-Client-Example
```

2. yarn install

```bash
yarn install 
```

3. run
   
```bash
yarn start
```

4. open browser and access `http://localhost:8000`

## Main Feature
### Home
1. Check connection to Zilliqa's TestNet and Scilla runner(remote)
2. You can add provider of your own(if you have full-node or scilla-runner runing, `http` only, **NOT WebSocket**)

### Explorer
1. You can see recent Transactions/TxBlocks/DsBlocks
2. You can search Transaction/Address/TxBlock/DsBlock

### Wallet
1. Create Account and encrpyt with password(**Not Safe**)
2. Import PrivateKey
3. See Balance
4. Set Default Signer(Demostration only)

### Contract
1. Save your scilla code to contract raw code
2. Deploy with your account and set up Contract ABIs and Transaction Parameters
3. Call Contract(if deployed)
   
### Transfer
1. Transfer some token to desired address
2. Nothing More...

## Tools building this example
1. [Laksa, Zilliqa's 3rd party javascript library](https://github.com/FireStack-Lab/Laksa)
2. [Umi.js, Pluggable enterprise-level react application framework.](https://umijs.org/)
3. [Dva.js, React and redux based, lightweight and elm-style framework.](https://dvajs.com/)
4. [antd, A design system with values of Nature and Determinacy for better user experience of enterprise application](https://ant.design)

## Zilliqa's Blockchain
1. [Zilliqa](https://github.com/Zilliqa/zilliqa)
2. [@Zilliqa-js](https://github.com/Zilliqa/Zilliqa-Javascript-Library)

