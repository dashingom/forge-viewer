import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Viewer from "./components/Viewer";

const useStyles = makeStyles({
  root: {
    padding: 0
  }
});

function App() {
  const classes = useStyles();
  return (
    <Container maxWidth={false} className={classes.root}>
      <div className="content">
        <Viewer />
      </div>
    </Container>
  );
}

export default App;
