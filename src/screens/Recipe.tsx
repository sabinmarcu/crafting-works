import React, {
  ChangeEvent, FC, useCallback, useEffect, useMemo, useState,
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
import { RouteComponentProps } from 'react-router';
import { SymbolType, useRecipe, useRecipes } from '../state/recipes';
import { Title } from '../state/title';
import { camelCaseToCapitalized } from '../utils/strings';
import { SymbolsList } from '../components/SymbolsList';

export const StyledContainer = styled(Container)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem 0;
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledTextField = styled(TextField)`
  margin: 0.5rem 0;
`;

type ComboBoxAddType = {inputValue?: string};

const filter = createFilterOptions<SymbolType & ComboBoxAddType>();
export const RecipeScreen: FC<RouteComponentProps<{ name: string }>> = ({
  match: {
    params: { name },
  },
}) => {
  const { symbols: allSymbols } = useRecipes();
  const {
    inputs, updateInput, deleteInput, addInput,
  } = useRecipe(name);
  const updateHandler = useCallback(
    (symbol: string) => (
      { target: { value } }: ChangeEvent<HTMLInputElement>,
    ) => updateInput(symbol, parseInt(value, 10) || 0),
    [updateInput],
  );
  const symbols = useMemo<SymbolType[]>(
    () => inputs.map(({ symbol }) => ({
      name: symbol,
      composite: allSymbols.find(({ name: n }) => symbol === n)?.composite || false,
    })),
    [inputs, allSymbols],
  );
  const deleteHandler = useCallback(
    (symbol: string) => () => deleteInput(symbol),
    [deleteInput],
  );
  const comboSymbols = useMemo(
    () => {
      const usedSymbols = symbols.map(({ name: n }) => n);
      return allSymbols.filter(({ name: n }) => !usedSymbols.includes(n));
    },
    [symbols, allSymbols],
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
  return (
    <>
      <Title title={`Recipe: ${camelCaseToCapitalized(name)}`} />
      <StyledContainer>
        <Card>
          <CardHeader title="Symbols Used" />
          <CardContent>
            <SymbolsList symbols={symbols} onDelete={deleteHandler} />
          </CardContent>
          <CardContent>
            <Autocomplete
              value={newSymbol}
              onChange={(_, newValue) => {
                if (typeof newValue === 'string') {
                  setNewSymbol({ name: newValue });
                } else if (newValue && newValue.inputValue) {
                  setNewSymbol({ name: newValue.inputValue });
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
        </Card>
        <Card>
          <CardHeader title="Material Amounts" />
          <CardContent>
            {inputs.map(({ symbol, amount }) => (
              <StyledTextField
                fullWidth
                key={symbol}
                label={camelCaseToCapitalized(symbol)}
                value={amount}
                onChange={updateHandler(symbol)}
                type="number"
              />
            ))}
          </CardContent>
        </Card>
      </StyledContainer>
    </>
  );
};

export default RecipeScreen;
