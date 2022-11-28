import { Wallet } from "fuels";
import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
// Import the contract factory from the generated folder
// from the fuelchain command
import { ContractsAbi__factory } from "./contracts";
import { useFuelWeb3 } from "./utils";

// The address of the contract deployed to our local node
// the contract id is output right after the forc deploy command
// Ex.: Contract id: 0xa326e3472fd4abc417ba43e369f59ea44f8325d42ba6cf71ec4b58123fd8668a
// const CONTRACT_ID = "0xa326e3472fd4abc417ba43e369f59ea44f8325d42ba6cf71ec4b58123fd8668a"
const CONTRACT_ID =
  "0xef066899413ef8dc7c3073a50868bafb3d039d9bad8006c2635b7f0efa992553";
// Get wallet from the window object

function App() {
  const [FuelWeb3] = useFuelWeb3();
  const [counter, setCounter] = useState(0);
  const contract = useMemo(() => {
    if (!FuelWeb3) return null;
    // Auto connect application
    FuelWeb3.connect();
    // Create wallet using the FuelWeb3 provider
    const wallet = Wallet.fromAddress('fuel18e7amfxs60urq7h97xhdsa3rnykpcn0valkxsjfkjcrh2xqmyvpq4ay9jn', FuelWeb3.getProvider());
    // Connects out Contract instance to the deployed contract
    // address using the given wallet.
    return ContractsAbi__factory.connect(CONTRACT_ID, wallet);
  }, [FuelWeb3]);

  useEffect(() => {
    async function main() {
      if (!contract) return null;
      // Executes the counter function to query the current contract state
      // the `.get()` is read-only, because of this it don't expand coins.
      const { value } = await contract.functions.counter().get();
      setCounter(Number(value));
    }
    main();
  }, [contract]);

  async function increment() {
    if (!contract) return null;
    // Creates a transactions to call the increment function passing the amount
    // we want to increment, because it creates a TX and updates the contract state
    // this requires the wallet to have enough coins to cover the costs and also
    // to sign the Transaction
    const { value } = await contract.functions.increment(1).call();
    setCounter(Number(value));
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Counter: {counter}</p>
        <button onClick={increment}>Increment</button>
      </header>
    </div>
  );
}

export default App;