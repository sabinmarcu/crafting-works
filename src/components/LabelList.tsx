import { FC, useMemo } from 'react';
import styled from 'styled-components';
import { Chip } from '@material-ui/core';
import { useFilter, Filter } from './Filter';
import { useLabelColor } from '../hooks/useLabel';
import { camelCaseToCapitalized } from '../utils/strings';

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
  &, &:hover, &:focus {
    background: ${({ customColor }) => customColor};
  }
`;

export const LabelChip: FC<{
  name: string,
  onRemove?: (input: string) => (e: Event) => void,
  onClick?: (input: string) => (e: any) => void,
  active: boolean,
}> = ({
  name,
  onRemove,
  onClick,
  active,
}) => {
  const color = useLabelColor(name);
  const removeFunc = useMemo(
    () => (onRemove ? onRemove(name) : undefined),
    [onRemove, name],
  );
  const clickFunc = useMemo(
    () => (onClick ? onClick(name) : undefined),
    [onClick, name],
  );
  return (
    <StyledChip
      label={camelCaseToCapitalized(name)}
      customColor={active ? color : undefined}
      variant={active ? 'default' : 'outlined'}
      onDelete={removeFunc}
      {...clickFunc ? { onClick: clickFunc } : {}}
    />
  );
};

export const LabelList: FC<{
  labels: string[],
  filter?: boolean,
  active?: string[],
  onRemove?: (input: string) => (e: Event) => void,
  onClick?: (input: string) => (e: any) => void,
}> = ({
  labels,
  onRemove,
  onClick,
  filter = true,
  active,
}) => {
  const { list, ...filterProps } = useFilter(
    labels,
    (it) => it,
  );
  const renderLabels = useMemo(
    () => (filter ? list : labels)
      .map((it) => ({
        label: it,
        active: active ? active.includes(it) : true,
      })),
    [filter, list, labels, active],
  );
  return (
    <StyledContainer>
      {filter && <Filter {...filterProps} />}
      {renderLabels.map(({ label, active: a }) => (
        <LabelChip
          name={label}
          key={label}
          active={a}
          onRemove={onRemove}
          onClick={onClick}
        />
      ))}
    </StyledContainer>
  );
};
