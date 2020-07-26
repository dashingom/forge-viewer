import React, { Component } from "react";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import client from "../utils/client";
import Typography from "@material-ui/core/Typography";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import styles from "../styles/Viewer-styles";
import "./Extensions/HandleSelection";
import { toFloat } from "../utils/utils";
const Autodesk = window.Autodesk;
const THREE = window.THREE;

const modelsData = [
  {
    urn:
      "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZHJvbmUtZmxlZXQtb3B0aW1pemF0aW9uLWFwcC1kYXRhL0Ryb25lXzAxLlNMRFBSVA",
    xform: { x: -60, y: 0, z: 0 },
    angle: 0,
    title: "drone"
  },
  {
    urn:
      "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZHJvbmUtZmxlZXQtb3B0aW1pemF0aW9uLWFwcC1kYXRhL1dhcmVob3VzZV8wMS56aXA",
    xform: { x: 60, y: 0, z: 0 },
    angle: 0,
    title: "building"
  }
];

class Viewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      translation: { x: 0.0, y: 0.0, z: 0.0 },
      rotation: { x: 0.0, y: 0.0, z: 0.0 },
      scale: { x: 50.0, y: 50.0, z: 50.0 }
    };
    this.viewer = null;
    this.rotationReq = null;
    this.isRotating = true;
    this.measureExt = null;
    this.clock = new THREE.Clock();
    this.viewerDiv = React.createRef();
  }

  componentDidMount() {
    client.getAccessToken().then(token => {
      var options = {
        document: `urn:${modelsData[0].urn}`,
        env: "AutodeskProduction",
        accessToken: token.access_token
      };

      var viewerElement = this.viewerDiv.current;
      this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});
      //await this.viewer.loadExtension("Autodesk.Viewing.SceneBuilder");
      Autodesk.Viewing.Initializer(options, () => {
        this.viewer.initialize();
        this.viewer.prefs.tag("ignore-producer");
        modelsData.map(m => {
          Autodesk.Viewing.Document.load(`urn:${m.urn}`, doc => {
            var viewables = doc.getRoot().search({ type: "geometry" });
            this.viewer
              .loadDocumentNode(doc, viewables[0], {
                placementTransform: new THREE.Matrix4().setPosition(m.xform),
                keepCurrentModels: true
                //globalOffset: { x: 0, y: 0, z: 0 }
              })
              .then(this.onLoadFinished);
          });
        });
      });
    });
  }

  onLoadFinished = model => {
    if (
      model.myData.urn ===
      "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZHJvbmUtZmxlZXQtb3B0aW1pemF0aW9uLWFwcC1kYXRhL0Ryb25lXzAxLlNMRFBSVA"
    ) {
      this.activeModel = model;
      this.rotateDrone(model);
    }
    this.viewer.loadExtension("HandleSelection");
  };

  rotateDrone = () => {
    let { translation, scale } = this.state;
    //this.rotationReq = window.requestAnimationFrame(this.rotateDrone);
    let model = this.activeModel;
    const modelScale = model.getUnitScale();

    const fragCount = model.getFragmentList().fragments.fragId2dbId.length;

    this.refScale = this.refScale || modelScale;

    if (modelScale !== this.refScale) {
      scale = modelScale / this.refScale;
    }

    var elapsed = this.clock.getElapsedTime();

    // fragIds range from 0 to fragCount-1
    for (var fragId = 0; fragId < fragCount; ++fragId) {
      const fragProxy = this.viewer.impl.getFragmentProxy(model, fragId);

      fragProxy.getAnimTransform();
      fragProxy.scale = new THREE.Vector3(scale.x, scale.y, scale.z);

      fragProxy.position = translation;

      fragProxy.updateAnimTransform();
    }
    this.viewer.impl.sceneUpdated(true);
  };

  componentWillUnmount() {
    if (this.viewer) {
      this.viewer.tearDown();
      this.viewer.finish();
      this.viewer = null;
    }
    cancelAnimationFrame(this.rotationReq);
  }

  handleDrawerToggle = () => {};

  handleToggle = () => {
    if (this.isRotating) {
      cancelAnimationFrame(this.rotationReq);
      this.isRotating = false;
    } else {
      this.rotateDrone();
      this.isRotating = true;
    }
  };

  handleInput = e => {
    let name = e.target.name,
      value = e.target.value;
    let translation = { ...this.state.translation, [name]: toFloat(value) };
    this.setState({
      translation: translation
    });
  };

  handleScaleInput = e => {
    let name = e.target.name,
      value = e.target.value;
    let scale = { ...this.state.scale, [name]: parseFloat(value) };
    this.setState({
      scale
    });
  };

  onTranslate = async () => {
    //await this.getMeasurement();
    let measureExt = this.viewer.getExtension("Autodesk.Measure");
    measureExt.deleteCurrentMeasurement();
    this.rotateDrone();
  };

  activeMeasureTool = () => {
    let measureExt = this.viewer.getExtension("Autodesk.Measure");
    measureExt.activate("distance");
  };

  getMeasurement = () => {
    let measureExt = this.viewer.getExtension("Autodesk.Measure");
    if (measureExt.activeStatus) {
      let measurement = measureExt.getMeasurement();
      console.log(measurement);
      let translation = {
        ...this.state.translation,
        ...{
          x: parseFloat(measurement.deltaX.split(" ")[0]),
          y: parseFloat(measurement.deltaY.split(" ")[0]),
          z: parseFloat(measurement.deltaZ.split(" ")[0])
        }
      };
      this.setState({
        translation: translation
      });
    }
  };

  render() {
    console.log(this.state);
    const { classes } = this.props;
    const { translation, scale } = this.state;
    return (
      <Grid container className={classes.root}>
        <Grid item xs={3} className={clsx(classes.item)}>
          <div className={classes.toolbarIe11}>
            <div className={classes.toolbar}>
              <Link
                className={classes.title}
                href="/"
                onClick={this.handleDrawerToggle}
                variant="h6"
                color="inherit"
              >
                Forge Viewer
              </Link>
            </div>
          </div>
          <Divider />
          <form className={classes.form} noValidate autoComplete="off">
            <Typography variant="subtitle2" gutterBottom>
              Translation
            </Typography>
            <TextField
              name="x"
              id="x"
              label="x"
              value={translation.x}
              onChange={this.handleInput}
            />
            <TextField
              name="y"
              id="y"
              label="y"
              value={translation.y}
              onChange={this.handleInput}
            />
            <TextField
              name="z"
              id="z"
              label="z"
              value={translation.z}
              onChange={this.handleInput}
            />

            <Typography variant="subtitle2" gutterBottom>
              Scale
            </Typography>
            <TextField
              name="x"
              id="x"
              label="x"
              value={scale.x}
              onChange={this.handleScaleInput}
            />
            <TextField
              name="y"
              id="y"
              label="y"
              value={scale.y}
              onChange={this.handleScaleInput}
            />
            <TextField
              name="z"
              id="z"
              label="z"
              value={scale.z}
              onChange={this.handleScaleInput}
            />
          </form>
          <List>
            <ListItem className={classes.itemLeaf} disableGutters>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={this.activeMeasureTool}
              >
                Measure
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={this.getMeasurement}
              >
                Get Measure
              </Button>
            </ListItem>
            <ListItem className={classes.itemLeaf} disableGutters>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={this.onTranslate}
                startIcon={<PlayArrowIcon />}
              >
                Play
              </Button>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={9} className={clsx(classes.item)}>
          <div className="viewer-container" ref={this.viewerDiv} />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Viewer);
