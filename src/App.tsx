import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CoinInterface, CoinTable } from './components/Coin';
import { Box, Card, Container, Image, Input, Text } from '@theme-ui/components';
import arrows from './arrows.svg'
import { decimalPlaces } from './utils';


const App: React.FC = () => {
  const [coins, setCoins] = useState<CoinInterface[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<null | any>(null);
  const [direction, setDirection] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<number>(0.00)

  const inputRef = useRef(null)

  useEffect(() => {
    const inputElement = document.getElementById('input') as HTMLInputElement
    if (inputElement) {
      inputElement.value = inputElement.defaultValue
      setResult(0)
    }
  }, [selectedCoin])

  useEffect(() => {
    axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false'
    )
      .then((res: any) => {
        setCoins(res.data);
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
    if (!direction && parseFloat(amount) > 0.00) {
      setResult(parseFloat(selectedCoin.price) * parseFloat(amount))
    }
    if (direction && parseFloat(selectedCoin.price) > 0.00 && parseFloat(amount) > 0.00) {
      setResult(parseFloat(amount) / parseFloat(selectedCoin.price))
    }
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
                <Text variant="layout.cardInner.box.text" sx={{ justifyContent: "flex-start" }}>{
                  direction ? "USD" : (!selectedCoin ? "Crypto" : selectedCoin.symbol.toUpperCase())}</Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Input id="input" variant="layout.input" ref={inputRef} defaultValue={"0.000"} onChange={
                  (e: any) => {
                    setError(false)
                    setResult(0.00)
                    const targetAsString = e.target.value.toString()
                    decimalPlaces(targetAsString) <= 3 && !/[a-zA-Z]/g.test(targetAsString) ? calculateResult(targetAsString) : setError(true)
                  }
                } />
              </Box>
            </Box>

            {/* Notch */}
            <Box variant="layout.notch" sx={{ backgroundColor: error ? "#D8000C" : "#202231" }} onClick={() => {
              setDirection(!direction)
              setError(false)
              const inputElement = document.getElementById('input') as HTMLInputElement
              if (inputElement) {
                setResult(parseFloat(inputElement.value))
                inputElement.value = result.toFixed(3)
              }
            }}>
              <Image src={arrows} variant="layout.notch.icon" />
            </Box>

            {/* Right/Bottom */}
            <Box variant="layout.cardInner.box" sx={{ backgroundColor: error ? "#D8000C" : "#202231", marginLeft: ["0px", "30px", "30px", "30px", "30px"] }}>
              <Box sx={{ display: "flex", width: "100%" }}>
                <Text variant="layout.cardInner.box.text" sx={{ justifyContent: "flex-end" }}>{!direction ? "USD" : (!selectedCoin ? "Crypto" : selectedCoin.symbol.toUpperCase())}</Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Input variant="layout.input" disabled value={(direction ? '' : '$') + `${result.toFixed(3)}`} />
              </Box>
            </Box>

          </Box>
        </Box>
      </Card>

      {/*Currencies*/}
      <Card variant="layout.card" sx={{ height: "auto" }}>
        <Box id="test" variant="layout.cardInnerCurrencies">
          <CoinTable coins={coins} selectedCoin={selectedCoin} setSelectedCoin={setSelectedCoin} />
        </Box>
      </Card>

    </Container>
  );
}

export default App;
