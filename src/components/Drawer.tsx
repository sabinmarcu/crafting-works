import React, { FC, useEffect } from "react";
import {
  SwipeableDrawer,
  AppBar,
  Toolbar,
  Container,
  Typography
} from "@material-ui/core";
import styled from "styled-components";

import { useDrawer } from "../state/drawer";
import { SymbolsList } from "./SymbolsList";
import { useHistory } from "react-router";

const StyledDrawer = styled(SwipeableDrawer)`
  .styledPaper {
    min-width: min(100vw, 300px);
    max-width: 500px;
  }
  .styledRoot {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-start;
  }
`;

const StyledAppBar = styled(AppBar)`
  margin-bottom: 1.5rem;
`;

export const Drawer: FC = () => {
  const { isOpen, open, close } = useDrawer();
  return (
    <StyledDrawer
      disableSwipeToOpen={false}
      open={isOpen}
      onOpen={open}
      onClose={close}
      classes={{ paper: "styledPaper", root: "styledRoot" }}
    >
      <StyledAppBar position="static">
        <Toolbar>
          <Container>
            <Typography variant="h4">Symbols</Typography>
          </Container>
        </Toolbar>
      </StyledAppBar>
      <SymbolsList />
    </StyledDrawer>
  );
};

export const RouteChangeDrawerClose: FC = () => {
  const history = useHistory();
  const { close } = useDrawer();
  useEffect(
    () =>
      history.listen(() => {
        close();
      }),
    [history, close]
  );
  return <></>;
};
