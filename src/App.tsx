import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Coin from './components/Coin';
import { Box, Card, Container, Image, Input, Text } from '@theme-ui/components';
import test from './test.svg'
import { decimalPlaces } from './utils';


const App: React.FC = () => {
  const [coins, setCoins] = useState([]);
  const [selected, setSelected] = useState('btc');
  const [direction, setDirection] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false'
      )
      .then((res: any) => {
        setCoins(res.data);
        console.log(res.data);
      })
      .catch((error: any) => console.log(error));
  }, []);


  return (
    <Container sx={{ padding: "2rem", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

      <Box sx={{ marginBottom: "2rem", fontSize: ["35px", "40px"], fontWeight: "bold" }}>
        <Text>METAKEY CURRENCY CONVERTER</Text>
      </Box>

      {/*Converter*/}
      <Card variant="layout.card" sx={{ alignItems: "center", justifyContent: "center", mb: "2rem" }}>
        <Box sx={{ backgroundColor: "#161522", width: "100%", height: "100%", borderRadius: "18px", alignItems: "center", justifyContent: "center"  }}>

          <Box sx={{ flexDirection: "row", display: "flex", padding: "1rem", alignItems: "center", justifyContent: "center" }}>
            {/* Left/Top */}
            <Box sx={{ display: "flex", borderRadius: "18px", height: "80px", backgroundColor: error ? "#D8000C" : "#202231", marginRight: "30px", padding: "0.5rem 1rem 1rem 0.8rem", flexDirection: "column" }}>
              <Box sx={{ display: "flex", width: "100%" }}>
                <Text sx={{ display: "flex", flex: 1, justifyContent: "flex-start" }}>{direction ? "Fiat" : "Crypto"}</Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Input sx={{ textAlign: "center", width: "250px", fontSize: "24px", border: "none" }} onChange={
                  (e: any) => {
                    setError(false)
                    const targetAsString = e.target.value.toString()
                    decimalPlaces(targetAsString) <= 6 && !/[a-zA-Z]/g.test(targetAsString) ? console.log("calculate") : setError(true)
                  }
                } />
              </Box>
            </Box>
            
            {/* Notch */}
            <Box sx={{ marginLeft: ["0px", "-50px"], marginRight: ["0px", "-50px"], borderRadius: "50%", backgroundColor: error ? "#D8000C" : "#202231", width: "80px", height: "80px", border: "5px solid #161522", alignItems: "center", justifyContent: "center", zIndex: [2, 2, 2] }} onClick={() => { setDirection(!direction) }}>
              <Image src={test} sx={{ width: "60px", height: "60px", transform: "rotate(90deg)", padding: "0rem 0rem 0.6rem 0.6rem" }} />
            </Box>

            {/* Right/Bottom */}
            <Box sx={{ display: "flex", borderRadius: "18px", height: "80px", backgroundColor: error ? "#D8000C" : "#202231", marginLeft: "30px", padding: "0.5rem 1rem 1rem 0.8rem", flexDirection: "column" }}>
              <Box sx={{ display: "flex", width: "100%" }}>
                <Text sx={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>{!direction ? "Fiat" : "Crypto"}</Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Box sx={{ textAlign: "center", width: "250px", fontSize: "24px", border: "none" }}/>
              </Box>
            </Box>

          </Box>
        </Box>
      </Card>

      {/*Currencies*/}
      <Card variant="layout.card" sx={{ height: "auto" }}>
        <Box sx={{ backgroundColor: "#161522", width: "100%", height: "100%", borderRadius: "18px", justifyContent: "center", padding: ["1rem", "1.5rem"] }}>
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
              }} selected={selected} setSelected={setSelected} />
            );
          })}
        </Box>
      </Card>

    </Container>
  );
}

export default App;
