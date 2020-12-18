import { FC, useCallback } from 'react';
import { Typography } from '@material-ui/core';
import { ColorPicker } from 'material-ui-color';
import styled from 'styled-components';

import { useRecipes } from '../../state/recipes-v3';
import { useLabel } from '../../state/label';
import { camelCaseToCapitalized } from '../../utils/strings';

const LabelWrapper = styled.article`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

export const LabelEditor: FC<{
  label: string
}> = ({
  label,
}) => {
  const [color, setColor] = useLabel(label);
  const changeHandler = useCallback(
    (value) => {
      setColor(`#${value.hex}`);
    },
    [setColor],
  );
  return (
    <LabelWrapper>
      <Typography>
        {camelCaseToCapitalized(label)}
      </Typography>
      <ColorPicker
        value={color}
        onChange={changeHandler}
        hideTextfield
      />
    </LabelWrapper>
  );
};

export const LabelSettings: FC = () => {
  const { labels } = useRecipes();
  return (
    <>
      {labels.map((label) => (
        <LabelEditor key={label} label={label} />
      ))}
    </>
  );
};
