import React, { useState } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { TerminalHttpProvider } from "@terminal-packages/sdk";
import Web3 from "web3";

import { setSource, setWeb3Version } from "./constants";
import MainContent from "./components/MainContent";

const App = () => {
  const [values, setValues] = useState({
    apiKey: "Z0CsA9B5xAkCjfw0kcKh6g==",
    projectId: "MrBOKJVOnrlAgnRw"
  });

  const getLibrary = provider => {
    if (provider._metamask) {
      return new Web3(window.terminal.ethereum);
    } else {
      return new Web3(
        new TerminalHttpProvider({
          customHttpProvider: provider,
          apiKey: values.apiKey,
          projectId: values.projectId,
          source: setSource(provider),
          web3Version: setWeb3Version(provider)
        })
      );
    }
  };

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MainContent setValues={setValues} values={values} />
    </Web3ReactProvider>
  );
};

export default App;
