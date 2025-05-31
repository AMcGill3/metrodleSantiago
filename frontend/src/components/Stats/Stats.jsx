import "./Stats.css";
import exitMenu from "../../assets/exitMenu.png";
import exitMenuDark from "../../assets/exitMenuDark.svg";
import shareSymbol from "../../assets/shareSymbol.svg";
import { normalize } from "../../../../normalize.js";

export const Stats = ({
  theme,
  toggleStats,
  user,
  targetStation,
  lastPlayed,
  compareLastPlayed,
  stopsFromTarget,
}) => {
  const exit = theme === "light" ? exitMenu : exitMenuDark;
  const totalWins = () => {
    let sum = 0;
    for (const num in user?.winsInXGuesses) {
      sum += user.winsInXGuesses[num];
    }
    return sum;
  };
  const played = user?.gamesPlayed;
  const wins = totalWins();

  const findMostGuesses = () => {
    const values = Object.values(user?.winsInXGuesses || []);

    return values.length > 0 ? Math.max(...values) : 0;
  };

  const shareResults = () => {
    const gameGuesses = user.game.guesses;
    const totalGuesses = gameGuesses.length;
    let result = "";

    const gotIt = gameGuesses[totalGuesses - 1]?.name === targetStation.name;

    gameGuesses.forEach((guess, i) => {
      const hasCorrectLine = guess.lines.some((line) =>
        targetStation.lines.includes(line)
      );
      result += hasCorrectLine ? "🟩 " : "⬛ ";

      const stops = stopsFromTarget(guess.name);
      if (stops === 0) {
        result += "🚇";
      } else {
        result += `${stops} ${stops === 1 ? "stop" : "stops"} away`;
      }

      result += "\n";
    });

    if (totalGuesses === 1 && gotIt) {
      result += "🎯 1/6";
    } else if (gotIt) {
      result += `${totalGuesses}/6`;
    } else {
      result += "🛑 X/6";
    }

    result += "\n metrodle Santiago https://metrodle-santiago.com";

    return result;
  };

  return (
    <>
      <button className="exit-stats-button" onClick={toggleStats}>
        <img src={exit} className="exit-menu-img"></img>
      </button>
      <div className="figures">
        <div className="figure-item">
          <p>Jugado</p>
          <h3>{played}</h3>
        </div>
        <div className="figure-item">
          <p>Ganas</p>
          <h3>{wins}</h3>
        </div>
        <div className="figure-item">
          <p>Porcentaje Ganado</p>
          <h3>
            {" "}
            {played > 0 && wins > 0
              ? `${Math.round((wins / played) * 100)}%`
              : "0%"}
          </h3>
        </div>
        <div className="figure-item">
          <p>Racha</p>
          <h3>{user?.streak}</h3>
        </div>
        <div className="figure-item">
          <p>Racha Máxima</p>
          <h3>{user?.maxStreak}</h3>
        </div>
      </div>
      <div className="chart">
        {Array.from({ length: 6 }).map((_, i) => {
          const guessCount = i + 1;
          const winsForThisCount = user?.winsInXGuesses?.[guessCount] ?? 0;

          const isTodayCorrectGuess =
            lastPlayed &&
            user?.game?.guesses?.length === guessCount &&
            compareLastPlayed() &&
            user?.game?.guessedStationNames?.includes(
              normalize(targetStation?.name)
            );

          return (
            <div key={i} className="guess-row">
              <h3 className="number">{guessCount}</h3>
              <p
                className={`bar ${winsForThisCount === 0 ? "zero" : ""} ${
                  isTodayCorrectGuess ? "today" : ""
                } ${findMostGuesses() !== winsForThisCount ? "not-max" : ""}`}
              ></p>
              <p>{winsForThisCount}</p>
            </div>
          );
        })}
      </div>

      <div className="share-button">
        <button
          className="share"
          onClick={() => {
            const results = shareResults()
            if (navigator.share) {
              navigator.share({ results });
            } else {

              results.select();
              results.setSelectionRange(0, 99999);
              navigator.clipboard.writeText(results.valueOf())
              alert("Results copied to clipboard")
            }
          }}
        >
          Compartir
          <img src={shareSymbol} className="share-symbol"></img>
        </button>
      </div>
    </>
  );
};
