import {
  FC,
  useEffect,
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
  withTheme,
  Theme,
  CardHeader,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';

import {
  onMobile,
  RightCardActions,
  ModalContainer,
  ModalWrapper,
  ModalContent,
} from '../styled';
import { camelCaseToCapitalized } from '../../utils/strings';
import { RecipeAST } from '../../utils/types';
import { usePreventScroll } from '../../hooks/scroll';
import { AST } from './Tree';

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

export const Visualization: FC<{
  ast?: RecipeAST,
  title: string,
  styleLeafNodes?: boolean,
}> = ({
  ast,
  title,
  styleLeafNodes = true,
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
      {humanReadableAst && (
      <AST
        data={humanReadableAst}
        styleLeafNodes={styleLeafNodes}
      />
      )}
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
                {humanReadableAst && (
                <AST
                  data={humanReadableAst}
                  styleLeafNodes={styleLeafNodes}
                />
                )}
              </LargeModalContent>
            </LargeModalWrapper>
          </LargeModalContainer>
        </Fade>
      </Modal>
    </>
  );
};
