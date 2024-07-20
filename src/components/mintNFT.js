import * as React from 'react'

import { 
  BaseError,
  useAccount, 
  useWriteContract ,
  useWaitForTransactionReceipt
} from 'wagmi'
import { saftMint } from '../contract/saftMint'
import { wagmiConfig } from '../walletConfig'
import { parseEther } from 'viem'
import { getAccount } from '@wagmi/core'
export default function MintNFT() {
    const { 
      data: hash, 
      error,
      isPending,
      writeContract 
    } = useWriteContract(wagmiConfig) 

    const {address, isConnected } = useAccount()
    const { connector } = getAccount(wagmiConfig)
    
    async function submit(e) {
      e.preventDefault()
      const formData = new FormData(e.target )
      const tokenId = formData.get('tokenId')
      writeContract({
          account: address,
          address: '0x8ced7c44a1c3a86a4f0f9481789ea4a20a88fe76',
          abi: saftMint,
          functionName: 'safeMint',
          args: [address, "https://quicknode.quicknode-ipfs.com/ipfs/QmaJw5EZ6cDz3LwifiHKDQEK3bkpdr9XJJQCUj6crVKNSE"],
          chainId: 365,
          connector,
          value: parseEther('6'), 
      })
    }
    
    /*
    const { config } = usePrepareContractWrite({
      address: "Your Contract Address",
      abi: [
        {
          name: "mint",
          type: "function",
          stateMutability: "payable",
          inputs: [],
          outputs: [],
        },
      ],
      functionName: "mint",
      overrides: {
        from: "Your Walllet Address",
        value: ethers.utils.parseEther("0.000000001"), //the integer value should match your nft minting requirements
      },
    });
    */

    // Use the useWaitForTransaction hook to wait for the transaction to be mined and return loading and success states
    const { isLoading: isLoading, isSuccess: isSuccess } = useWaitForTransactionReceipt({
      hash
    });

    return (
        <div>
        <button 
          onClick={submit}
          disabled={isPending}
          type="submit"
        >
          {isPending ? 'Confirming...' : 'Mint'}
        </button>
        {hash && <div>Transaction Hash: {hash}</div>}
        {isLoading && <div>Waiting for confirmation...</div>}
        {isSuccess && <div>Transaction confirmed.</div>}
        {error && (
        <div>Error: {(error).shortMessage || error.message}</div>
        )}
        </div>
    )
    /*
    return (
      <div>
        <button
          disabled={!write || isLoading}
          onClick={() => write?.()}
        >
          {isLoading ? "Minting..." : "Mint"}
        </button>
        {isSuccess && (
          <div>
            Successfully minted your NFT!
            <div>
              <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
            </div>
          </div>
        )}
      </div>
    );
          */
}