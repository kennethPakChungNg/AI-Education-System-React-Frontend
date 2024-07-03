import React from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

function ConnectWallet() {
  const { open } = useWeb3Modal()
  const { isConnected, address } = useAccount()

  if (isConnected) {
    return <div>Connected: {address}</div>
  }

  return (
    <button onClick={() => open()}>Connect Wallet</button>
  )
}

export default ConnectWallet;