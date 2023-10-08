import {ConnectorModel, FlowShapeModel, Point} from "@syncfusion/ej2-diagrams";

export class Node {
  public id: string;
  public shape: FlowShapeModel;
  public position: Point;
  public width: number;
  public height: number;
  public text: string;
}

export class WhiteBoard {
  public id: string;
  public title: string;
  public participants: string[];
  public nodes: Node[];
  public connectors: ConnectorModel[];
  constructor() {
    this.nodes = [];
    this.participants = [];
  }
}
