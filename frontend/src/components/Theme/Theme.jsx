import "./Theme.css";
import exitButton from "../../assets/exitMenu.png";
import exitButtonDark from "../../assets/exitMenuDark.svg";

export const Theme = ({
  toggleThemePanel,
  currentTheme,
  setSelectedTheme,
  selectedTheme,
}) => {
  const exit = currentTheme === "light" ? exitButton : exitButtonDark;

  const toggleTheme = (mode) => {
    setSelectedTheme(mode);
    localStorage.setItem("theme", mode);
  };

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
