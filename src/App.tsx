import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CoinTable } from './components/Coin';
import { Box, Card, Container, Image, Input, Text } from '@theme-ui/components';
import arrows from './arrows.svg'
import { decimalPlaces } from './utils';


const App: React.FC = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState<null | any>(null);
  const [direction, setDirection] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false'
      )
      .then((res: any) => {
        setCoins(res.data);
        setSelectedCoin(res.data[0])
        console.log(res.data);
      })
      .catch((error: any) => console.log(error));
  }, []);


  return (
    <Container variant="layout.container">

        <Text variant="layout.title" sx={{ justifyContent: "center", alignContent: "center", width: "100%", ml: "1rem"}}>METAKEY CURRENCY CONVERTER</Text>

      {/*Converter*/}
      <Card variant="layout.card" sx={{ alignItems: "center", justifyContent: "center", m: ["1rem", "1.5rem"] }}>
        <Box variant="layout.cardInner">
          <Box variant="layout.cardInner.converterAlign">
            {/* Left/Top */}
            <Box variant="layout.cardInner.box" sx={{ backgroundColor: error ? "#D8000C" : "#202231", marginRight: ["0px", "30px", "30px", "30px", "30px"]  }}>
              <Box sx={{ display: "flex", width: ["100%"] }}>
                <Text variant="layout.cardInner.box.text" sx={{ justifyContent: "flex-start" }}>{
                  direction ? "USD" : (!selectedCoin ? "Crypto" : selectedCoin.symbol.toUpperCase())}</Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Input variant="layout.input" onChange={
                  (e: any) => {
                    setError(false)
                    const targetAsString = e.target.value.toString()
                    decimalPlaces(targetAsString) <= 6 && !/[a-zA-Z]/g.test(targetAsString) ? console.log(targetAsString) : setError(true)
                  }
                } />
              </Box>
            </Box>

            {/* Notch */}
            <Box variant="layout.notch" sx={{ backgroundColor: error ? "#D8000C" : "#202231" }} onClick={() => { setDirection(!direction) }}>
              <Image src={arrows} variant="layout.notch.icon" />
            </Box>

            {/* Right/Bottom */}
            <Box variant="layout.cardInner.box" sx={{ backgroundColor: error ? "#D8000C" : "#202231", marginLeft: ["0px", "30px", "30px", "30px", "30px"] }}>
              <Box sx={{ display: "flex", width: "100%" }}>
                <Text variant="layout.cardInner.box.text" sx={{ justifyContent: "flex-end" }}>{!direction ? "USD" : (!selectedCoin ? "Crypto" : selectedCoin.symbol.toUpperCase())}</Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Input variant="layout.input" disabled />
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
