import React, {
  FC,
  useCallback,
} from 'react';
import {
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import {
  useRecipes,
  useRecipe,
} from '../../state/recipes-v3';
import { ConfirmDialog, useConfirm } from '../Confirm';
import { camelCaseToCapitalized } from '../../utils/strings';
import {
  RightCardActions, StyledCard,
} from '../styled';

export const RemoveRecipe: FC = () => {
  const {
    name,
  } = useRecipe();
  const { removeRecipe } = useRecipes();
  const history = useHistory();
  const removeHandler = useCallback(
    () => {
      removeRecipe(name);
      history.push('/');
    },
    [removeRecipe, name, history],
  );
  const { onOpen, ...confirmArgs } = useConfirm(removeHandler);
  return (
    <>
      <StyledCard>
        <RightCardActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={onOpen}
          >
            Delete Recipe
          </Button>
        </RightCardActions>
      </StyledCard>
      <ConfirmDialog {...confirmArgs}>
        Are you sure you want to delete this recipe (
        {camelCaseToCapitalized(name)}
        )?
      </ConfirmDialog>
    </>
  );
};
