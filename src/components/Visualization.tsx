import {
  FC,
  useEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {
  Backdrop,
  Fade,
  Modal,
  Button,
  IconButton,
  CardContent,
  withTheme,
  Theme,
  CardHeader,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Tree from 'react-d3-tree';
import Measure, { BoundingRect } from 'react-measure';
import styled from 'styled-components';

import {
  onMobile,
  RightCardActions,
  ModalContainer,
  ModalWrapper,
  ModalContent,
} from './styled';
import { camelCaseToCapitalized } from '../utils/strings';
import { RecipeAST } from '../utils/types';
import { usePreventScroll } from '../hooks/scroll';

const getPadding = ({
  theme: { spacing },
}: { theme: Theme }) => `${spacing(2)}px`;

export const StyledCardHeader = withTheme(
  styled(CardHeader)`
    padding-left: ${getPadding};
    padding-right: ${getPadding};
    padding-left: calc(${getPadding} + env(safe-area-inset-left)) !important;
    padding-right: calc(${getPadding} + env(safe-area-inset-right)) !important;
  `,
);

export const LargeModalContainer = styled(ModalContainer)`
  max-width: initial !important;
  padding: 0 !important;
  margin: 0 !important;
`;

export const LargeModalContent = styled(ModalContent)`
  height: calc(95vh - 100px);
  flex: 0;
  display: flex;
  flex-flow: column nowrap;
  padding: 0 !important;
  ${onMobile} {
    height: auto;
    flex: 1;
  }
`;

const largePadding = 50;
export const LargeModalWrapper = styled(ModalWrapper)`
  width: calc(100% - ${largePadding * 2}px);
  height: calc(100% - ${largePadding * 2}px);
  ${onMobile} {
    height: 100%;
    width: 100%;
  }
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
  padding: 0 !important;
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
  const rootRef = useRef<HTMLDivElement>();
  useEffect(
    () => {
      const el = rootRef.current;
      if (el) {
        const handler = (event: TouchEvent) => event.preventDefault();
        el.addEventListener('touchmove',
          handler,
          { passive: false });
        return () => el.removeEventListener('touchmove', handler);
      }
      return undefined;
    },
    [rootRef],
  );
  return (
    <SVGWrapper innerRef={rootRef}>
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
  const scrollPrevent = usePreventScroll();
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
  useEffect(
    () => {
      if (modalOpen) {
        scrollPrevent.open();
      } else {
        scrollPrevent.close();
      }
    },
    [modalOpen, scrollPrevent],
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
            <LargeModalWrapper elevation={10}>
              <StyledCardHeader
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
            </LargeModalWrapper>
          </LargeModalContainer>
        </Fade>
      </Modal>
    </>
  );
};
