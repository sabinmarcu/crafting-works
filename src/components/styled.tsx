import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Card,
  CardActions,
  CardContent,
  Container,
  Tabs,
  Theme,
  Toolbar,
  withTheme,
} from '@material-ui/core';
import { FC, ReactElement, useMemo } from 'react';
import { use100vh } from 'react-div-100vh';
import { TabPanel } from '@material-ui/lab';
import { mobileBreakpoint } from '../config/constants';
import { useIsMobile } from '../hooks/useIsMobile';

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

export const StyledTabs = withTheme(
  styled(Tabs)`
    .MuiTabs-flexContainer {
      ${toolbarStyles}
    }
  `,
);

export const StyledTabPanel = styled(TabPanel)`
  padding: 0;
`;

export const StyledLink = styled(Link)`
  &, & > * {
    text-decoration: none;
    cursor: pointer;
    color: inherit;
  }
`;

export const ModalContainerRaw = styled(Container)`
  padding: 25px;
  margin-top: 25px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  outline: 0;
  ${onMobile} {
    margin: 0;
    width: 100vw;
    padding: 15px;
    padding-left: calc(15px + env(safe-area-inset-left));
    padding-right: calc(15px + env(safe-area-inset-right));
  }
`;

export const ModalContainer: FC<{
  className?: 'string',
  style?: StyleSheetList
}> = ({
  children,
  className,
  style,
}) => {
  const isMobile = useIsMobile();
  const height = use100vh();
  const renderStyle = useMemo(
    () => ({
      ...style,
      height: (isMobile && height) || '100vh',
    }),
    [height, style],
  );
  return (
    <ModalContainerRaw
      style={renderStyle}
      className={className}
    >
      {children as ReactElement}
    </ModalContainerRaw>
  );
};

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

export const StickyAppBar = styled(AppBar)`
  position: sticky;
`;

export const StyledToolbarContainer = styled(Container)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

export const StyledCard = styled(Card)`
  display: flex;
  flex-flow: column nowrap;
`;

export const StyledExpandCardContent = styled(CardContent)`
  flex: 1;
`;

export const AutocompleteWrapper = styled.div`
  flex: 1;
`;

export const StyledContainer = styled(Container)`
  margin: 1.5rem 0;
`;

export default StyledLink;
