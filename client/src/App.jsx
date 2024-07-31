import React, { useState } from 'react';
import { createWalletClient, custom, getContract } from 'viem';
import { sepolia } from 'viem/chains';
import moodABI from './contracts/Mood.json'; // ABI'yi import ediyoruz

const MoodDApp = () => {
  const [mood, setMood] = useState('');
  const [displayedMood, setDisplayedMood] = useState('');
  const [address, setAddress] = useState('');

  const setupWalletClient = async () => {
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum),
    });

    const accounts = await walletClient.requestAddresses();
    const [address] = accounts;
    setAddress(address);

    return walletClient;
  };

  const getMoodContractInstance = async (walletClient) => {
    const MoodContractAddress = '0x039929AF28ffe83857EDbcA7E431b096C6C7903f';
    const MoodContractABI = moodABI.abi;

    return getContract({
      address: MoodContractAddress,
      abi: MoodContractABI,
      client: walletClient,
    });
  };

  const handleGetMood = async () => {
    const walletClient = await setupWalletClient();
    const MoodContractInstance = await getMoodContractInstance(walletClient);

    const mood = await MoodContractInstance.read.getMood();
    setDisplayedMood(`Your Mood: ${mood}`);
  };

  const handleSetMood = async () => {
    const walletClient = await setupWalletClient();
    const MoodContractInstance = await getMoodContractInstance(walletClient);

    await MoodContractInstance.write.setMood([mood], {
      account: address,
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">This is my dApp!</h1>
      <p>Here we can set or get the mood:</p>
      <label htmlFor="mood">Input Mood:</label>
      <br />
      <input
        type="text"
        id="mood"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="border p-2 mb-4"
      />
      <button onClick={handleGetMood} className="bg-blue-500 text-white p-2 mr-2">
        Get Mood
      </button>
      <button onClick={handleSetMood} className="bg-green-500 text-white p-2">
        Set Mood
      </button>
      <p id="showMood" className="mt-4">{displayedMood}</p>
    </div>
  );
};

export default MoodDApp;
