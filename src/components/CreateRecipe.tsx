import React, {
  useState,
  useCallback,
  FC,
  ChangeEvent,
} from 'react';

import {
  Fab,
  Modal,
  Backdrop,
  Fade,
  CardHeader,
  TextField,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Measure, { BoundingRect } from 'react-measure';
import styled from 'styled-components';

import {
  ModalContainer,
  ModalContent,
  ModalWrapper,
  RightCardActions,
} from './styled';
import { useRecipes } from '../state/recipes-v3';
import { capitalizedToCamelCase } from '../utils/strings';

export const FabWrapper = styled.div`
  position: fixed;
  bottom: 25px;
  right: 25px;
`;

const Spacer = styled.div`
  width: 100%;
`;

export const CreateRecipeModal: FC<{
  open: boolean,
  onClose: () => void,
}> = ({
  open,
  onClose,
}) => {
  const { addRecipe } = useRecipes();
  const [name, setName] = useState<string>('');
  const close = useCallback(
    () => {
      setName('');
      onClose();
    },
    [setName, onClose],
  );
  const onChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setName(value),
    [setName],
  );
  const onSave = useCallback(
    () => {
      addRecipe(capitalizedToCamelCase(name));
      close();
    },
    [name, close],
  );
  return (
    <Modal
      open={open}
      onClose={close}
      closeAfterTransition
      disableEnforceFocus
      disableAutoFocus
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <ModalContainer>
          <ModalWrapper elevation={10}>
            <CardHeader title="Create new Recipe" />
            <ModalContent>
              <TextField
                fullWidth
                label="Short Name"
                value={name}
                onChange={onChange}
              />
            </ModalContent>
            <RightCardActions>
              <Button color="primary" variant="contained" onClick={onSave}>Save</Button>
              <Button color="secondary" onClick={close}>Cancel</Button>
            </RightCardActions>
          </ModalWrapper>
        </ModalContainer>
      </Fade>
    </Modal>
  );
};

export const CreateRecipeWrapper: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const close = useCallback(
    () => setIsOpen(false),
    [setIsOpen],
  );
  const open = useCallback(
    () => setIsOpen(true),
    [setIsOpen],
  );
  const [size, setSize] = useState<BoundingRect>();
  return (
    <>
      <Measure
        bounds
        onResize={({ bounds }) => setSize(bounds)}
      >
        {({ measureRef }) => (
          <FabWrapper ref={measureRef}>
            <Fab onClick={open} color="primary">
              <AddIcon />
            </Fab>
          </FabWrapper>
        )}
      </Measure>
      <Spacer style={{
        height: size
          ? size.height + 50
          : 50,
      }}
      />
      <CreateRecipeModal open={isOpen} onClose={close} />
    </>
  );
};

export default CreateRecipeWrapper;
