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
import { useLabelFilters } from '../state/filter';
import { uniq } from '../utils/functions';

export const RecipesList: FC = () => {
  const { recipes } = useRecipes();
  const recipeList = useMemo(
    () => Object.entries(recipes || {})
      .map(([it, { labels, inheritedLabels }]) => ({
        id: it,
        labels: uniq([
          ...(labels || []),
          ...(inheritedLabels || []),
        ]),
        text: camelCaseToCapitalized(it),
      })),
    [recipes],
  );
  const filterBy = useLabelFilters();
  const preFilteredList = useMemo(
    () => (filterBy.length > 0
      ? recipeList.filter(
        ({ labels }): boolean => (labels
          ? labels.reduce(
            (prev, label): boolean => (
              prev || filterBy.includes(label)
            ),
            false as boolean,
          )
          : false
        ),
      )
      : recipeList
    ),
    [recipeList, filterBy],
  );
  const { list, ...filterProps } = useFilter(
    preFilteredList,
    ({ text }) => text,
  );
  return (
    <List>
      <Filter {...filterProps} />
      {list.map(({
        id,
        text,
        labels,
      }) => (
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
