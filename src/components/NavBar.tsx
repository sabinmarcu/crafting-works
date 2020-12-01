import React, { FC } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  Typography,
  IconButton
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import styled from "styled-components";

import { useDrawer } from "../state/drawer";
import { useTitle } from "../state/title";

import { StyledLink } from "./styled";

const StyledContainer = styled(Container)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

const StyledIconButton = styled(IconButton)`
  color: white;
`;

const StyledTypography = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NavBar: FC = () => {
  const { open } = useDrawer();
  const { title, isRoot } = useTitle();
  return (
    <AppBar position="static">
      <Toolbar>
        <StyledContainer>
          <StyledTypography variant="body1">
            {!isRoot && (
              <StyledLink to="/">
                <StyledIconButton>
                  <ArrowBackIcon />
                </StyledIconButton>
              </StyledLink>
            )}
            {title}
          </StyledTypography>
          <Button
            variant="contained"
            color="primary"
            onClick={open}
            disableElevation
          >
            Recipes Book
          </Button>
        </StyledContainer>
      </Toolbar>
    </AppBar>
  );
};
