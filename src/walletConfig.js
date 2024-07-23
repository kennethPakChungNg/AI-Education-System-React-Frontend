import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { mainnet, arbitrum } from 'viem/chains'
import { frontEndBaseUrl } from './serverConfig'
// Replace with your Project ID
const projectId = '600c0d5395ccb48f16ff07f0357f3543'

const thetaTestnet = {
  id: 365,
  name: 'Theta Testnet',
  network: 'theta-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'TFUEL',
    symbol: 'TFUEL',
  },
  rpcUrls: {
    public: { http: ['https://eth-rpc-api-testnet.thetatoken.org/rpc'] },
    default: { http: ['https://eth-rpc-api-testnet.thetatoken.org/rpc'] },
  },
  blockExplorers: {
    default: { name: 'ThetaExplorer', url: 'https://testnet-explorer.thetatoken.org' },
  },
  testnet: true,
}

const metadata = {
  name: 'Theta Learning Platform',
  description: 'Learn and earn on Theta network',
  url: frontEndBaseUrl, // replace with your website when deployed
  icons: ['../src/assets/images/Full-Logo.png'] // make sure this path is correct
}

const chains = [thetaTestnet, mainnet, arbitrum]

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

createWeb3Modal({ wagmiConfig, projectId, chains })

export { wagmiConfig, projectId, chains }