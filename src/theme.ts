import { Theme } from "theme-ui";


export const theme: Theme = {

  breakpoints: ["30em", "40em", "45rem", "52em", "64em"],

  colors: {
    text: '#fff',
    background: 'black',
  },

  layout: {

    button: {
      backgroundImage: () => "radial-gradient(circle at left top, rgb(1, 110, 218), rgb(217, 0, 192))",
    },

    search: {
      marginBottom: "1rem",
      display: "flex",
    },

    input: {
      textAlign: "center",
      width: ["100%", "100%", "100%"],
      fontSize: "24px",
      border: "none",
      outline: 'none',
      paddingTop: "0rem"
    },

    notch: {
      marginX: ["0px", "-50px", "-50px", "-50px", "-50px"],
      marginY: ["-15px", "-15px", "-15px", "0px"],
      backgroundImage: () => "radial-gradient(circle at left top, rgb(1, 110, 218), rgb(217, 0, 192))",
      borderRadius: "50%",
      minWidth: ["60px", "60px", "60px", "80px"],
      minHeight: ["60px", "60px", "60px", "80px"],
      border: "5px solid #161522",
      alignItems: "center",
      justifyContent: "center",
      zIndex: [2, 2, 2, 2, 2],

      icon: {
        minWidth: ["40px", "40px", "40px", "60px"],
        width: ["40px", "40px", "40px", "60px"],
        minHeight: ["40px", "40px", "40px", "60px"],
        height: ["40px", "40px", "40px", "60px"],
        transform: "rotate(90deg)",
        padding: ["0rem 0rem 0.45rem 0.6rem", "0rem 0rem 0.45rem 0.6rem", "0rem 0rem 0.45rem 0.6rem", "0rem 0rem 0.45rem 0.6rem"],
      }
    },

    title: {
      width: ["100%", "100%", "500px", "660px"],
      fontSize: ["35px", "35px", "35px", "40px"],
      fontWeight: "bold",
      justifyContent: "center"
    },

    container: {
      padding: ["1rem", "2rem", "2rem", "2rem"],
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    },

    coinRow: {
      display: "flex",
      flexDirection: "row",
      height: ["65px", "65px", "65px"],
      maxWidth: "100%",

      text: {
        fontSize: ["1rem", "1.05rem", "1.15rem"]
      }
    },
    coin: {
      display: "flex",
      flexDirection: "row"
    },


    card: {

      height: "auto",
      backgroundImage: () => "radial-gradient(circle at left top, rgb(1, 110, 218), rgb(217, 0, 192))",
      padding: ["4px", "4px", "5px", "5px"],
      borderRadius: "18px",
      width: ["100%", "100%", "500px", "640px"]
    },

    cardInner: {
      backgroundColor: "#161522",
      width: "100%",
      height: "100%",
      borderRadius: "18px",
      justifyContent: "center",
      padding: ["1rem", "1rem", "1rem", "1rem"],

      box: {
        display: "flex",
        borderRadius: "16px",
        height: "70px",
        padding: "0.5rem 1rem 1rem 0.8rem",
        flexDirection: "column",
        width: ["100%", "100%", "50%", "50%", "50%"],

        text: {
          fontSize: ["0.9rem", "0.9rem", "1rem", "1.25"],
          display: "flex",
          flex: 1
        }
      },

      converterAlign: {
        flexDirection: ["column", "row"],
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    },

    cardInnerCurrencies: {
      backgroundColor: "#161522",
      width: "100%",
      height: "100%",
      borderRadius: "18px",
      justifyContent: "center",
      paddingTop: ["1.10rem", "1.25rem", "1.25rem", "1.25rem"],
      paddingLeft: ["1.10rem", "1.25rem", "1.25rem", "1.25rem"],
      paddingRight: ["1.10rem", "1.25rem", "1.25rem", "1.25rem"],
      paddingBottom: ["0.5rem", "0.5rem", "0.5rem", "0.5rem"],
    }
  }
}

