import { useState } from "react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function ScoreBoard({ currentScore, highScore }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h2>High Score: {highScore}</h2>
      <h2>Current Score: {currentScore}</h2>
    </div>
  );
}

function CardDisplay({ clickFunction, randomOrderer }) {
  const API_URL = "https://api.unsplash.com/search/photos?query=";
  const ACCESS_KEY = "Uia_mYYmy8yHOG671XIBDqiW9rtqOrxQhr6T1U_uQiM";
  const SEARCH_INDICATOR = "&client_id=";
  const SUFFIX = "";

  //state variables
  const [urlList, setUrlList] = useState([]);
  // const [cards, setCards] = useState([]);
  const [trigger, setTrigger] = useState(true);

  useEffect(() => {
    //items that will be searched on giphy (one time each)
    const categories = [
      "dogs",
      "cats",
      "hippos",
      "bird",
      "spy",
      "detective",
      "army",
      "captain",
      "baseball",
      "hockey",
      "football",
      "basketball",
      "dune",
      "sicario",
      "arrival",
      "enemy",
    ];

    //Create function to fetch URL
    const fetchURL = async function (category) {
      try {
        const response = await fetch(
          `${API_URL}${category}${SEARCH_INDICATOR}${ACCESS_KEY}${SUFFIX}`,
          {
            mode: "cors",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const jsonData = await response.json();
        const imageURL = jsonData["results"][0]["urls"]["regular"];
        return imageURL;
      } catch (error) {
        console.error("Error:", error);
      }
    };

    //Create function to fetch all categorires
    const fetchAllCategories = async function () {
      const URLS = [];
      for (let category of categories) {
        //Store image URLS
        let url = await fetchURL(category);
        URLS.push(url);
      }
      return URLS;
    };

    // const generateCards = function (arr) {
    //   console.log(arr);
    //   return arr.map((el) => {
    //     return (
    //       <img
    //         src={el}
    //         alt=""
    //         id={uuidv4()}
    //         key={uuidv4()}
    //         width="130px"
    //         height="130px"
    //         style={{ border: "2px solid lime", borderRadius: "12px" }}
    //         onClick={(e) => clickFunction(e)}
    //       />
    //     );
    //   });
    // };

    // const updateCards = (arr) => {
    //   console.log(arr);
    //   setCards(generateCards(arr));
    // };

    //Finally create function to wait for data and setUrlList
    const updateData = async () => {
      const urls = await fetchAllCategories();
      setUrlList(urls);
      // updateCards(urlList);
    };

    updateData();
  }, []);

  // function displayCards() {
  //   console.log("Display Cards Ran");
  //   return (
  //     <div
  //       style={{
  //         display: "grid",
  //         gridTemplateRows: "auto auto auto auto",
  //         gridTemplateColumns: "auto auto auto auto",
  //         gap: "15px",
  //       }}
  //       onClick={() => setTrigger(!trigger)}
  //     >
  //       {randomOrderer(urlList).map((el) => {
  //         <img src={el}></img>;
  //       })}
  //     </div>
  //   );
  // }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto auto auto",
        gridTemplateRows: "auto auto auto auto",
        gap: "15px",
      }}
    >
      {randomOrderer(urlList).map((el) => {
        return (
          <img
            src={el}
            id={el}
            height="150px"
            width="150px"
            key={uuidv4()}
            onClick={clickFunction}
          ></img>
        );
      })}
    </div>
  );
}

function WinningPage({ resetFunction }) {
  return (
    <div>
      <h1>You Got All 16!!!</h1>
      <button onClick={resetFunction}>New Game</button>
    </div>
  );
}

function FullApp() {
  console.log("Full App rendered");

  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [clickedIDs, setClickedIDs] = useState([]);
  const [currID, setCurrID] = useState("XXX");
  const [trigger, setTrigger] = useState(true);

  console.log(trigger);

  useEffect(() => {
    setTimeout(() => {
      setTrigger(!trigger);
    }, 10000);
  }, []);

  console.log(clickedIDs.slice(0, -1).includes(currID));

  if (clickedIDs.slice(0, -1).includes(currID)) {
    setClickedIDs([]);
    setCurrentScore(0);
  }

  if (currentScore > highScore && !clickedIDs.slice(0, -1).includes(currID)) {
    setHighScore(currentScore);
  }

  if (currentScore === 16) {
    return <WinningPage resetFunction={() => setCurrentScore(0)} />;
  }

  function randomizeOrder(arr) {
    const indexesTaken = [];
    const reordered = [];
    for (let i = 0; i <= 15; i++) {
      let randNum;
      do {
        randNum = Math.floor(Math.random() * 16);
      } while (indexesTaken.includes(randNum));

      reordered.push(arr[randNum]);
      indexesTaken.push(randNum);
    }
    return reordered;
  }

  function handleImageClick(e) {
    const currentID = e.target.id;
    setClickedIDs((prevIDs) => [...prevIDs, currentID]);
    setCurrID(() => e.target.id);
    setCurrentScore((prevScore) => prevScore + 1);
  }

  return (
    <div>
      <ScoreBoard highScore={highScore} currentScore={currentScore} />
      <CardDisplay
        randomOrderer={randomizeOrder}
        clickFunction={handleImageClick}
      />
    </div>
  );
}

export default FullApp;
