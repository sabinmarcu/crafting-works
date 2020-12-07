import React, {
  FC,
  ChangeEvent,
  useCallback,
} from 'react';
import {
  TextField,
  CardContent,
  CardHeader,
} from '@material-ui/core';
import styled from 'styled-components';
import {
  useInput,
  useOutput,
  useRecipe,
} from '../../state/recipes-v3';
import { camelCaseToCapitalized } from '../../utils/strings';
import {
  StyledCard, StyledExpandCardContent,
} from '../styled';

export const StyledTextField = styled(TextField)`
  margin: 0.5rem 0 !important;
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

export const MaterialsEditor: FC = () => {
  const {
    recipe,
  } = useRecipe();
  return (
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
  );
};
