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
  selected: string
  setSelected: Function
}

export const Coin: React.FC<CoinInterface> = ({
  coin, selected, setSelected
}) => {
  return (
    <Box variant="layout.coinRow" sx={{ backgroundColor: selected === coin.symbol ? "#202231": "transparent", marginBottom: "0.5rem", border: selected === coin.symbol ? "3px solid white" : null, borderRadius: "18px", cursor: "pointer"}} onClick={() => {setSelected(coin.symbol)}}>
      <Flex sx={{ ml: "1rem", diplay: "flex", alignItems: "center" }}>
        <Image src={coin.symbol !== 'usdt' ? coin.image: usdt} sx={{ borderRadius: "50%", maxWidth: ["40px", "50px"], maxHeight: ["40px", "50px"], diplay: "flex", flex: 1 }} alt='crypto' />
      </Flex>

      <Flex sx={{ ml: "2rem", diplay: "flex", alignItems: "center" }}>
        <Text sx={{ fontSize: ["1rem", "1.25rem" ]}}>{coin.symbol.toUpperCase()}</Text>
      </Flex>

      <Flex sx={{  ml: coin.symbol.length < 4 ? "1.6rem" : "1rem", diplay: "flex", flex: 1, alignItems: "center" }}>
        <Text sx={{ fontSize: ["1rem", "1.25rem" ] }}>${abbreviateCurrencyAmount(parseFloat(coin.price).toPrecision(4))}</Text>
      </Flex>

      <Flex sx={{  ml: "1rem", diplay: "flex", flex: 1, alignItems: "center" }}>
        <Text sx={{ fontSize: ["1rem", "1.25rem" ] }}>${abbreviateCurrencyAmount(coin.volume)}</Text>
      </Flex>

      <Flex sx={{  ml: "1rem", diplay: "flex", alignItems: "center" }}>
        {coin.priceChange < 0 ? (
          <Text sx={{ color: "red", fontSize: ["1rem", "1.25rem" ] }}>{coin.priceChange.toFixed(2)}%</Text>
        ) : (
          <Text sx={{ color: "green", fontSize: ["1rem", "1.25rem" ] }}>{coin.priceChange.toFixed(2)}%</Text>
        )}
      </Flex>

      <Flex sx={{  ml: "1rem", diplay: "flex", flex: 1, alignItems: "center" }}>
        <Text sx={{ fontSize: ["1rem", "1.25rem" ] }}>
          ${abbreviateCurrencyAmount(coin.marketcap)}
        </Text>
      </Flex>
    </Box>
  );
};

export default Coin;
