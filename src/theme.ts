import { Theme } from "theme-ui";


export const theme: Theme = {

  breakpoints: ["48em", "52em", "64em"],

  colors: {
    text: '#fff',
    background: 'black',
  },



  layout: {
    coinsearch: {
      marginBottom: "64px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center",
      backgroundColor: "transparent",
    },
    coinRow: {
      display: "flex",
      flexDirection: "row",
      height: "90px",
      minWidth: ["150px", "400px" ,"580px"]
    },
    coin: {
      display: "flex",
      flexDirection: "row"
    },


    card: {

      height: "auto",
      backgroundImage: () => "radial-gradient(circle at left top, rgb(1, 110, 218), rgb(217, 0, 192))",
      padding: "5px",
      borderRadius: "18px",


    }
  }
}

