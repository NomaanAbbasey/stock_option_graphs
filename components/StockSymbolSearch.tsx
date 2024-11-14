import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  assetType: string;
}

interface StockSymbolSearchProps {
  apiKey: string; // Accepts the API key as a prop
  onSelectSymbol?: (symbol: string) => void; // Optional callback when a symbol is selected
}

const StockSymbolSearch: React.FC<StockSymbolSearchProps> = ({ apiKey, onSelectSymbol }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const fetchStockSymbols = async () => {
      try {
        const response = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'LISTING_STATUS',
            apikey: apiKey,
          },
          responseType: 'text',
        });

        console.log(response)

        // Parse CSV data and ensure TypeScript compatibility
        Papa.parse<Stock>(response.data, {
          header: true,
          complete: (result) => {
            setStocks(result.data as Stock[]);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          },
        });
      } catch (error) {
        console.error('Error fetching stock symbols:', error);
      }
    };

    fetchStockSymbols();
  }, [apiKey]);

  // Filter stocks based on search term
  useEffect(() => {
    setFilteredStocks(
      stocks.filter(
        (stock) =>
          stock.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, stocks]);

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        placeholder="Search for a stock symbol or name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '20px' }}
      />

      <select
        style={{ padding: '10px', width: '100%' }}
        onChange={(e) => onSelectSymbol && onSelectSymbol(e.target.value)}
      >
        <option value="">Select a stock symbol</option>
        {filteredStocks.map((stock) => (
          <option key={stock.symbol} value={stock.symbol}>
            {stock.name} ({stock.symbol}) - {stock.exchange}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StockSymbolSearch;