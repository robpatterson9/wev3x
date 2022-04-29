import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  Fab,
  TextField,
  Grid,
  ButtonBase,
  Typography
} from "@material-ui/core";

import Twitter from "../assets/Twitter";
import Medium from "../assets/Medium";
import Github from "../assets/Github";
import Hex from "../assets/Hex";

import { connectorNames, connectorTypes, SOCIAL_LINKS } from "../constants";
import useStyles from "./styles";

const MainContent = ({ values, setValues }) => {
  const context = useWeb3React();
  const classes = useStyles();
  const [activeConnector, setActiveConnector] = useState();
  const [blockNumber, setBlockNumber] = useState();
  const [balance, setBalance] = useState();

  const {
    library,
    account,
    activate,
    connector,
    chainId,
    deactivate
  } = context;

  useEffect(() => {
    if (library) {
      let stale = false;

      library.eth
        .getBlockNumber()
        .then(r => {
          if (!stale) {
            setBlockNumber(r);
          }
        })
        .catch(e => {
          console.log(e);
          if (!stale) {
            setBlockNumber(null);
          }
        });
      return () => {
        stale = true;
        setBlockNumber(null);
      };
    }
  }, [library, chainId]);

  useEffect(() => {
    if (library && account) {
      let stale = false;

      library.eth
        .getBalance(account)
        .then(r => {
          if (!stale) {
            setBalance(library.utils.fromWei(r, "ether"));
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null);
          }
        });

      return () => {
        stale = true;
        setBlockNumber(null);
      };
    }
  }, [library, account, chainId]);

  const handleChange = prop => event => {
    if (connector) {
      deactivate(connector);
    }
    setValues({ ...values, [prop]: event.target.value });
  };

  const signMessage = () => {
    library.eth.sign("Hello Terminal!", account).then(console.log);
  };

  return (
    <div className={classes.root}>
      <div className={classes.appContainer}>
        <div className={classes.contentContainer}>
          <Typography className={classes.title}>
            Web3-React Logging Sandbox
          </Typography>
          <div className={classes.connectorInfoContainer}>
            <Typography className={classes.info}>
              ChainId: {chainId || "None"}
            </Typography>
            <Typography className={classes.info}>
              Account: {account || "None"}
            </Typography>
            <Typography className={classes.info}>
              Block Number: {blockNumber || "None"}
            </Typography>
            <Typography className={classes.info}>
              Balance: {balance || "None"}
            </Typography>
          </div>
          <div className={classes.optionsContainer}>
            {Object.keys(connectorTypes).map(con => {
              const current = connectorTypes[con];
              const disabled = current === connector;
              const name = connectorNames[con];

              return (
                <Grid item sm={4} key={con}>
                  <Fab
                    key={con}
                    onClick={() => {
                      setActiveConnector(current);
                      activate(connectorTypes[con]);
                    }}
                    disabled={disabled}
                    className={classes.optionButton}
                  >
                    <div className={classes.optionButton}>{name}</div>
                  </Fab>
                </Grid>
              );
            })}
          </div>
          <div className={classes.signButtonContainer}>
            <Fab
              className={classes.optionButton}
              disabled={!activeConnector || !account}
              onClick={() => signMessage()}
            >
              <div className={classes.optionButton}>Sign Message</div>
            </Fab>
          </div>
          <div className={classes.inputsContainer}>
            <div className={classes.input}>
              <TextField
                label="apiKey"
                onChange={handleChange("apiKey")}
                value={values.apiKey}
                style={{
                  width: 250
                }}
              />
            </div>
            <div className={classes.input}>
              <TextField
                label="projectId"
                onChange={handleChange("projectId")}
                value={values.projectId}
                style={{
                  width: 250
                }}
              />
            </div>
          </div>
          <div className={classes.socialWrapper}>
            <div className={classes.githubIcon}>
              <ButtonBase
                onClick={() => window.open(SOCIAL_LINKS["GITHUB"], "_blank")}
              >
                <Github style={{ height: 35, width: 35 }} />
              </ButtonBase>
            </div>
            <div className={classes.twitterIcon}>
              <ButtonBase
                onClick={() => window.open(SOCIAL_LINKS["TWITTER"], "_blank")}
              >
                <Twitter style={{ height: 35, width: 35 }} />
              </ButtonBase>
            </div>
            <div className={classes.mediumIcon}>
              <ButtonBase
                onClick={() => window.open(SOCIAL_LINKS["MEDIUM"], "_blank")}
              >
                <Medium style={{ height: 35, width: 35 }} />
              </ButtonBase>
            </div>
            <div className={classes.terminalIcon}>
              <ButtonBase
                onClick={() => window.open(SOCIAL_LINKS["TERMINAL"], "_blank")}
              >
                <Hex style={{ height: 35, width: 35 }} />
              </ButtonBase>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
