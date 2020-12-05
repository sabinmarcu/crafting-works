import React, {
  useState,
  useCallback,
  FC,
  ChangeEvent,
} from 'react';
import {
  Container,
  Fab,
  Modal,
  Backdrop,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  CardActions,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import { onMobile } from './styled';
import { useRecipes } from '../state/recipes-v3';
import { capitalizedToCamelCase } from '../utils/strings';

export const FabWrapper = styled.div`
  position: fixed;
  bottom: 25px;
  right: 25px;
`;

export const ModalContainer = styled(Container)`
  padding: 0;
  margin-top: 25px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
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

export const ModalActions = styled(CardActions)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
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
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
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
          <ModalActions>
            <Button color="primary" variant="contained" onClick={onSave}>Save</Button>
            <Button color="secondary" onClick={close}>Cancel</Button>
          </ModalActions>
        </ModalWrapper>
      </ModalContainer>
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
  return (
    <>
      <FabWrapper>
        <Fab onClick={open} color="primary">
          <AddIcon />
        </Fab>
      </FabWrapper>
      <CreateRecipeModal open={isOpen} onClose={close} />
    </>
  );
};

export default CreateRecipeWrapper;
