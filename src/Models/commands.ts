import {DecoratorModel, PointModel, StrokeStyleModel, Point} from "@syncfusion/ej2-diagrams";
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
  public text: string;
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
export class UpdateConnectorTargetPointCommand {
  whiteBoardId: string;
  connectorId: string;
  targetPoint: PointModel;
}
export class UpdateNodePositionCommand {
  whiteBoardId: string;
  nodeId: string;
  position: PointModel;
}
export class UpdateConnectorPositionCommand {
  whiteBoardId: string;
  connectorId: string;
  sourcePoint: any;
  targetPoint: any;
}
