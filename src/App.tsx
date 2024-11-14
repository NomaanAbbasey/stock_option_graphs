import React, { useState } from 'react';
import StockSymbolSearch from '../components/StockSymbolSearch';
import IntradayChart from '../components/IntradayChart';

const App: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('IBM');
  const apiKey = 'J1J90XA36FPL009L'; // Define API key here

  const handleSelectSymbol = (symbol: string) => {
    console.log('Selected stock symbol:', symbol);
    setSelectedSymbol(symbol);
  };

  return (
    <div>
      <StockSymbolSearch apiKey={apiKey} onSelectSymbol={handleSelectSymbol} />
      <IntradayChart symbol={selectedSymbol} apiKey={apiKey} />
    </div>
  );
};

export default App;
