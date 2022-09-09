import React from "react";
import Main from "./components/Main";
import Quiz from "./components/Quiz";

export default function App(){

  const [started, isStarted] = React.useState(false);

  return(
    started ? 
      <Quiz /> :
      <div className = "main-class">
        <Main />
        <button className = "start-button" onClick = {() => isStarted(true)}>Start</button>
      </div>
  )

}