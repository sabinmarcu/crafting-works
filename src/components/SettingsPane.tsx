import { Button, Container, Typography } from '@material-ui/core';
import { FC, useCallback } from 'react';
import styled from 'styled-components';

import { ConfirmDialog, useConfirm } from './Confirm';

const StyledContainer = styled(Container)`
  margin: 1.5rem 0 !important;
`;

export const ResetAll: FC = () => {
  const reset = useCallback(
    () => {
      Object.keys(localStorage)
        .forEach((key) => localStorage.removeItem(key));

      // @ts-ignore
      window.location = `${window.location}`;
    },
    [],
  );
  const { onOpen, ...args } = useConfirm(reset);
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={onOpen}
      >
        Reset All Settings
      </Button>
      <ConfirmDialog {...args}>
        <Typography>
          Are you sure you want to reset all data?
        </Typography>
      </ConfirmDialog>
    </>
  );
};

export const SettingsView: FC = () => (
  <StyledContainer>
    <ResetAll />
  </StyledContainer>
);

export default SettingsView;
