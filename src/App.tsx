import React, { useEffect, useRef, useReducer, useState } from 'react';
import axios from 'axios';
import { CoinInterface, CoinTable } from './components/Coin';
import { Box, Button, Card, Container, Image, Input, Text } from '@theme-ui/components';
import arrows from './assets/svg/arrows.svg'
import { decimalPlaces } from './utils';
import './index.css'
import gsap, { Power3 } from 'gsap';


interface State {
  coins: CoinInterface[],
  coinsDisplayed: CoinInterface[],
  isUserError: boolean,
  search: string

}


interface SetUsrError {
  type: 'SET_USER_ERROR',
  data: boolean
}

interface SetSearch {
  type: 'SET_SEARCH',
  data: string | null
}

interface SetCoinDisplay {
  type: 'SET_COIN_DISPLAY',
  data: CoinInterface[]
}

interface SetCoinSelected {
  type: 'SET_COIN_SELECTED',
  data: number
}

interface SetCoins {
  type: 'SET_COINS',
  data:  CoinInterface[]
}

type Action = SetUsrError | SetCoinDisplay | SetCoinSelected | SetCoins | SetSearch

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_USER_ERROR':
      return Object.assign({}, state, { isUserError: action.data })
    case 'SET_COIN_DISPLAY':
      return Object.assign({}, state, { coinsDisplayed: action.data })
    case 'SET_COIN_SELECTED':
      return Object.assign({}, state, { coinSelected: action.data })
    case 'SET_SEARCH':
      return Object.assign({}, state, { search: action.data })
    case 'SET_COINS':
      return Object.assign({}, state, { coins: action.data})
    default:
      throw new Error(`Invaild dispatch`)
  }

}

const INITIAL_STATE: State = {
  coins: [],
  coinsDisplayed: [],
  search: "",
  isUserError: false,
}


