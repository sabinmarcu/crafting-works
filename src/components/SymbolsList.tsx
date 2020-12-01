import React, { FC } from "react";
import { useSymbols } from "../state/recipes";
import { Chip, Container } from "@material-ui/core";
import styled from "styled-components";
import { StyledLink } from "./styled";

export const StyledContainer = styled(Container)`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
`;

export const StyledChip = styled(Chip)`
  cursor: pointer;
`;

export const SymbolsList: FC = () => {
  const symbols = useSymbols();
  return (
    <StyledContainer>
      {symbols.map(({ name, composite }) =>
        composite ? (
          <StyledLink to={`/recipes/${name}`} key={name}>
            <StyledChip label={name} />
          </StyledLink>
        ) : (
          <Chip variant="outlined" label={name} key={name} />
        )
      )}
    </StyledContainer>
  );
};

export default SymbolsList;
