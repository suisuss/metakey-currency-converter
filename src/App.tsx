import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CoinInterface, CoinTable } from './components/Coin';
import { Box, Button, Card, Container, Image, Input, Text } from '@theme-ui/components';
import arrows from './assets/svg/arrows.svg'
import { decimalPlaces } from './utils';


const App: React.FC = () => {
  const [allCoins, setAllCoins] = useState<CoinInterface[]>([]);
  const [coinsDisplayed, setCoinsDisplayed] = useState<CoinInterface[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<null | any>(null);
  const [search, setSearch] = useState<string>('');

  const [error, setError] = useState<boolean>(false);

  const inputElementLeft = document.getElementById('inputLeft') as HTMLInputElement;
  const inputElementRight = document.getElementById('inputRight') as HTMLInputElement;
  const inputElementSearch = document.getElementById('inputSearch') as HTMLInputElement;

  useEffect(() => {
    if (inputElementLeft && inputElementRight) {
      inputElementLeft.value = inputElementLeft.defaultValue
      inputElementRight.value = inputElementRight.defaultValue
    }
  }, [inputElementLeft, inputElementRight])

  useEffect(() => {
    setCoinsDisplayed(
      search.length > 0
        ? allCoins.filter((coin: CoinInterface) => {
          return coin.name.toLowerCase().includes(search.toLowerCase()) || coin.symbol.toLowerCase().includes(search.toLowerCase())
        }).slice(0, 4)
        : allCoins.slice(0, 4))
  }, [allCoins, search])

  const fetchData = (first: boolean) => {

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
        if (first) {
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
          );
        }
      })
      .catch((error: any) => console.log(error));
  }

  const handleSelect = (coin: CoinInterface) => {

    const amountAsFloat = parseFloat(inputElementLeft.value);
    const selectedCoinPriceAsFloat = parseFloat(coin.price);
    if (amountAsFloat > 0.00 && inputElementRight) {
      inputElementRight.value = (selectedCoinPriceAsFloat * amountAsFloat).toFixed(4)
    }
    setSelectedCoin(coin)
  }


  useEffect(() => {
    fetchData(true)
    setInterval(() => fetchData(false), 6000)
    // eslint-disable-next-line
  }, []);

  const calculateResult = (direction: boolean, amount: string) => {
    const amountAsFloat = parseFloat(amount);
    const selectedCoinPriceAsFloat = parseFloat(selectedCoin.price);

    if (inputElementRight && inputElementLeft && selectedCoinPriceAsFloat >= 0.00 && amountAsFloat >= 0.00 ) {
      if (direction) {
        inputElementRight.value = (selectedCoinPriceAsFloat * amountAsFloat).toFixed(4)
      } else {
        inputElementLeft.value = (amountAsFloat / selectedCoinPriceAsFloat).toFixed(4)
      }
    }
  }

  const handleSearchChange = (e: any) => {
    setSearch(e.target.value)
  };

  const inputError = (direction: boolean) => {
    setError(true)
    direction ? inputElementRight.value = inputElementRight.defaultValue : inputElementLeft.value = inputElementLeft.defaultValue
  }

  const handleInput = (e: any, direction: boolean) => {
    setError(false)
    var targetAsString = e.target.value.toString()
    if (targetAsString === "") { targetAsString = "0.000"}

    decimalPlaces(targetAsString) <= 4 && /^-?\d+(?:[.,]\d*?)?$/g.test(targetAsString) && selectedCoin 
      ? calculateResult(direction, targetAsString)
      : inputError(direction)
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
                  {!selectedCoin ? "Please Select A Currency" : selectedCoin.symbol.toUpperCase()}
                </Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Input id="inputLeft" variant="layout.input" type="text" onChange={(e:any) => {handleInput(e, true)}} defaultValue={"0.0000"} />
              </Box>
            </Box>

            {/* Notch */}
            <Box variant="layout.notch" sx={{ backgroundColor: error ? "#D8000C" : "#202231" }}>
              <Image src={arrows} variant="layout.notch.icon" />
            </Box>

            {/* Right/Bottom */}
            <Box variant="layout.cardInner.box" sx={{ backgroundColor: error ? "#D8000C" : "#202231", marginLeft: ["0px", "30px", "30px", "30px", "30px"] }}>
              <Box sx={{ display: "flex", width: "100%" }}>
                <Text variant="layout.cardInner.box.text" sx={{ justifyContent: "flex-end" }}>
                  {"USD"}
                </Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Input id="inputRight" variant="layout.input" type="text" onChange={(e:any) => {handleInput(e, false)}} defaultValue={"0.0000"} />
              </Box>
            </Box>

          </Box>
        </Box>
      </Card>

      {/*Currencies*/}
      <Card variant="layout.card" sx={{ height: "auto" }}>
        <Box id="test" variant="layout.cardInnerCurrencies">
          <Box variant="layout.search">
            <Input id="inputSearch" sx={{ width: "100%" }} type='text' onChange={handleSearchChange} placeholder='Search' />
            <Button variant="layout.button" sx={{ ml: "1rem", mr: ["0.5rem", "1rem", "1rem", "1rem"], paddingRight: "1.25rem", alignContent: "center", justifyContent: "center", minWidth: "3rem" }} onClick={() => {
              if (inputElementSearch) {
                inputElementSearch.value = ""
                setSearch("")
              }
            }}>Clear</Button>
          </Box>
          <CoinTable coins={coinsDisplayed} selectedCoin={selectedCoin} handleSelect={handleSelect} />
        </Box>
      </Card>

    </Container>
  );
}

export default App;
