import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Card,
  CardActions,
  CardContent,
  Container,
  Theme,
  Toolbar,
  withTheme,
} from '@material-ui/core';
import { mobileBreakpoint } from '../config/constants';

export const onMobile = `@media ${mobileBreakpoint}`;

export const toolbarStyles = ({
  theme: {
    palette: {
      background: { paper: background },
      text: { primary: text },
    },
    shadows: [,shadow],
  },
}: {theme: Theme}) => `
  background: ${background};
  color: ${text};
  box-shadow: ${shadow}
`;

export const StyledToolbar = withTheme(
  styled(Toolbar)`
    ${toolbarStyles}
  `,
);

export const StyledLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: inherit;
`;

export const ModalContainer = styled(Container)`
  padding: 25px !important;
  margin-top: 25px !important;
  display: flex !important;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  outline: 0;
  ${onMobile} {
    margin: 0;
    width: 100vw;
    height: 100vh;
    padding: 15px;
  }
`;

export const ModalWrapper = styled(Card)`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
`;

export const ModalContent = styled(CardContent)`
  flex: 1;
`;

export const RightCardActions = styled(CardActions)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
`;

export default StyledLink;
