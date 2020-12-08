import { FC } from 'react';
import { Badge, Tooltip } from '@material-ui/core';
import styled from 'styled-components';
import { useLabelColor } from '../hooks/useLabel';
import { camelCaseToCapitalized } from '../utils/strings';

export const StyledBadge = styled(Badge)<{
  customColor?: string
}>`
  .MuiBadge-badge {
    background: ${({ customColor }) => customColor};
    height: 10px;
    width: 10px;
  }
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  transform: scale(1);
`;

export const LabelBadgeList = styled.section`
  .MuiBadge-badge {
    position: relative;
  }
`;

export const LabelBadge: FC<{
  name: string
}> = ({
  name,
}) => {
  const color = useLabelColor(name);
  return (
    <Tooltip title={camelCaseToCapitalized(name)} arrow>
      <StyledBadge
        variant="dot"
        customColor={color}
      />
    </Tooltip>
  );
};
