import {
  useState,
  useCallback,
  FC,
  ChangeEvent,
  useMemo,
} from 'react';
import styled from 'styled-components';
import { InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

export type FilterType = {
  value: string | undefined,
  onChange: (event: ChangeEvent<HTMLInputElement>) => void,
};
export const useFilter = <T extends any>(
  list: T[],
  processor: (input: T) => string,
): {
    list: T[],
  } & FilterType => {
  const [value, setValue] = useState<string>();
  const onChange = useCallback(
    ({ target: { value: val } }: ChangeEvent<HTMLInputElement>) => setValue(val),
    [setValue],
  );
  const regex = useMemo(
    () => (value ? new RegExp(value, 'i') : undefined),
    [value],
  );
  const filteredList = useMemo(
    () => {
      if (!regex) {
        return list;
      }
      return list.map((it) => ({
        id: processor(it),
        meta: it,
      }))
        .filter(({ id }) => regex.test(id))
        .map(({ meta }) => meta);
    },
    [list, processor, regex],
  );
  return {
    list: filteredList,
    value,
    onChange,
  };
};

export const StyledTextField = styled(TextField)`
  margin-bottom: 25px;
`;

export const Filter: FC<FilterType> = ({
  value,
  onChange,
}) => (
  <StyledTextField
    value={value}
    onChange={onChange}
    fullWidth
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
  />
);
