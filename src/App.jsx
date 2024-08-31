import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Stack from "@mui/material/Stack";
import Interactive from "./Interactive";

function App() {
  return (
    <>
      <Stack justifyContent="center">
        <h1>Sentiment Analyzer & Cloud Generator </h1>
        <Interactive />
      </Stack>
    </>
  );
}

export default App;
