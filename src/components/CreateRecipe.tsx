import React, {
  useState,
  useCallback,
  FC,
  useMemo,
  useEffect,
} from 'react';

import {
  Modal,
  Backdrop,
  Fade,
  CardHeader,
  TextField,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router';
import {
  ModalContainer,
  ModalContent,
  ModalWrapper,
  RightCardActions,
} from './styled';

import { useRecipes } from '../state/recipes-v3';
import { camelCaseToCapitalized, capitalize, capitalizedToCamelCase } from '../utils/strings';
import { SymbolType } from '../utils/types';
import { baseRoute } from '../screens/Recipe';

import { BottomFab } from './BottomFab';
import { usePreventScroll } from '../hooks/scroll';

type ComboBoxAddType = {inputValue?: string};
const filter = createFilterOptions<SymbolType & ComboBoxAddType>();

export const CreateRecipeModal: FC<{
  open: boolean,
  onClose: () => void,
}> = ({
  open,
  onClose,
}) => {
  const history = useHistory();
  const scrollPrevent = usePreventScroll();
  const { symbols, addRecipe } = useRecipes();
  const availableSymbols = useMemo(
    () => symbols.filter(({ composite }) => !composite),
    [symbols],
  );
  const [newSymbol, setNewSymbol] = useState<SymbolType & ComboBoxAddType | null>(null);
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
        const symbol = capitalizedToCamelCase(name.trim());
        addRecipe(symbol);
        history.push([
          baseRoute.replace(':name', symbol),
          'edit',
        ].join('/'));
      }
      close();
    },
    [name, close, history],
  );
  useEffect(
    () => {
      if (open) {
        scrollPrevent.open();
      } else {
        scrollPrevent.close();
      }
    },
    [open, scrollPrevent],
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
                      name: `Add "${capitalize(params.inputValue)}"`,
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
  return (
    <>
      <BottomFab Icon={AddIcon} onClick={open} />
      <CreateRecipeModal open={isOpen} onClose={close} />
    </>
  );
};

export default CreateRecipeWrapper;
