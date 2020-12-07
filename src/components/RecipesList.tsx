import React, { FC, useMemo } from 'react';
import {
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
// import styled from 'styled-components';
import { useRecipes } from '../state/recipes-v3';
import { camelCaseToCapitalized } from '../utils/strings';
import { StyledLink } from './styled';
import { Filter, useFilter } from './Filter';

export const RecipesList: FC = () => {
  const { recipes } = useRecipes();
  const recipeList = useMemo(
    () => Object.keys(recipes || {})
      .map((it) => ({
        id: it,
        text: camelCaseToCapitalized(it),
      })),
    [recipes],
  );
  const { list, ...filterProps } = useFilter(
    recipeList,
    ({ text }) => text,
  );
  return (
    <List>
      <Filter {...filterProps} />
      {list.map(({ id, text }) => (
        <StyledLink to={`/recipes/${id}`} key={id}>
          <ListItem button>
            <ListItemText>
              {text}
            </ListItemText>
          </ListItem>
        </StyledLink>
      ))}
    </List>
  );
};
