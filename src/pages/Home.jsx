import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from './components';
// import { BiconomyContext } from '../contexts'

const Homee = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns } = BiconomyContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="All Public Funding Contracts"
      isLoading={isLoading}
      // campaigns={campaigns}
    />
  )
}

export default Homee