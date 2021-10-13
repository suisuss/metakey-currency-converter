import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CoinInterface, CoinTable } from './components/Coin';
import { Box, Button, Card, Container, Image, Input, Text } from '@theme-ui/components';
import arrows from './assets/svg/arrows.svg'
import { decimalPlaces } from './utils';
import './index.css'
import gsap, { Power3 } from 'gsap';


const App: React.FC = () => {
  const [allCoins, setAllCoins] = useState<CoinInterface[]>([]);
  const [coinsDisplayed, setCoinsDisplayed] = useState<CoinInterface[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<null | any>(null);
  const [search, setSearch] = useState<string>('');

  const [error, setError] = useState<boolean>(false);

  const inputElementLeft = document.getElementById('inputLeft') as HTMLInputElement;
  const inputElementRight = document.getElementById('inputRight') as HTMLInputElement;
  const inputElementSearch = document.getElementById('inputSearch') as HTMLInputElement;

  const TitleRef = useRef(null);
  const ConverterRef = useRef(null);
  const CurrenciesRef = useRef(null);

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
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false'
    )
      .then((res: any) => {
        console.log(res.data.length)
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
    const value = parseFloat(inputElementRight.value)
    const selectedCoinPriceAsFloat = parseFloat(coin.price);
    if (amountAsFloat > 0.00 && inputElementRight) {
      inputElementRight.value = (selectedCoinPriceAsFloat * (value /selectedCoinPriceAsFloat)).toFixed(4)
      inputElementLeft.value = (value /selectedCoinPriceAsFloat ).toFixed(4)
    }
    setSelectedCoin(coin)
  }

  const animationOffset = 30

  useEffect(() => {
    fetchData(true)
    const intervalID = setInterval(() => fetchData(false), 6000)

    gsap.to([TitleRef.current, ConverterRef.current, CurrenciesRef.current], 3, {
      opacity: 1,
      y: animationOffset,
      ease: Power3.easeOut,
      stagger: {each: 0.25}
    })

    return () => {
      clearInterval(intervalID)
    }

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

  const clear = () => {
    inputElementRight.value = inputElementRight.defaultValue
    inputElementLeft.value = inputElementLeft.defaultValue
    setError(false)
  }

  const handleInput = (e: any, direction: boolean) => {
    setError(false)
    var targetAsString = e.target.value.toString()
    if (targetAsString === "") { targetAsString = "0.000"}
    if (targetAsString.includes('-')) {inputError(direction)}

    (decimalPlaces(targetAsString) <= 4 && /^-?\d+(?:[.,]\d*?)?$/g.test(targetAsString) && selectedCoin && targetAsString.length <= 15) 
      ? calculateResult(direction, targetAsString)
      : inputError(direction)
  }

  return (
    <Container variant="layout.container">

      <Text ref={TitleRef} variant="layout.title" sx={{top: -animationOffset, position: "relative", justifyContent: "center", alignContent: "center", width: "100%", ml: "1rem", opacity: 0 }}>METAKEY CURRENCY CONVERTER</Text>

      {/*Converter*/}
      <Card ref={ConverterRef} variant="layout.card" sx={{ top: -animationOffset, position: "relative", opacity: 0, alignItems: "center", justifyContent: "center", m: ["1rem", "1.5rem"] }}>
        <Box variant="layout.cardInner">
          <Box variant="layout.cardInner.converterAlign">
            {/* Left/Top */}
            <Box variant="layout.cardInner.box" sx={{ backgroundColor: error ? "#D8000C" : "#202231", marginRight: ["0px", "30px", "30px", "30px", "30px"] }}>
              <Box sx={{ display: "flex", width: ["100%"]}}>
                <Text variant="layout.cardInner.box.text" sx={{ justifyContent: "flex-start",  }}>
                  {!selectedCoin ? "Please Select A Currency" : selectedCoin.symbol.toUpperCase()}
                </Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center"}}>
                <input id="inputLeft" style={{
                  textAlign: "center",
                  width: "100%",
                  fontSize: "24px",
                  border: "none",
                  outline: 'none',
                  paddingTop: "0rem",
                  backgroundColor: "transparent",
                  color: "white"

                }} type="number" onChange={(e:any) => {handleInput(e, true)}} defaultValue={"0.0000"} />
              </Box>
            </Box>

            {/* Notch */}
            <Box variant="layout.notch" sx={{ backgroundColor: error ? "#D8000C" : "#202231" }} onClick={() => {clear()}}>
              <Image src={arrows} variant="layout.notch.icon"/>
            </Box>

            {/* Right/Bottom */}
            <Box variant="layout.cardInner.box" sx={{ backgroundColor: error ? "#D8000C" : "#202231", marginLeft: ["0px", "30px", "30px", "30px", "30px"] }}>
              <Box sx={{ display: "flex", width: "100%" }}>
                <Text variant="layout.cardInner.box.text" sx={{ justifyContent: "flex-end" }}>
                  {"USD"}
                </Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                <input id="inputRight" style={{
                  textAlign: "center",
                  width: "100%",
                  fontSize: "24px",
                  border: "none",
                  outline: 'none',
                  paddingTop: "0rem",
                  backgroundColor: "transparent",
                  color: "white"

                }} type="number" onChange={(e:any) => {handleInput(e, false)}} defaultValue={"0.0000"} />
              </Box>
            </Box>

          </Box>
        </Box>
      </Card>

      {/*Currencies*/}
      <Card ref={CurrenciesRef} variant="layout.card" sx={{ top: -animationOffset, position: "relative", height: "auto", opacity: 0 }}>
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
          {coinsDisplayed.length > 0 && <CoinTable coins={coinsDisplayed} selectedCoin={selectedCoin} handleSelect={handleSelect} />}
        </Box>
      </Card>

    </Container>
  );
}

export default App;
