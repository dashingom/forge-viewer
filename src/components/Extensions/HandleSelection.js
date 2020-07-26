import Looks3Icon from "@material-ui/icons/Looks3";

const Autodesk = window.Autodesk;
export class HandleSelectionExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.viewer = viewer;
    this._group = null;
    this._button = null;
    this._button1 = null;
  }

  static get ExtensionId() {
    return "HandleSelection";
  }

  load() {
    console.log("HandleSelectionExtension has been loaded");
    this.onToolbarCreated();
    return true;
  }

  unload() {
    // Clean our UI elements if we added any
    if (this._group) {
      this._group.removeControl(this._button);
      if (this._group.getNumberOfControls() === 0) {
        this.viewer.toolbar.removeControl(this._group);
      }
    }
    console.log("HandleSelectionExtension has been unloaded");
    return true;
  }

  onToolbarCreated() {
    // Create a new toolbar group if it doesn't exist
    this._group = this.viewer.toolbar.getControl(
      "allMyAwesomeExtensionsToolbar"
    );
    if (!this._group) {
      this._group = new Autodesk.Viewing.UI.ControlGroup(
        "allMyAwesomeExtensionsToolbar"
      );
      this.viewer.toolbar.addControl(this._group);
    }

    // Add a new button to the toolbar group
    this._button = new Autodesk.Viewing.UI.Button(
      "handleSelectionExtensionButton"
    );
    this._button.onClick = ev => {
      // Get current selection
      const selection = this.viewer.getSelection();
      this.viewer.clearSelection();
      // Anything selected?
      if (selection.length > 0) {
        // Iterate through the list of selected dbIds
        selection.forEach(dbId => {
          // Get properties of each dbId
          this.viewer.getProperties(dbId, props => {
            var red = new THREE.Vector4(1, 0, 0, 0.5);
            this.viewer.setThemingColor(selection, red);
          });
        });
      }
    };
    this._button.setToolTip("Change Model Color");
    this._button.addClass("redButton");

    this._group.addControl(this._button);
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  HandleSelectionExtension.ExtensionId,
  HandleSelectionExtension
);
