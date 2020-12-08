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
import { LabelBadge, LabelBadgeList } from './Label';

export const RecipesList: FC = () => {
  const { recipes } = useRecipes();
  const recipeList = useMemo(
    () => Object.entries(recipes || {})
      .map(([it, { labels }]) => ({
        id: it,
        labels,
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
      {list.map(({ id, text, labels }) => (
        <StyledLink to={`/recipes/${id}`} key={id}>
          <ListItem button>
            <ListItemText>
              {text}
            </ListItemText>
            {labels && (
              <LabelBadgeList>
                {labels.map(
                  (label) => (
                    <LabelBadge key={label} name={label} />
                  ),
                )}
              </LabelBadgeList>
            )}
          </ListItem>
        </StyledLink>
      ))}
    </List>
  );
};
