import React, { FC, useState } from 'react';
import {
  AppBar,
  Container,
  Typography,
  IconButton,
} from '@material-ui/core';
import Measure, { BoundingRect } from 'react-measure';

import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MenuIcon from '@material-ui/icons/Menu';

import styled from 'styled-components';

import { useDrawer } from '../state/drawer';
import { useTitle } from '../state/title';
import { useTheme } from '../state/theme';

import { StyledLink, StyledToolbar } from './styled';

const StyledContainer = styled(Container)`
  display: flex !important;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

const StyledIconButton = styled(IconButton)`
  margin: 0 5px;
`;

const StyledTypography = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
`;

const Spacer = styled.div`
  width: 100%;
`;

export const NavBar: FC = () => {
  const { open } = useDrawer();
  const { title, isRoot } = useTitle();
  const { theme, toggle } = useTheme();
  const [size, setSize] = useState<BoundingRect>();
  return (
    <>
      <Spacer style={{ height: size?.height ?? 50 }} />
      <Measure
        bounds
        onResize={({ bounds }) => setSize(bounds)}
      >
        {({ measureRef }) => (
          <AppBar position="fixed" ref={measureRef}>
            <StyledToolbar>
              <StyledContainer>
                <StyledWrapper>
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
                </StyledWrapper>
                <StyledWrapper>
                  <StyledIconButton onClick={toggle}>
                    {theme === 'light'
                      ? <Brightness7Icon />
                      : <Brightness4Icon />}
                  </StyledIconButton>
                  <StyledIconButton onClick={open}>
                    <MenuIcon />
                  </StyledIconButton>
                </StyledWrapper>
              </StyledContainer>
            </StyledToolbar>
          </AppBar>
        )}
      </Measure>
    </>
  );
};
