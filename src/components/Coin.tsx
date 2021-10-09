import { Box, Flex, Image, Text } from '@theme-ui/components';
import React from 'react';
import { abbreviateCurrencyAmount } from '../utils';
import usdt from '../asset_USDT.svg';


export interface CoinInterface {
  coin: {
    name: string
    price: string
    symbol: string
    marketcap: string
    volume: string
    image: string
    priceChange: number
  }
  selectedCoin: {
    name: string
    price: string
    symbol: string
    marketcap: string
    volume: string
    image: string
    priceChange: number
  }
  setSelectedCoin: Function
}

export const Coin: React.FC<CoinInterface> = ({
  coin, selectedCoin, setSelectedCoin
}) => {
  return (
    <Box variant="layout.coinRow" sx={{ backgroundColor: selectedCoin?.symbol === coin.symbol ? "#202231" : "transparent", marginBottom: "0.5rem", border: selectedCoin?.symbol === coin.symbol ? "3px solid white" : null, borderRadius: "18px", cursor: "pointer" }} onClick={() => { setSelectedCoin(coin) }}>
      <Flex sx={{ ml: "1rem", diplay: "flex", alignItems: "center", justifyContent: "flex-start" }}>
        <Image src={coin.symbol !== 'usdt' ? coin.image : usdt} sx={{ borderRadius: "50%", maxWidth: ["25px", "30px", "35px", "50px"], maxHeight: ["35px", "50px"], diplay: "flex", flex: 1 }} alt='crypto' />
      </Flex>

      <Flex sx={{ ml: "1.5rem", diplay: "flex", alignItems: "center", flex: 1 }}>
        <Text variant="layout.coinRow.text">{coin.symbol.toUpperCase()}</Text>
      </Flex>

      <Flex sx={{ mr: "1rem", diplay: "flex", flex: 1, alignItems: "center" }}>
        <Text variant="layout.coinRow.text">${abbreviateCurrencyAmount(parseFloat(coin.price).toPrecision(4))}</Text>
      </Flex>

      <Box sx={{ mr: "1.5rem", display: ["none", "flex", "flex", "flex"], flex: 1, alignItems: "center" }}>
        <Text variant="layout.coinRow.text">${abbreviateCurrencyAmount(coin.volume)}</Text>
      </Box>


      <Box sx={{ mr: "1rem", display: "flex", justifyContent: "flex-end", flex: 1, alignItems: "center" }}>
        <Text variant="layout.coinRow.text">
          ${abbreviateCurrencyAmount(coin.marketcap)}
        </Text>
      </Box>
    </Box>
  );
};

export default Coin;


interface CoinTableInterface {

  coins: any[]
  selectedCoin: {
    name: string
    price: string
    symbol: string
    marketcap: string
    volume: string
    image: string
    priceChange: number
  }
  setSelectedCoin: Function
}

export const CoinTable: React.FC<CoinTableInterface> = ({coins, selectedCoin, setSelectedCoin}) => {
  return (
    <>
      <Box variant="layout.coinRow" sx={{ maxHeight: "40px", mb: "1rem"}}>
        <Flex sx={{ ml: "1rem", diplay: "flex", alignItems: "center", justifyContent: "flex-start" }}>
          <Text variant="layout.coinRow.text">Asset</Text>
        </Flex>

        <Flex sx={{ ml: "1rem", diplay: "flex", alignItems: "center", flex: 1 }}>
          <Text variant="layout.coinRow.text"></Text>
        </Flex>

        <Flex sx={{ mr: "1rem", diplay: "flex", flex: 1, alignItems: "center" }}>
          <Text variant="layout.coinRow.text">Price</Text>
        </Flex>

        <Box sx={{ mr: "1.5rem", display: ["none", "flex", "flex", "flex"], flex: 1, alignItems: "center" }}>
          <Text variant="layout.coinRow.text">Volume</Text>
        </Box>

        <Box sx={{ mr: "1rem", display: "flex", justifyContent: "flex-end", flex: 1, alignItems: "center" }}>
          <Text variant="layout.coinRow.text">
            Market Cap
          </Text>
        </Box>
      </Box>
      {coins.map((coin: any) => {
        return (
          <Coin key={coin.id} coin={{
            name: coin.name,
            price: coin.current_price,
            symbol: coin.symbol,
            marketcap: coin.total_volume,
            volume: coin.market_cap,
            image: coin.image,
            priceChange: coin.price_change_percentage_24h,
          }} selectedCoin={selectedCoin} setSelectedCoin={setSelectedCoin} />
        );
      })}
    </>
  )
} 