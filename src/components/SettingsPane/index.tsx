import {
  Toolbar,
  Typography,
} from '@material-ui/core';
import { FC } from 'react';
import styled from 'styled-components';
import { StickyAppBar, StyledToolbarContainer } from '../styled';
import { ResetAll, ResetThemeSelection, ResetRecipes } from './ResetSettings';
import { Import, Export } from './ImportExportSettings';
import { StacksEnabled, StacksAmount } from './StacksSettings';

type DirectionProp = {
  direction?: 'row' | 'column'
};
export const SectionWrapper = styled.section<DirectionProp>`
  display: flex;
  flex-flow: ${({ direction }) => (direction === 'column'
    ? 'column'
    : 'row'
  )} nowrap;
  margin: 25px 20px;
  & > * {
    margin: 5px !important;
  }
`;

export const Section: FC<{
  title: string
} & DirectionProp> = ({
  title,
  children,
  direction,
}) => (
  <>
    <StickyAppBar>
      <Toolbar>
        <StyledToolbarContainer>
          <Typography variant="h5">{title}</Typography>
        </StyledToolbarContainer>
      </Toolbar>
    </StickyAppBar>
    <SectionWrapper direction={direction}>
      {children}
    </SectionWrapper>
  </>
);

export const SettingsView: FC = () => (
  <>
    <Section title="Split into Stacks" direction="column">
      <StacksEnabled />
      <StacksAmount />
    </Section>
    <Section title="Import / Export">
      <Import />
      <Export />
    </Section>
    <Section title="Reset">
      <ResetAll />
      <ResetRecipes />
      <ResetThemeSelection />
    </Section>
  </>
);

export default SettingsView;
