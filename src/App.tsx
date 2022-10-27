/* eslint-disable */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from 'web3';

import "./App.css";
import { etherAddressShortener } from "./utils";
 
 
// your network address, for example for rinkeby network :
const networkAddress = 'https://polygon-mumbai.infura.io/v3/6f53cd0fea2c4e308f45ab26d13bc60f';
const provider = new Web3.providers.HttpProvider(networkAddress);
const web3 = new Web3(provider);

const App: React.FC = (props) => {
  
  const [errorMessage, setErrorMessage] = useState("");
  const [defaultAccount, setDefaultAccount] = useState("");
  const [newTokenAddress, setNewTokenAddress] = useState("");
  const [customTokenSymbol, setCustomTokenSymbol] = useState("");
  const [userBalance, setUserBalance] = useState<number|string>();
  const [privateKeyInputValue, setPrivateKeyInputValue] = useState("");
  const [showAddTokenModal, setShowAddTokenModal] = useState(false);

  const [customToken, setCustomToken] = useState<any>([
    {
      address:"",
      symbol:"",
      ownerAddress:""
    }
  ]);
 
  const connectwalletHandler = async () => {
    try{
      let wallet = await web3.eth.accounts.privateKeyToAccount(privateKeyInputValue);
      setDefaultAccount(wallet.address);
      getBalance(wallet.address);
      getCustomTokens(wallet.address);
    }catch(e){
      setErrorMessage("Private key must be 33 bytes long")
    }
  } 
  const getBalance = async (wallet:string) => {
    web3.eth.getBalance(wallet, function (error, wei) {
      if (!error) {
          let balance = web3.utils.fromWei(wei, 'ether');
          setUserBalance(balance);
      }
  });
  }

 

  const addCustomToken = async (address:string, symbol:string, ownerAddress:string) => {
    const newCustomToken = [...customToken, { address, symbol,ownerAddress }];
    setCustomToken(newCustomToken);
  }
  const removeCustomToken = (index:any) => {
    const newCustomToken = [...customToken];
    newCustomToken.splice(index, 1);
    setCustomToken(newCustomToken);
  };

  const getCustomTokens = async  (wallet:string) =>{
  // The minimum ABI required to get the ERC20 Token balance
  /*const minABI:any = [
    // balanceOf
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    },
  ];
  const tokenAddress = "0xd00981105e61274c8A5Cd5A88Fe7e037d935b513";
  const walletAddress = wallet;

  const contract = new web3.eth.Contract(minABI, tokenAddress);

    const result = await contract.methods.balanceOf(walletAddress).call(); // 29803630997051883414242659
    const format = web3.utils.fromWei(result); // 29803630.997051883414242659
    console.log(format)*/
}


  return (
    <div className="App">
      <header className="text-gray-600 body-font shadow shadow-cyan-900">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <span className="ml-3 text-xl text-color-green">Openedge</span>
          </a>
        </div>
      </header>
      
      {defaultAccount =="" &&
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-color-green">
               Ethereum Wallet
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-color-gray-tone">
              Enter you private key below to connect to wallet
            </p>
          </div>
          <div className="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end">
            <div className="relative flex-grow w-full">
              <label className="leading-7 text-sm text-color-gray-tone">
                Private Key
              </label>
              <input
                type="privateKey"
                id="privateKey"
                name="privateKey"
                className="w-full bg-gray-100 bg-opacity-50 rounded-3xl border border-gray-300 focus:border-indigo-500 focus:bg-opacity-100 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                onChange={(e) => setPrivateKeyInputValue(e.target.value)}
              />
            </div>
            <button onClick={connectwalletHandler} className="text-white bg-color-lime border-1 border-lime-300	 py-2 px-8 focus:outline-none hover:bg-white-500 rounded-3xl text-lg">
              Connect
            </button>
          </div>
        </div>
      </section>
      }
   
      {defaultAccount !=="" &&
    <>
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6 mx-auto">
        <div className="p-4 md:w-1/3 flex flex-col text-center items-center"></div>
          <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
            <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
              <img src="ethereum-icon.png"/>
            </div>
            <div className="flex-grow">
              <h2 className="text-gray-900 text-5xl title-font font-medium mb-3 text-color-green">{userBalance}</h2>
              <p className="leading text-base text-color-white">{etherAddressShortener(defaultAccount)}</p>
            </div>
          </div>
        <div className="p-4 md:w-1/3 flex flex-col text-center items-center"></div>
        </div>
        <button  onClick={() => setDefaultAccount("")} className="flex mx-auto mt-6 text-white bg-color-lime border-0 py-2 px-8 focus:outline-none hover:bg-gray-600 rounded-3xl text-lg">Sign Out</button>
      </div>
    </section>

    <section className="text-gray-600 body-font">
      <div className="container px-5 py-0 mb-20 mx-auto">
        <div className="lg:w-2/3 w-full mx-auto overflow-auto">
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Token</th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Balance</th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Action</th>
              </tr>
            </thead>
            <tbody>
            {customToken.filter((token:any) => token.ownerAddress === defaultAccount).map((token:any, index:any) => (
              <tr key={index}>
                <td className="border-t-2 border-green-100 px-4 py-3 text-color-white">{token.symbol}</td>
                <td className="border-t-2 border-green-100 px-4 py-3 text-color-white">0.2929292</td>
                <td className="border-t-2 border-green-100 px-4 py-3 text-color-white"><button onClick={removeCustomToken}>remove</button></td>
              </tr>
            ))}
             
            </tbody>
          </table>
        </div>
        <div className="flex pl-4 mt-20 lg:w-2/3 w-full mx-auto">
         
          <button  onClick={()=>{setShowAddTokenModal(true)}} className="flex ml-auto text-white bg-color-lime border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded-3xl">Add Custom ECR20 Token</button>
        </div>
      </div>
    </section>
      </>
      }

  {showAddTokenModal &&
  <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40" width="16px" height="16px"><path fill="#bae0bd" d="M20,38.5C9.799,38.5,1.5,30.201,1.5,20S9.799,1.5,20,1.5S38.5,9.799,38.5,20S30.201,38.5,20,38.5z"/><path fill="#5e9c76" d="M20,2c9.925,0,18,8.075,18,18s-8.075,18-18,18S2,29.925,2,20S10.075,2,20,2 M20,1 C9.507,1,1,9.507,1,20s8.507,19,19,19s19-8.507,19-19S30.493,1,20,1L20,1z"/><path fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2" d="M11 20L17 26 30 13"/></svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">Add Custom Token</h3>
           
 
              <div className="mt-2">
              <label className="leading-7 text-sm text-color-gray-tone">
              Token Contract Address
              </label>
              <input
                type="customToken"
                id="customToken"
                name="customToken"
                className="w-full bg-gray-100 bg-opacity-50 rounded-3xl border border-gray-300 focus:border-indigo-500 focus:bg-opacity-100 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                onChange={(e) => setNewTokenAddress(e.target.value)}
             />
                </div>

             <div className="mt-2">
              <label className="leading-7 text-sm text-color-gray-tone">
              Token Symbol
              </label>
              <input
                type="customTokenSymbol"
                id="customTokenSymbol"
                name="customTokenSymbol"
                className="w-full bg-gray-100 bg-opacity-50 rounded-3xl border border-gray-300 focus:border-indigo-500 focus:bg-opacity-100 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                onChange={(e) => setCustomTokenSymbol(e.target.value)}
             />
                </div>


              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button type="button" onClick={()=>{setShowAddTokenModal(false)}} className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
          <button type="button" onClick={()=>{addCustomToken(newTokenAddress,customTokenSymbol,defaultAccount)}} className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Add Token</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  }



    </div>
  );
};
export default App;
