import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  capitalize, CardHeader, Chip, TextField,
} from '@material-ui/core';
import styled from 'styled-components';

import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { useRecipe, useRecipes } from '../../state/recipes-v3';
import {
  AutocompleteWrapper, RightCardActions, StyledCard, StyledExpandCardContent,
} from '../styled';
import { useLabelColor } from '../../hooks/useLabel';
import { camelCaseToCapitalized, capitalizedToCamelCase } from '../../utils/strings';

export const StyledContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-start;
`;

export const StyledChip = styled(Chip)<{
  customColor?: string
}>`
  margin: 5px;
  background: ${({ customColor }) => customColor};
`;

export const LabelChip: FC<{
  name: string,
  onRemove?: (input: string) => (e: Event) => void,
}> = ({
  name,
  onRemove,
}) => {
  const color = useLabelColor(name);
  const removeFunc = useMemo(
    () => (onRemove ? onRemove(name) : undefined),
    [onRemove, name],
  );
  return (
    <StyledChip
      label={camelCaseToCapitalized(name)}
      customColor={color}
      onDelete={removeFunc}
    />
  );
};

type ComboBoxAddType = {inputValue?: string};
type LabelInputType = { name: string };
const filter = createFilterOptions<ComboBoxAddType & LabelInputType>();

export const LabelEditor: FC = () => {
  const { labels: allLabels } = useRecipes();
  const { recipe, removeLabel, addLabel } = useRecipe();
  const labels = useMemo(
    () => recipe?.labels ?? [],
    [recipe],
  );
  const deleteHandler = useCallback(
    (label: string) => (e: Event) => {
      e.preventDefault();
      removeLabel(label);
    },
    [removeLabel],
  );
  const comboLabels: LabelInputType[] = useMemo(
    () => allLabels.filter((n) => !labels.includes(n))
      .map((it) => ({ name: it })),
    [labels, allLabels],
  );
  const [newLabel, setNewLabel] = useState<LabelInputType & ComboBoxAddType | null>(null);
  useEffect(
    () => {
      if (newLabel) {
        addLabel(capitalizedToCamelCase(newLabel.name));
        setNewLabel(null);
      }
    },
    [newLabel, addLabel, setNewLabel],
  );
  return (
    <StyledCard>
      <CardHeader title="Labels" />
      {labels && (
      <StyledExpandCardContent>
        {labels.map((label) => (
          <LabelChip
            name={label}
            key={label}
            onRemove={deleteHandler}
          />
        ))}
      </StyledExpandCardContent>
      )}
      <RightCardActions>
        <AutocompleteWrapper>
          <Autocomplete
            value={newLabel}
            onChange={(_, newValue) => {
              if (typeof newValue === 'string') {
                setNewLabel({ name: newValue });
              } else if (newValue && newValue.inputValue) {
                setNewLabel({ name: newValue.inputValue });
              } else if (newValue) {
                setNewLabel(newValue);
              } else {
                setNewLabel(null);
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
            options={comboLabels as (LabelInputType & ComboBoxAddType)[]}
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
                label="Add Label"
              />
            )}
          />
        </AutocompleteWrapper>
      </RightCardActions>
    </StyledCard>
  );
};
