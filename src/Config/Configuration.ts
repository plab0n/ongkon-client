import {environment} from "../environments/environment";

export class Configuration {
  static createEmptyWhiteBoardApi() {
    return environment.ongkonApi + "/WhiteBoard/Create";
  }

  static GetWhiteBoardApi(id: string) {
    return environment.ongkonApi + "/WhiteBoard?id=" + id;
  }

  static addNodeApi() {
    return environment.ongkonApi + "/WhiteBoard/Node/Add";
  }

  static getAddAnnotationApi() {
    return environment.ongkonApi + "/WhiteBoard/Node/AddAnnotation";
  }

  static addConnectorApi() {
    return environment.ongkonApi + "/WhiteBoard/Connector/Add"
  }

  static getUpdateSourcePointEndpoint() {
    return environment.ongkonApi + "/WhiteBoard/Connector/Update/SourcePoint"
  }

  static updateNodePositionApi() {
    return environment.ongkonApi + "/WhiteBoard/Node/Update/Position";
  }
}
