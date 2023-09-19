import { Component, ViewEncapsulation, ViewChild, Inject } from "@angular/core";
import { DiagramComponent } from "@syncfusion/ej2-angular-diagrams";
import {
  Diagram,
  NodeModel,
  UndoRedo,
  ConnectorModel,
  PointPortModel,
  Connector,
  FlowShapeModel,
  SymbolInfo,
  IDragEnterEventArgs,
  SnapSettingsModel,
  MarginModel,
  TextStyleModel,
  StrokeStyleModel,
  OrthogonalSegmentModel,
  Node,
  PaletteModel
} from "@syncfusion/ej2-diagrams";
import { ExpandMode } from "@syncfusion/ej2-navigations";
import { paletteIconClick } from "./script/diagram-common";
Diagram.Inject(UndoRedo);

/**
 * Default FlowShape sample
 */

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @ViewChild("diagram")
  //Diagram Properties
  public diagram: DiagramComponent;
  constructor() {}
  //SymbolPalette Properties
  public symbolMargin: MarginModel = {
    left: 15,
    right: 15,
    top: 15,
    bottom: 15
  };
  public expandMode: ExpandMode = "Multiple";
  //Initialize the flowshapes for the symbol palatte
  private nodes: NodeModel[] = [
    {
      id: "HTML",
      //sets the type of the shape as HTML
      shape: {
        type: "HTML",
        content:
          '<div style="background: #6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>'
      }
    }
  ];
  getFlowShapes(): NodeModel[] {
    let flowShapes: NodeModel[] = [{
              id: 'process',
              shape: {
                  type: 'Flow',
                  shape: 'Process'
              }
          },
          {
              id: 'document',
              shape: {
                  type: 'Flow',
                  shape: 'Document'
              }
          },
          {
              id: 'predefinedprocess',
              shape: {
                  type: 'Flow',
                  shape: 'PreDefinedProcess'
              }
          },
      ];
      return flowShapes;
  }
  public palettes: PaletteModel[] = [
    {
      id: "flow",
      expanded: true,
      symbols: this.getFlowShapes(),
      iconCss: "shapes",
      title: "HTML Shapes"
    }
  ];

  public getSymbolInfo(symbol: NodeModel): SymbolInfo {
    return { fit: true };
  }

  public getSymbolDefaults(symbol: NodeModel): void {
    symbol.style.strokeColor = "#757575";
    symbol.width = 100;
    symbol.height = 100;
  }
}
