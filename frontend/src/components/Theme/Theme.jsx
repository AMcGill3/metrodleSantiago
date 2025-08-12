import "./Theme.css";
import exitButton from "../../assets/exitMenu.png";
import exitButtonDark from "../../assets/exitMenuDark.svg";
import { useEffect } from "react";

export const Theme = ({
  toggleThemePanel,
  showThemePanel,
  currentTheme,
  setSelectedTheme,
  selectedTheme,
}) => {
  const exit = currentTheme === "light" ? exitButton : exitButtonDark;

  const toggleTheme = (mode) => {
    setSelectedTheme(mode);
    localStorage.setItem("theme", mode);
  };

  useEffect(() => {
    const handleEsc = async (e) => {
      if (showThemePanel && e.key === "Escape") {
        toggleThemePanel();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showThemePanel, toggleThemePanel]);

  return (
    <>
      <button
        className="close-theme-selector"
        onClick={toggleThemePanel}
        alt={"salir de la sección tema"}
      >
        <img src={exit} className="exit-menu-img" alt={""}></img>
      </button>
      <h1>Tema</h1>
      <div className="theme-buttons">
        <button
          className={`theme-button ${
            selectedTheme === "system" ? "selected" : ""
          }`}
          alt={"Predeterminado"}
          onClick={() => toggleTheme("system")}
        >
          Predeterminado
        </button>
        <button
          className={`theme-button ${
            selectedTheme === "light" ? "selected" : ""
          }`}
          alt={"Claro"}
          onClick={() => toggleTheme("light")}
        >
          Claro
        </button>
        <button
          className={`theme-button ${
            selectedTheme === "dark" ? "selected" : ""
          }`}
          alt={"Claro"}
          onClick={() => toggleTheme("dark")}
        >
          Oscuro
        </button>
      </div>
    </>
  );
};
