import {DecoratorModel, PointModel, StrokeStyleModel} from "@syncfusion/ej2-diagrams";
export class CreateWhiteBoardCommand{
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
export class AddNodeAnnotationCommand {
  whiteBoardId: string;
  nodeId: string;
  text: string;
}
export class AddConnectorCommand {
  whiteBoardId: string;
  type: string;
  sourcePoint: PointModel;
  targetPoint: PointModel;
  //style: StrokeStyleModel;
  //targetDecorator: DecoratorModel;

}
export class UpdateConnectorSourcePointCommand {
  whiteBoardId: string;
  connectorId: string;
  sourcePoint: PointModel;

}
