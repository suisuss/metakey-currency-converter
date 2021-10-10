import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CoinInterface, CoinTable } from './components/Coin';
import { Box, Card, Container, Image, Input, Text } from '@theme-ui/components';
import arrows from './assets/svg/arrows.svg'
import { decimalPlaces } from './utils';


const App: React.FC = () => {
  const [allCoins, setAllCoins] = useState<CoinInterface[]>([]);
  const [coinsDisplayed, setCoinsDisplayed] = useState<CoinInterface[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<null | any>(null);



  const [direction, setDirection] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [result, setResult] = useState<number>(0.00);

  const inputElement = document.getElementById('input') as HTMLInputElement;

  useEffect(() => {
    if (inputElement) {
      inputElement.value = inputElement.defaultValue
      setResult(0)
    }
  }, [selectedCoin, inputElement])

  useEffect(() => {
    setCoinsDisplayed(allCoins.slice(0, 4))
  }, [allCoins])

  useEffect(() => {
    axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false'
    )
      .then((res: any) => {
        setAllCoins(res.data.map((coin: any) => {
          return {
            name: coin.name,
            price: coin.current_price,
            symbol: coin.symbol,
            marketcap: coin.total_volume,
            volume: coin.market_cap,
            image: coin.image,
            priceChange: coin.price_change_percentage_24h,
          }
        }));
        setSelectedCoin(
          {
            name: res.data[0].name,
            price: res.data[0].current_price,
            symbol: res.data[0].symbol,
            marketcap: res.data[0].total_volume,
            volume: res.data[0].market_cap,
            image: res.data[0].image,
            priceChange: res.data[0].price_change_percentage_24h,
          }
        )
      })
      .catch((error: any) => console.log(error));
  }, []);

  const calculateResult = (amount: string) => {
    const amountAsFloat = parseFloat(amount);
    const selectedCoinPriceAsFloat = parseFloat(selectedCoin.price);
    if (!direction && amountAsFloat > 0.00) {
      setResult(selectedCoinPriceAsFloat * amountAsFloat);
    }
    if (direction && selectedCoinPriceAsFloat > 0.00 && amountAsFloat > 0.00) {
      setResult(amountAsFloat / selectedCoinPriceAsFloat);
    }
  }

  const handleNotch = (_: any) => {
    setDirection(!direction)
    setError(false)
    if (inputElement) {
      if (!error) {
        setResult(parseFloat(inputElement.value))
        inputElement.value = result.toFixed(3)
      } else {
        setError(false)
        setResult(0.000)
        inputElement.value = inputElement.defaultValue
      }
    }
  }

  const handleSearchChange = (e: any) => {
    const filteredCoins = allCoins.filter((coin: CoinInterface) => {
      return coin.name.toLowerCase().includes(e.target.value.toLowerCase()) || coin.symbol.toLowerCase().includes(e.target.value.toLowerCase())
    });
    console.log(filteredCoins)
    setCoinsDisplayed(filteredCoins.slice(0, 4))
  };

  const handleInputLeft = (e: any) => {
    setError(false)
    setResult(0.00)
    const targetAsString = e.target.value.toString()
    decimalPlaces(targetAsString) <= 3 && !/[a-zA-Z]/g.test(targetAsString) ? calculateResult(targetAsString) : setError(true)
  }

  const handleInputRight = (e: any) => {
    setError(false)
    setResult(0.00)
    const targetAsString = e.target.value.toString()
    decimalPlaces(targetAsString) <= 3 && !/[a-zA-Z]/g.test(targetAsString) ? calculateResult(targetAsString) : setError(true)
  }

  return (
    <Container variant="layout.container">

      <Text variant="layout.title" sx={{ justifyContent: "center", alignContent: "center", width: "100%", ml: "1rem" }}>METAKEY CURRENCY CONVERTER</Text>

      {/*Converter*/}
      <Card variant="layout.card" sx={{ alignItems: "center", justifyContent: "center", m: ["1rem", "1.5rem"] }}>
        <Box variant="layout.cardInner">
          <Box variant="layout.cardInner.converterAlign">
            {/* Left/Top */}
            <Box variant="layout.cardInner.box" sx={{ backgroundColor: error ? "#D8000C" : "#202231", marginRight: ["0px", "30px", "30px", "30px", "30px"] }}>
              <Box sx={{ display: "flex", width: ["100%"] }}>
                <Text variant="layout.cardInner.box.text" sx={{ justifyContent: "flex-start" }}>
                  {direction ? "USD" : (!selectedCoin ? "Crypto" : selectedCoin.symbol.toUpperCase())}
                </Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Input id="input" variant="layout.input" defaultValue={"0.000"} onChange={handleInputLeft} />
              </Box>
            </Box>

            {/* Notch */}
            <Box variant="layout.notch" sx={{ backgroundColor: error ? "#D8000C" : "#202231" }} onClick={handleNotch}>
              <Image src={arrows} variant="layout.notch.icon" />
            </Box>

            {/* Right/Bottom */}
            <Box variant="layout.cardInner.box" sx={{ backgroundColor: error ? "#D8000C" : "#202231", marginLeft: ["0px", "30px", "30px", "30px", "30px"] }}>
              <Box sx={{ display: "flex", width: "100%" }}>
                <Text variant="layout.cardInner.box.text" sx={{ justifyContent: "flex-end" }}>
                  {!direction ? "USD" : (!selectedCoin ? "Crypto" : selectedCoin.symbol.toUpperCase())}
                </Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Input variant="layout.input" disabled value={`${result.toFixed(3)}`} onChange={handleInputRight} />
              </Box>
            </Box>

          </Box>
        </Box>
      </Card>

      {/*Currencies*/}
      <Card variant="layout.card" sx={{ height: "auto" }}>
        <Box id="test" variant="layout.cardInnerCurrencies">
          <Box variant="layout.search">
            <Input type='text' onChange={handleSearchChange} placeholder='Search' />
          </Box>
          <CoinTable coins={coinsDisplayed} selectedCoin={selectedCoin} setSelectedCoin={setSelectedCoin} />
        </Box>
      </Card>

    </Container>
  );
}

export default App;
