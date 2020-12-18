import { FC, useCallback } from 'react';
import { useLabelFilter } from '../../state/filter';
import { useRecipes } from '../../state/recipes-v3';
import { LabelList } from '../LabelList';
import { StyledContainer } from '../styled';

export const FilterView: FC = () => {
  const { labels } = useRecipes();
  const { filterBy, toggleFilter } = useLabelFilter();
  const onClick = useCallback(
    (name: string) => () => {
      toggleFilter(name);
    },
    [toggleFilter],
  );
  return (
    <StyledContainer>
      <LabelList
        labels={labels}
        active={filterBy}
        onClick={onClick}
      />
    </StyledContainer>
  );
};
