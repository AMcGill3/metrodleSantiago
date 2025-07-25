import "./CorrectStation.css"

export const CorrectStation = ({
  targetStation
}) => {
  return (
    <>
      <h4>La próxima estación es:</h4>
      <h2>
        {targetStation?.name}
      </h2>
      <h6>Deje bajar antes de subir</h6>
    </>
  )
}