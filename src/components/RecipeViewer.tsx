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
  withTheme,
  Theme,
  Backdrop,
  Fade,
  Modal,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import styled from 'styled-components';

import Tree from 'react-d3-tree';
import Measure, { BoundingRect } from 'react-measure';

import { TabContext, TabPanel } from '@material-ui/lab';
import { RecipeAST } from '../utils/types';
import {
  useAST,
  useUses,
  useRecipe,
  useResources,
  useSteps,
} from '../state/recipes-v3';

import {
  ModalContainer,
  ModalContent,
  ModalWrapper,
  onMobile,
  RightCardActions,
  StyledTabs,
} from './styled';

import { camelCaseToCapitalized } from '../utils/strings';
import { Title } from '../state/title';
import { useIsMobile } from '../hooks/useIsMobile';

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

export const SVGCard = styled(Card)`
  display: flex;
  flex-flow: column nowrap;
`;

export const SVGWrapper = styled(CardContent)`
  width: 100%;
  height: 500px;
  ${onMobile} {
    height: 300px;
  }
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
`;

const svgStyle = ({
  theme: {
    palette: {
      background: {
        default: background,
      },
      text: {
        primary: text,
      },
    },
    shadows: [shadow],
  },
}: { theme: Theme }) => `
  background: ${background};
  color: ${text};
  box-shadow: ${shadow};
`;

export const SVG = withTheme(
  styled.div`
    width: 100%;
    height: 100%;
    ${svgStyle}
    .linkBase {
      stroke: currentColor;
      opacity: 0.5 !important;
    }
    .nodeBase, .nodeNameBase, .leafNodeBase {
      fill: currentColor;
      stroke: transparent;
    }
  `,
);

export const LargeModalContent = styled(ModalContent)`
  height: calc(95vh - 100px);
  flex: 0;
  display: flex;
  flex-flow: column nowrap;
`;

export const LargeModalContainer = styled(ModalContainer)`
  max-width: initial !important;
`;

export const AST: FC<{
  data: RecipeAST
}> = ({
  data,
}) => {
  const [size, setSize] = useState<BoundingRect>();
  const translate = useMemo(
    () => (size
      ? ({
        x: size.width / 2,
        y: size.height / 2,
      })
      : undefined),
    [size],
  );
  return (
    <SVGWrapper>
      <Measure
        bounds
        onResize={({ bounds }) => setSize(bounds)}
      >
        {({ measureRef }) => (
          <SVG ref={measureRef}>
            <Tree
              data={data}
              orientation="vertical"
              collapsible={false}
              translate={translate}
              nodeSize={{
                x: 200,
                y: 200,
              }}
              textLayout={{
                textAnchor: 'start',
                y: 0,
                x: 15,
              }}
            />
          </SVG>
        )}
      </Measure>
    </SVGWrapper>
  );
};

export const Visualization: FC<{
  ast?: RecipeAST,
  title: string,
}> = ({
  ast,
  title,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const open = useCallback(
    () => setModalOpen(true),
    [setModalOpen],
  );
  const close = useCallback(
    () => setModalOpen(false),
    [setModalOpen],
  );
  const humanReadableAst = useMemo(
    () => {
      if (!ast) {
        return undefined;
      }
      const updateNode = ({ name, children }: RecipeAST): RecipeAST => ({
        name: camelCaseToCapitalized(name),
        ...(children
          ? { children: children.map(updateNode) }
          : {}),
      });
      return updateNode(ast);
    },
    [ast],
  );
  return (
    <>
      {humanReadableAst && <AST data={humanReadableAst} />}
      <RightCardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={open}
        >
          View Large
        </Button>
      </RightCardActions>
      <Modal
        open={modalOpen}
        onClose={close}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <LargeModalContainer>
            <ModalWrapper elevation={10}>
              <CardHeader
                title={`Large View: ${title}`}
                action={(
                  <IconButton onClick={close}>
                    <CloseIcon />
                  </IconButton>
              )}
              />
              <LargeModalContent>
                {humanReadableAst && <AST data={humanReadableAst} />}
              </LargeModalContent>
            </ModalWrapper>
          </LargeModalContainer>
        </Fade>
      </Modal>
    </>
  );
};

export const ASTPreview: FC = () => {
  const ast = useAST();
  const uses = useUses();
  const isMobile = useIsMobile();
  const tabs = useMemo(
    () => [
      { title: 'Dependencies', ast },
      { title: 'Uses', ast: uses },
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
        {tabs.map(({ title, ast: tree }) => (
          <TabPanel value={title} key={title}>
            <Visualization ast={tree} title={title} />
          </TabPanel>
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
