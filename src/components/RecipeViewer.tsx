import React, {
  FC,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import styled from 'styled-components';

import { TabContext } from '@material-ui/lab';
import {
  useAST,
  useUses,
  useRecipe,
  useResources,
  useSteps,
} from '../state/recipes-v3';

import {
  onMobile,
  StyledTabPanel,
  StyledTabs,
} from './styled';

import { camelCaseToCapitalized } from '../utils/strings';
import { Title } from '../state/title';
import { useIsMobile } from '../hooks/useIsMobile';
import { Visualization } from './Visualization';

export const StyledContainer = styled(Container)`
  display: grid !important;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem 0 !important;
  ${onMobile} {
    grid-template-columns: 1fr;
  }
`;

export const ResourceWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

export const ResourceText = styled(Typography)`
  flex: 1;
`;

export const ResourceNumber = styled(Typography)`

`;

export const SVGCard = styled(Card)`
  display: flex;
  flex-flow: column nowrap;
`;

export const ResourcePreview: FC<{
  text: string,
  amount: number
}> = ({
  text,
  amount,
}) => (
  <ResourceWrapper>
    <ResourceText>{camelCaseToCapitalized(text)}</ResourceText>
    <ResourceNumber>{amount}</ResourceNumber>
  </ResourceWrapper>
);

const ResourcesSummary: FC = () => {
  const resources = useResources();
  const rootResources = useMemo(
    () => Object.entries(resources)
      .filter(([key]) => !key.startsWith('_')),
    [resources],
  );
  return (
    <Card>
      <CardHeader title="Total Resouces" />
      <CardContent>
        {rootResources.map(
          ([key, value]) => (
            <ResourcePreview key={key} text={key} amount={value} />
          ),
        )}
      </CardContent>
    </Card>
  );
};

export const ASTPreview: FC = () => {
  const ast = useAST();
  const uses = useUses();
  const isMobile = useIsMobile();
  const tabs = useMemo(
    () => [
      { title: 'Dependencies', ast, styleLeafNodes: true },
      { title: 'Uses', ast: uses, styleLeafNodes: false },
    ],
    [ast, uses],
  );
  const [tab, setTab] = useState<string>(tabs[0].title);
  const onChange = useCallback(
    (event, newValue) => setTab(newValue),
    [setTab],
  );
  return (
    <SVGCard>
      <TabContext value={tab}>
        <StyledTabs
          value={tab}
          onChange={onChange}
          variant={isMobile ? 'fullWidth' : undefined}
        >
          {tabs.map(({ title }) => (
            <Tab
              key={title}
              value={title}
              label={title}
            />
          ))}
        </StyledTabs>
        {tabs.map(({ title, ast: tree, styleLeafNodes }) => (
          <StyledTabPanel value={title} key={title}>
            <Visualization
              ast={tree}
              title={title}
              styleLeafNodes={styleLeafNodes}
            />
          </StyledTabPanel>
        ))}
      </TabContext>
    </SVGCard>
  );
};

export const FullCol = styled.div`
  grid-row-start: 1;
  grid-row-end: 4;
  grid-column: 2;
  ${onMobile} {
    grid-row: 3;
    grid-column: 1;
  }
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  display: flex;
  flex-flow: column nowrap;
`;

export const StepsView: FC = () => {
  const steps = useSteps();
  const [active, setActive] = useState<number>(0);
  const activate = useCallback(
    (id: number) => () => setActive(id),
    [setActive],
  );
  return (
    <div>
      {steps && steps.map((step, idx) => (
        <Accordion
          key={`${idx.toString()}`}
          expanded={active === idx}
          onChange={activate(idx)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            {`Step ${idx + 1}`}
          </AccordionSummary>
          <StyledAccordionDetails>
            {step.map(
              ({ name, amount }) => (
                <ResourcePreview key={name} text={name} amount={amount} />
              ),
            )}
          </StyledAccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export const ResourcesView: FC = () => {
  const { name } = useRecipe();
  return (
    <>
      <Title title={`View: ${camelCaseToCapitalized(name)}`} />
      <StyledContainer>
        <div>
          <ResourcesSummary />
        </div>
        <FullCol>
          <ASTPreview />
        </FullCol>
        <div>
          <StepsView />
        </div>
      </StyledContainer>
    </>
  );
};

export const RecipeViewer: FC = () => (
  <ResourcesView />
);

export default RecipeViewer;
