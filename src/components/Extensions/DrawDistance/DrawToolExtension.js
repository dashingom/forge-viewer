import DrawTool from "./DrawTool";
const Autodesk = window.Autodesk;
const BoxDrawToolName = "box-draw-tool";
const SphereDrawToolName = "sphere-draw-tool";
const DrawToolOverlay = "draw-tool-overlay";

export default class DrawToolExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.tool = new DrawTool();
  }

  load() {
    this.viewer.toolController.registerTool(this.tool);
    this.viewer.impl.createOverlayScene(DrawToolOverlay);
    this._createUI();
    console.log("DrawToolExtension loaded.");
    return true;
  }

  unload() {
    this.viewer.toolController.deregisterTool(this.tool);
    this.viewer.impl.removeOverlayScene(DrawToolOverlay);
    this._removeUI();
    console.log("DrawToolExtension unloaded.");
    return true;
  }

  onToolbarCreated() {
    this._createUI();
  }

  _createUI() {
    const toolbar = this.viewer.toolbar;
    if (toolbar && !this.group) {
      const controller = this.viewer.toolController;
      this.button1 = new Autodesk.Viewing.UI.Button("box-draw-tool-button");
      this.button1.onClick = ev => {
        if (controller.isToolActivated(BoxDrawToolName)) {
          controller.deactivateTool(BoxDrawToolName);
          this.button1.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
        } else {
          controller.deactivateTool(SphereDrawToolName);
          controller.activateTool(BoxDrawToolName);
          this.button2.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
          this.button1.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
        }
      };
      this.button1.setToolTip("Box Draw Tool");

      this.button2 = new Autodesk.Viewing.UI.Button("sphere-draw-tool-button");
      this.button2.onClick = ev => {
        if (controller.isToolActivated(SphereDrawToolName)) {
          controller.deactivateTool(SphereDrawToolName);
          this.button2.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
        } else {
          controller.deactivateTool(BoxDrawToolName);
          controller.activateTool(SphereDrawToolName);
          this.button1.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
          this.button2.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
        }
      };
      this.button2.setToolTip("Sphere Draw Tool");

      this.group = new Autodesk.Viewing.UI.ControlGroup("draw-tool-group");
      this.group.addControl(this.button1);
      this.group.addControl(this.button2);
      toolbar.addControl(this.group);
    }
  }

  _removeUI() {
    if (this.group) {
      this.viewer.toolbar.removeControl(this.group);
      this.group = null;
    }
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  "DrawToolExtension",
  DrawToolExtension
);
