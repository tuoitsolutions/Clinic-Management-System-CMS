import React from "react";
import ReactDOM from "react-dom";
import "typeface-nunito";
// import "typeface-montserrat";
import App from "./App";
import DefaultValuesApi from "./Services/Api/DefaultValuesApi";

ReactDOM.render(<App />, document.getElementById("root"));

const initializeDocument = async () => {
  const logo = await DefaultValuesApi.getHospitalLogoApi();

  if (logo.data) {
    var link: any =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = `data:image/png;base64,` + logo.data;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
};

initializeDocument();
