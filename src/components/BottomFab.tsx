import { Fab } from '@material-ui/core';
import React, {
  FC,
  useState,
} from 'react';
import Measure, { BoundingRect } from 'react-measure';
import styled from 'styled-components';

export const FabWrapper = styled.div<{
  horizontal?: 'left' | 'right',
  vertical?: 'top' | 'bottom',
}>`
  position: fixed;
  ${({ vertical }) => (vertical && vertical === 'top'
    ? 'top: 25px;'
    : 'bottom: 25px;'
  )}
  ${({ horizontal }) => (horizontal && horizontal === 'left'
    ? 'left: calc(25px + env(safe-area-inset-left));'
    : 'right: calc(25px + env(safe-area-inset-right));'
  )}
`;

export const Spacer = styled.div`
  width: 100%;
`;

export const BottomFab: FC<{
  horizontal?: 'left' | 'right',
  vertical?: 'top' | 'bottom',
  onClick: () => void,
  Icon: FC,
}> = ({
  onClick,
  horizontal,
  vertical,
  Icon,
}) => {
  const [size, setSize] = useState<BoundingRect>();
  return (
    <>
      <Measure
        bounds
        onResize={({ bounds }) => setSize(bounds)}
      >
        {({ measureRef }) => (
          <FabWrapper
            ref={measureRef}
            horizontal={horizontal}
            vertical={vertical}
          >
            <Fab onClick={onClick} color="primary">
              <Icon />
            </Fab>
          </FabWrapper>
        )}
      </Measure>
      <Spacer style={{
        height: size
          ? size.height + 50
          : 50,
      }}
      />
    </>
  );
};

export default BottomFab;