const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const [coinSelected, setCoinSelected] = useState(0)

  const animationOffset = 30

  const inputElementLeft = document.getElementById('inputLeft') as HTMLInputElement;
  const inputElementRight = document.getElementById('inputRight') as HTMLInputElement;
  const inputElementSearch = document.getElementById('inputSearch') as HTMLInputElement;

  const TitleRef = useRef(null);
  const ConverterRef = useRef(null);
  const CurrenciesRef = useRef(null);

  useEffect(() => {
    if (inputElementLeft && inputElementRight) {
      inputElementLeft.value = ""
      inputElementRight.value = ""
    }
  }, [inputElementLeft, inputElementRight])



  useEffect(() => {

    // Fetch data
    fetchData()
    const intervalID = setInterval(() => fetchData(), 6000)

    // Run animations
    gsap.to([TitleRef.current, ConverterRef.current, CurrenciesRef.current], 3, {
      opacity: 1,
      y: animationOffset,
      ease: Power3.easeOut,
      stagger: { each: 0.25 }
    })

    return () => {
      clearInterval(intervalID)
    }
    // eslint-disable-next-line 
  }, []);

  useEffect(() => {
    dispatch(
      {
        type: 'SET_COIN_DISPLAY',
        data: state.search.length === 0 ? state.coins.slice(0, 4) : state.coins.filter((coin: CoinInterface) => {
          return coin.name.toLowerCase().includes(state.search.toLowerCase()) || coin.symbol.toLowerCase().includes(state.search.toLowerCase())
        }).slice(0, 4)
      }
    )
  }, [state.coins, state.search])

  const fetchData = () => {
    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false')
      .then((res: any) => {
        dispatch({
          type: "SET_COINS",
          data: res.data.map((coin: any, index: number) => {
              return {
                index: index,
                name: coin.name,
                price: coin.current_price,
                symbol: coin.symbol,
                marketcap: coin.total_volume,
                volume: coin.market_cap,
                image: coin.image,
                priceChange: coin.price_change_percentage_24h,
              } as CoinInterface
            }) as CoinInterface[]
          }
        )
      })
      
  }


  const handleSelect = (coin: CoinInterface) => {

    const amountAsFloat = parseFloat(inputElementLeft.value);
    const value = parseFloat(inputElementRight.value)
    const coinSelectedPriceAsFloat = parseFloat(coin.price);
    if (amountAsFloat > 0.00 && inputElementRight) {
      inputElementRight.value = (coinSelectedPriceAsFloat * (value / coinSelectedPriceAsFloat)).toFixed(4)
      inputElementLeft.value = (value / coinSelectedPriceAsFloat).toFixed(4)
    }

    setCoinSelected(state.coins.map((coin: CoinInterface) => coin.name).indexOf(coin.name))
    
  }

  const calculateResult = (direction: boolean, amount: string) => {
    const amountAsFloat = parseFloat(amount);
    const coinSelectedPriceAsFloat = parseFloat(state.coins[coinSelected].price);

    if (inputElementRight && inputElementLeft && coinSelectedPriceAsFloat >= 0.00 && amountAsFloat >= 0.00) {
      direction
        ? inputElementRight.value = (coinSelectedPriceAsFloat * amountAsFloat).toFixed(4)
        : inputElementLeft.value = (amountAsFloat / coinSelectedPriceAsFloat).toFixed(4)
    } else {
      direction
        ? inputElementRight.value = ""
        : inputElementLeft.value = ""
    }
  }

  const handleSearchChange = (e: any) => {
    dispatch(
      {
        type: "SET_SEARCH",
        data: e.target.value
      })
  };

  const handleSearchClear = (e: any) => {
    if (inputElementSearch) {
      inputElementSearch.value = ""
      dispatch({
        type: "SET_SEARCH",
        data: ""
      })
    }
  }

  const handleDisplayError = (direction: boolean) => {
    dispatch({
      type: "SET_USER_ERROR",
      data: true
    })
    direction 
      ? inputElementRight.value = ""
      : inputElementLeft.value = ""
  }

  const handleConverterReset = () => {
    inputElementRight.value = ""
    inputElementLeft.value = ""
    dispatch({
      type: "SET_USER_ERROR",
      data: false
    })
  }

  const handleInput = (e: any, direction: boolean) => {
    dispatch({
      type: "SET_USER_ERROR",
      data: false
    })
    var targetAsString = e.target.value.toString()
    if (targetAsString.includes('-')) { handleDisplayError(direction) }

    (decimalPlaces(targetAsString) <= 4)
      ? calculateResult(direction, targetAsString)
      : handleDisplayError(direction)
  }

  return (
    <Container variant="layout.container">

      <Text ref={TitleRef} variant="layout.title" sx={{ top: -animationOffset, position: "relative", justifyContent: "center", alignContent: "center", width: "100%", ml: "1rem", opacity: 0 }}>METAKEY CURRENCY CONVERTER</Text>

      {/*Converter*/}
      <Card ref={ConverterRef} variant="layout.card" sx={{ top: -animationOffset, position: "relative", opacity: 0, alignItems: "center", justifyContent: "center", m: ["1rem", "1.5rem"] }}>
        <Box variant="layout.cardInner">
          <Box variant="layout.cardInner.converterAlign">
            {/* Left/Top */}
            <Box variant="layout.cardInner.box" sx={{ backgroundColor: state.isUserError ? "#D8000C" : "#202231", marginRight: ["0px", "30px", "30px", "30px", "30px"] }}>
              <Box sx={{ display: "flex", width: ["100%"] }}>
                <Text variant="layout.cardInner.box.text" sx={{ justifyContent: "flex-start", }}>
                  {state.coins.length > 0 ? state.coins[coinSelected].symbol.toUpperCase() : "Please Select A Currency"}
                </Text>
              </Box>
              <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                <input id="inputLeft" style={{
                  textAlign: "center",
                  width: "100%",
                  fontSize: "24px",
                  border: "none",
                  outline: 'none',
                  paddingTop: "0rem",
                  backgroundColor: "transparent",
                  color: "white"

                }} type="number" onChange={(e: any) => { handleInput(e, true) }} placeholder='0.0000' />
              </Box>
            </Box>

            {/* Notch */}
            <Box variant="layout.notch" sx={{ backgroundColor: state.isUserError ? "#D8000C" : "#202231" }} onClick={() => { handleConverterReset() }}>
              <Image src={arrows} variant="layout.notch.icon" />
            </Box>

            {/* Right/Bottom */}
            <Box variant="layout.cardInner.box" sx={{ backgroundColor: state.isUserError ? "#D8000C" : "#202231", marginLeft: ["0px", "30px", "30px", "30px", "30px"] }}>
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

                }} type="number" onChange={(e: any) => { handleInput(e, false) }} placeholder="0.0000" />
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
            <Button variant="layout.button" sx={{ ml: "1rem", mr: ["0.5rem", "1rem", "1rem", "1rem"], paddingRight: "1.25rem", alignContent: "center", justifyContent: "center", minWidth: "3rem" }} onClick={handleSearchClear}>Clear</Button>
          </Box>
          {state.coinsDisplayed.length > 0 && <CoinTable coins={state.coinsDisplayed} coinSelected={coinSelected} handleSelect={handleSelect} />}
        </Box>
      </Card>

    </Container>
  );
}

export default App;
