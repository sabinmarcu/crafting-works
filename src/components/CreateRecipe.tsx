import React, {
  useState,
  useCallback,
  FC,
  useMemo,
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

import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import {
  ModalContainer,
  ModalContent,
  ModalWrapper,
  RightCardActions,
} from './styled';
import { useRecipes } from '../state/recipes-v3';
import { camelCaseToCapitalized, capitalizedToCamelCase } from '../utils/strings';
import { SymbolType } from '../utils/types';

export const FabWrapper = styled.div`
  position: fixed;
  bottom: 25px;
  right: 25px;
`;

const Spacer = styled.div`
  width: 100%;
`;

type ComboBoxAddType = {inputValue?: string};
const filter = createFilterOptions<SymbolType & ComboBoxAddType>();

export const CreateRecipeModal: FC<{
  open: boolean,
  onClose: () => void,
}> = ({
  open,
  onClose,
}) => {
  const { symbols, addRecipe } = useRecipes();
  const availableSymbols = useMemo(
    () => symbols.filter(({ composite }) => !composite),
    [symbols],
  );
  const [newSymbol, setNewSymbol] = useState<SymbolType & ComboBoxAddType | null>(null);
  // useEffect(
  //   () => {
  //     if (newSymbol) {
  //       addInput(newSymbol.name);
  //       setNewSymbol(null);
  //     }
  //   },
  //   [newSymbol, addInput, setNewSymbol],
  // );
  const name = useMemo(
    () => newSymbol?.name,
    [newSymbol],
  );
  const close = useCallback(
    () => {
      setNewSymbol(null);
      onClose();
    },
    [setNewSymbol, onClose],
  );
  const onSave = useCallback(
    () => {
      if (name) {
        addRecipe(capitalizedToCamelCase(name));
      }
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
              <Autocomplete
                value={newSymbol}
                onChange={(_, newValue) => {
                  if (typeof newValue === 'string') {
                    setNewSymbol({ name: newValue, composite: false });
                  } else if (newValue && newValue.inputValue) {
                    setNewSymbol({ name: newValue.inputValue, composite: false });
                  } else if (newValue) {
                    setNewSymbol(newValue);
                  } else {
                    setNewSymbol(null);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  // Suggest the creation of a new value
                  if (params.inputValue !== '') {
                    filtered.push({
                      inputValue: params.inputValue,
                      name: `Add "${params.inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={availableSymbols as (SymbolType & ComboBoxAddType)[]}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') {
                    return option;
                  }
                  if (option && option.inputValue) {
                    return option.inputValue;
                  }
                  return option.name;
                }}
                renderOption={({ name: n }) => camelCaseToCapitalized(n)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Add Recipe"
                  />
                )}
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
