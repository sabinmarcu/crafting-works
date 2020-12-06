import React, {
  FC,
  ChangeEvent,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField,
} from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import {
  useRecipe,
  useInput,
  useOutput,
  useRecipes,
} from '../state/recipes-v3';

import { Title } from '../state/title';
import { camelCaseToCapitalized } from '../utils/strings';
import { SymbolsList } from './SymbolsList';
import { onMobile, RightCardActions } from './styled';
import { SymbolType } from '../utils/types';
import { hasCircularDependency } from '../utils/calculate';
import { ConfirmDialog, useConfirm } from './Confirm';

export const StyledContainer = styled(Container)`
  display: grid !important;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem 0 !important;
  ${onMobile} {
    grid-template-columns: 1fr;
  }
`;

export const StyledTextField = styled(TextField)`
  margin: 0.5rem 0 !important;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledExpandCardContent = styled(CardContent)`
  flex: 1;
`;

export const Input: FC<{
  name: string
}> = ({
  name,
}) => {
  const [value, setValue] = useInput(name);
  const onChange = useCallback(
    ({ target: { value: v } }: ChangeEvent<HTMLInputElement>) => setValue(v),
    [setValue],
  );
  return (
    <StyledTextField
      fullWidth
      label={camelCaseToCapitalized(name)}
      value={value}
      type="number"
      onChange={onChange}
    />
  );
};

export const Output: FC = () => {
  const [value, setValue] = useOutput();
  const onChange = useCallback(
    ({ target: { value: v } }: ChangeEvent<HTMLInputElement>) => setValue(v),
    [setValue],
  );
  return (
    <StyledTextField
      fullWidth
      label="Output Number"
      value={value}
      type="number"
      onChange={onChange}
    />
  );
};

const AutocompleteWrapper = styled.div`
  flex: 1;
`;

type ComboBoxAddType = {inputValue?: string};
const filter = createFilterOptions<SymbolType & ComboBoxAddType>();

export const RecipeEditor: FC = () => {
  const {
    symbols: allSymbols,
    recipes, removeRecipe,
  } = useRecipes();
  const history = useHistory();
  const {
    name,
    symbols,
    recipe,
    addInput,
    removeInput,
  } = useRecipe();
  const comboSymbols = useMemo(
    () => {
      const usedSymbols = symbols.map(({ name: n }) => n);
      const circularSymbols = allSymbols.filter(
        ({ name: n, composite }) => {
          if (!composite) {
            return false;
          }
          return hasCircularDependency(
            { name },
            recipes[n],
            recipes,
            allSymbols,
          );
        },
      ).map(({ name: n }) => n);
      return allSymbols.filter(({ name: n }) => (
        !usedSymbols.includes(n)
        && !circularSymbols.includes(n)
        && n !== name
      ));
    },
    [symbols, allSymbols, recipes, name],
  );
  const deleteHandler = useCallback(
    (symbol: string) => (e: Event) => {
      e.preventDefault();
      removeInput(symbol);
    },
    [removeInput],
  );
  const removeHandler = useCallback(
    () => {
      removeRecipe(name);
      history.push('/');
    },
    [removeRecipe, name, history],
  );
  const { onOpen, ...confirmArgs } = useConfirm(removeHandler);
  const [newSymbol, setNewSymbol] = useState<SymbolType & ComboBoxAddType | null>(null);
  useEffect(
    () => {
      if (newSymbol) {
        addInput(newSymbol.name);
        setNewSymbol(null);
      }
    },
    [newSymbol, addInput, setNewSymbol],
  );
  if (!recipe) {
    return null;
  }
  return (
    <>
      <Title title={`Edit: ${camelCaseToCapitalized(name)}`} />
      <StyledContainer>
        <div>
          <StyledCard>
            <CardHeader title="Symbols Used" />
            <StyledExpandCardContent style={{ flex: 1 }}>
              <SymbolsList filter={false} symbols={symbols} onDelete={deleteHandler} />
            </StyledExpandCardContent>
            <RightCardActions>
              <AutocompleteWrapper>
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
                  options={comboSymbols as (SymbolType & ComboBoxAddType)[]}
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
                      label="Add Symbol"
                    />
                  )}
                />
              </AutocompleteWrapper>
              <Button
                color="secondary"
                onClick={onOpen}
              >
                Remove
              </Button>
            </RightCardActions>
          </StyledCard>
        </div>
        <div>
          <StyledCard>
            <CardHeader title="Materials" />
            <StyledExpandCardContent>
              {Object.keys(recipe.input).sort().map((it) => (
                <Input
                  name={it}
                  key={it}
                />
              ))}
            </StyledExpandCardContent>
            <CardContent>
              <Output />
            </CardContent>
          </StyledCard>
        </div>
      </StyledContainer>
      <ConfirmDialog {...confirmArgs}>
        Are you sure you want to delete this recipe (
        {name}
        )?
      </ConfirmDialog>
    </>
  );
};

export default RecipeEditor;
