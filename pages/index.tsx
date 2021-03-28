import Account from '../components/Account'
import Layout from '../components/Layout'
import Web3 from 'web3'
import tokenABI from '../lib/tokenABI'
import { useState } from 'react'

const tokenAddresses = [{
  address: '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39',
  token: 'HEX'
}, {
  address: '0x3d658390460295fb963f54dc0899cfb1c30776df',
  token: 'COVAL'
}, {
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  token: 'DAI'
}]


const IndexPage = () => {
  const [accounts, setAccounts] = useState<AccountType[]>([])
  const [web3Enabled, setWeb3Enabled] = useState(false)

  // Empty web3 instance
  let web3: Web3 = new Web3()

  const ethEnabled = async () => {

    if (typeof window.ethereum !== 'undefined') {
      // Instance web3 with the provided information from the MetaMask provider information
      web3 = new Web3(window.ethereum);
      try {
        // Request account access
        await window.ethereum.enable();

        return true
      } catch (e) {
        // User denied access
        return false
      }

    }

    return false;
  }


  const onClickConnect = async () => {
    if (await !ethEnabled()) {
      alert("Please install MetaMask to use this dApp!");
    }

    setWeb3Enabled(true)

    var accs = await web3.eth.getAccounts();


    const newAccounts = await Promise.all(accs.map(async (address: string) => {
      const balance = await web3.eth.getBalance(address)

      const tokenBalances = await Promise.all(tokenAddresses.map(async (token) => {

        const tokenInst = new web3.eth.Contract(tokenABI, token.address);

        const balance = await tokenInst.methods.balanceOf(address).call()

        return {
          token: token.token,
          balance
        }
      }))

      return {
        address,
        balance: web3.utils.fromWei(balance, 'ether'),
        tokens: tokenBalances
      }
    }))

    setAccounts(newAccounts)

  }


  return (
    <Layout title="Web3.js example">
      <h1>Hello Web3.js 👋</h1>

      <div className="actions">
        {!web3Enabled && <button onClick={onClickConnect}>Connect</button>}
      </div>


      {accounts && accounts.length > 0 && <div className="accounts">
        {accounts.map((account) => {
          return (
            <div className="account" key={account.address}>
              <Account account={account} />
            </div>
          )
        })}
      </div>}

      <style jsx global>
        {
          `
          body {
            padding: 0;
            margin: 0;
          }
          `
        }
      </style>
      <style jsx>{
        `
        h1 {
          text-align: center;
        }

        .actions {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        button {
          background: black; 
          color: white;
          border: none;
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
        }

        .account {
          margin: 15px;
        }
        `
      }</style>

    </Layout>
  )
}

export default IndexPage
