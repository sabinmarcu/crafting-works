import React, {
  FC,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  CardHeader,
  TextField,
} from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { SymbolsList } from '../SymbolsList';
import { SymbolType } from '../../utils/types';
import { camelCaseToCapitalized, capitalize, capitalizedToCamelCase } from '../../utils/strings';
import {
  AutocompleteWrapper,
  RightCardActions,
  StyledCard,
  StyledExpandCardContent,
} from '../styled';
import { hasCircularDependency } from '../../utils/calculate';
import {
  useRecipe,
  useRecipes,
} from '../../state/recipes-v3';

type ComboBoxAddType = {inputValue?: string};
const filter = createFilterOptions<SymbolType & ComboBoxAddType>();

export const SymbolsEditor: FC = () => {
  const {
    symbols: allSymbols,
    recipes,
  } = useRecipes();
  const {
    name,
    symbols,
    addInput,
    removeInput,
  } = useRecipe();
  const deleteHandler = useCallback(
    (symbol: string) => (e: Event) => {
      e.preventDefault();
      removeInput(symbol);
    },
    [removeInput],
  );
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
            recipes![n],
            recipes!,
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
  const [newSymbol, setNewSymbol] = useState<SymbolType & ComboBoxAddType | null>(null);
  useEffect(
    () => {
      if (newSymbol) {
        addInput(capitalizedToCamelCase(newSymbol.name));
        setNewSymbol(null);
      }
    },
    [newSymbol, addInput, setNewSymbol],
  );
  return (
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
                  name: `Add "${capitalize(params.inputValue)}"`,
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
      </RightCardActions>
    </StyledCard>
  );
};
