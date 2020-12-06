import {
  Button, CardContent, Dialog, DialogTitle,
} from '@material-ui/core';
import {
  FC, useCallback, useState,
} from 'react';
import { RightCardActions } from './styled';

export const useConfirm = (onConfirm: () => void) => {
  const [open, setIsOpen] = useState<boolean>(false);
  const onOpen = useCallback(
    () => setIsOpen(true),
    [setIsOpen],
  );
  const onClose = useCallback(
    (confirmed: boolean) => {
      if (confirmed) {
        onConfirm();
      }
      setIsOpen(false);
    },
    [onConfirm, setIsOpen],
  );
  return { open, onClose, onOpen };
};

export const ConfirmDialog: FC<{
  open: boolean,
  onClose: (confirm: boolean) => void,
  title?: string,
}> = ({
  open,
  onClose,
  title,
  children,
}) => (
  <Dialog onClose={() => onClose(false)} open={open}>
    {title && (
    <DialogTitle>
      {title}
    </DialogTitle>
    )}
    <CardContent>
      {children}
    </CardContent>
    <RightCardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onClose(true)}
      >
        Confirm
      </Button>
      <Button
        color="secondary"
        onClick={() => onClose(false)}
      >
        Cancel
      </Button>
    </RightCardActions>
  </Dialog>
);

export default ConfirmDialog;
