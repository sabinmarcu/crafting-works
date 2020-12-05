import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Theme, Toolbar, withTheme } from '@material-ui/core';
import { mobileBreakpoint } from '../config/constants';

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

export const onMobile = `@media ${mobileBreakpoint}`;

export default StyledLink;
