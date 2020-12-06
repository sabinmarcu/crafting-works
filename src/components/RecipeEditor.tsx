import React, {
  FC,
  ChangeEvent,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField,
} from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import styled from 'styled-components';
import {
  useRecipe,
  useInput,
  useOutput,
  useRecipes,
} from '../state/recipes-v3';

import { Title } from '../state/title';
import { camelCaseToCapitalized } from '../utils/strings';
import { SymbolsList } from './SymbolsList';
import { onMobile } from './styled';
import { SymbolType } from '../utils/types';

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

type ComboBoxAddType = {inputValue?: string};
const filter = createFilterOptions<SymbolType & ComboBoxAddType>();

export const RecipeEditor: FC = () => {
  const { symbols: allSymbols } = useRecipes();
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
      return allSymbols.filter(({ name: n }) => !usedSymbols.includes(n));
    },
    [symbols, allSymbols],
  );
  const deleteHandler = useCallback(
    (symbol: string) => (e: Event) => {
      e.preventDefault();
      removeInput(symbol);
    },
    [removeInput],
  );
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
        <StyledCard>
          <CardHeader title="Symbols Used" />
          <StyledExpandCardContent style={{ flex: 1 }}>
            <SymbolsList symbols={symbols} onDelete={deleteHandler} />
          </StyledExpandCardContent>
          <CardContent>
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
          </CardContent>
        </StyledCard>
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
      </StyledContainer>
    </>
  );
};

export default RecipeEditor;
