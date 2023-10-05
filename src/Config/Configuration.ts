import {environment} from "../environments/environment";

export class Configuration {
  static createEmptyWhiteBoardApi() {
    return environment.ongkonApi + "/WhiteBoard/Create";
  }

  static GetWhiteBoardApi(id: string) {
    return environment.ongkonApi + "/WhiteBoard?id=" + id;
  }

  static AddNodeApi() {
    return environment.ongkonApi + "/WhiteBoard/Node/Add";
  }
}
