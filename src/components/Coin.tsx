import { Box, Flex, Image, Text } from '@theme-ui/components';
import React, { useEffect, useRef } from 'react';
import { abbreviateCurrencyAmount } from '../utils';
import usdt from '../assets/svg/asset_USDT.svg';
import gsap, { Power3 } from 'gsap';

export interface CoinInterface {
  name: string
  price: string
  symbol: string
  marketcap: string
  volume: string
  image: string
  priceChange: number
}


interface CoinTableInterface {

  coins: CoinInterface[]
  selectedCoin: {
    name: string
    price: string
    symbol: string
    marketcap: string
    volume: string
    image: string
    priceChange: number
  }
  handleSelect: Function
}

export const CoinTable: React.FC<CoinTableInterface> = ({coins, selectedCoin, handleSelect}) => {
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
      {coins.map((coin: CoinInterface) => {
        return (
          <CoinRow key={coin.name} coin={coin} selectedCoin={selectedCoin} handleSelect={handleSelect} />
        );
      })}
    </>
  )
} 

export interface CoinRowInterface {
  coin: CoinInterface
  selectedCoin: CoinInterface
  handleSelect: Function
}

export const CoinRow: React.FC<CoinRowInterface> = ({
  coin, selectedCoin, handleSelect
}) => {

  const divRef = useRef(null);
  const animationOffset = 10
  useEffect(() => {
    gsap.to(divRef.current, 2.5, {
      opacity: 1,
      delay: 0.2,
      y: -animationOffset,
      ease: Power3.easeOut,
    })
  }, [])
  
  return (
    <Box ref={divRef} variant="layout.coinRow" sx={{ opacity: 0, position: "relative", top: animationOffset,  backgroundColor: selectedCoin?.symbol === coin.symbol ? "#202231" : "transparent", marginBottom: "0.5rem", border: selectedCoin?.symbol === coin.symbol ? "3px solid white" : null, borderRadius: "18px", cursor: "pointer" }} onClick={() => { handleSelect(coin) }}>
      <Flex sx={{ ml: "1rem", diplay: "flex", alignItems: "center", justifyContent: "flex-start" }}>
        <Image src={coin.symbol !== 'usdt' ? coin.image : usdt} sx={{ borderRadius: "50%", maxWidth: ["25px", "30px", "35px", "40px"], maxHeight: ["25px", "30px", "35px", "40px"], diplay: "flex", flex: 1 }} alt='crypto' />
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

export default CoinRow;