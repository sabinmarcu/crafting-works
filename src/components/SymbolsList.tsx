import React, { FC } from 'react';
import { Chip } from '@material-ui/core';
import styled from 'styled-components';
import { useSymbols } from '../state/recipes-v3';
import { StyledLink } from './styled';
import { SymbolType } from '../utils/types';

export const StyledContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-start;
`;

export const StyledChip = styled(Chip)`
  margin: 5px;
`;

export const ClickableStyledChip = styled(StyledChip)`
  cursor: pointer;
`;

export const SymbolsList: FC<{
  symbols: SymbolType[],
  onDelete?: (input: string) => (e: Event) => void,
}> = ({
  symbols,
  onDelete,
}) => (
  <StyledContainer>
    {symbols.map(({ name, composite }) => (composite ? (
      <StyledLink to={`/recipes/${name}`} key={name}>
        <ClickableStyledChip
          label={name}
          onDelete={onDelete && onDelete(name)}
        />
      </StyledLink>
    ) : (
      <StyledChip
        variant="outlined"
        label={name}
        key={name}
        onDelete={onDelete && onDelete(name)}
      />
    )))}
  </StyledContainer>
);

export default () => {
  const symbols = useSymbols();
  return symbols ? <SymbolsList symbols={symbols} /> : null;
};
