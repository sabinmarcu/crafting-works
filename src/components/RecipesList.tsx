import React, { FC, useMemo } from 'react';
import {
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
// import styled from 'styled-components';
import { useRecipes } from '../state/recipes';
import { camelCaseToCapitalized } from '../utils/strings';
import { StyledLink } from './styled';

export const RecipesList: FC = () => {
  const { recipes } = useRecipes();
  const list = useMemo(
    () => Object.keys(recipes || {})
      .map((it) => ({
        id: it,
        text: camelCaseToCapitalized(it),
      })),
    [recipes],
  );
  return (
    <List>
      {list.map(({ id, text }) => (
        <StyledLink to={`/recipes/${id}`}>
          <ListItem key={id} button>
            <ListItemText>
              {text}
            </ListItemText>
          </ListItem>
        </StyledLink>
      ))}
    </List>
  );
};

export default RecipesList;
