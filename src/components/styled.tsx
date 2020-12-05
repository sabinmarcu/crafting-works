import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { mobileBreakpoint } from '../config/constants';

export const StyledLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: inherit;
`;

export const onMobile = `@media ${mobileBreakpoint}`;

export default StyledLink;
