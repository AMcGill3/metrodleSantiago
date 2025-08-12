import "./Stats.css";
import exitMenu from "../../assets/exitMenu.png";
import exitMenuDark from "../../assets/exitMenuDark.svg";
import shareSymbol from "../../assets/shareSymbol.svg";
import { useEffect } from "react";

export const Stats = ({
  currentTheme,
  toggleStats,
  showStats,
  user,
  targetStation,
  lastPlayed,
  playedToday,
  stopsFromTarget,
  checkWin,
  puzzleNumber,
}) => {
  const exit = currentTheme === "light" ? exitMenu : exitMenuDark;
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
    let result = `Metrodle Santiago # ${puzzleNumber} \n`;

    const gotIt = gameGuesses[totalGuesses - 1]?.name === targetStation.name;

    if (totalGuesses !== 1) {
      gameGuesses.forEach((guess, i) => {
        const hasCorrectLine = guess.lines.some((line) =>
          targetStation.lines.includes(line)
        );
        result += hasCorrectLine ? "🟩 " : "⬛ ";

        const stops = stopsFromTarget(guess.name);
        if (stops === 0) {
          result += "🚇";
        } else {
          result += `${stops} ${stops === 1 ? "parada" : "paradas"} más`;
        }

        result += "\n";
      });
    }

    if (totalGuesses === 1 && gotIt) {
      result += "🟩 🎯\n1/6";
    } else if (gotIt) {
      result += `${totalGuesses}/6`;
    } else {
      result += "🛑 X/6";
    }

    result += "\nMetrodle Santiago\nhttps://metrodle-santiago.com\n";

    return result;
  };

    useEffect(() => {
      const handleEsc = async (e) => {
        if (showStats && e.key === "Escape") {
          toggleStats();
        }
      };
  
      window.addEventListener("keydown", handleEsc);
  
      return () => {
        window.removeEventListener("keydown", handleEsc);
      };
    }, [showStats, toggleStats]);

  const maxGuesses = findMostGuesses();

  return (
    <>
      <div className="top">
        <div data-testid="puzzle-number">
          Metrodle Santiago # {puzzleNumber}
        </div>
        <button
          className="exit-stats-button"
          onClick={toggleStats}
          alt={"salir de la sección estadíasticas"}
        >
          <img src={exit} className="exit-menu-img" alt={""}></img>
        </button>
      </div>
      <div className="main-area">
        <div className="figures">
          <div className="figure-item" data-testid="figure-item">
            <p>Jugado</p>
            <h3 data-testid="played">{played}</h3>
          </div>
          <div className="figure-item" data-testid="figure-item">
            <p>Ganas</p>
            <h3 data-testid="wins">{wins}</h3>
          </div>
          <div className="figure-item" data-testid="figure-item">
            <p>Porcentaje Ganado</p>
            <h3 data-testid="percent-won">
              {played > 0 && wins > 0
                ? `${Math.round((wins / played) * 100)}%`
                : "0%"}
            </h3>
          </div>
          <div className="figure-item" data-testid="figure-item">
            <p>Racha</p>
            <h3 data-testid="streak">{user?.streak}</h3>
          </div>
          <div className="figure-item" data-testid="figure-item">
            <p>Racha Máxima</p>
            <h3 data-testid="max-streak">{user?.maxStreak}</h3>
          </div>
        </div>
        <div className="chart">
          {Array.from({ length: 6 }).map((_, i) => {
            const guessCount = i + 1;
            const winsForThisCount = user?.winsInXGuesses?.[guessCount] ?? 0;

            const isTodayCorrectGuess =
              lastPlayed &&
              user?.game?.guesses?.length === guessCount &&
              playedToday &&
              checkWin();

            return (
              <div key={i} className="guess-row">
                <h3 className="number">{guessCount}</h3>
                <div
                  className={`bar ${winsForThisCount === 0 ? "zero" : ""} ${
                    isTodayCorrectGuess ? "today" : ""
                  }`}
                  style={{
                    width:
                      winsForThisCount === 0
                        ? "11px"
                        : `${(winsForThisCount / maxGuesses) * 100}%`,
                  }}
                ></div>
                <div>{winsForThisCount}</div>
              </div>
            );
          })}
        </div>

        <div className="share-button">
          <button
            className="share"
            alt={"compartir"}
            onClick={() => {
              const results = shareResults();

              if (navigator.share && playedToday) {
                navigator
                  .share({ text: results })
                  .catch((error) => console.error("Sharing failed", error));
              } else if (playedToday) {
                navigator.clipboard
                  .writeText(results)
                  .then(() => alert("Results copied to clipboard"))
                  .catch((err) => console.error("Clipboard write failed", err));
              }
            }}
          >
            Compartir
            <img src={shareSymbol} className="share-symbol" />
          </button>
        </div>
      </div>
    </>
  );
};
