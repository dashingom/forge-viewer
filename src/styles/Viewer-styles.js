export default theme => ({
  root: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
    position: "relative"
  },
  item: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "auto",
    borderRight: "1px solid rgba(0, 0, 0, 0.12)"
  },
  title1: { flexGrow: 1 },
  toolbarIe11: {
    display: "flex"
  },
  toolbar: {
    ...theme.mixins.toolbar,
    paddingLeft: theme.spacing(3),
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center"
  },
  button: {
    letterSpacing: 0,
    justifyContent: "flex-start",
    textTransform: "none"
  },
  itemLeaf: {
    justifyContent: "center"
  },
  form: {
    paddingLeft: 25,
    "& > *": {
      margin: theme.spacing(1),
      width: "5ch"
    }
  }
});
