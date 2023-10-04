import {environment} from "../environments/environment";

export class Configuration {
  static createEmptyWhiteBoardApi() {
    return environment.ongkonApi + "/WhiteBoard/Create";
  }
}
