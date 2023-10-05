import {FlowShapeModel, PointModel} from "@syncfusion/ej2-diagrams";

export class CreateWhiteBoardCommand {
  title: string;
  constructor(title: string) {
    this.title = title;
  }
}

export class AddNodeCommand {
  whiteBoardId: string;
  shape: any;
  position: PointModel;
  public width: number;
  public height: number;
}
