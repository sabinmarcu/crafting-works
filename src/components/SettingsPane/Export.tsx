import {
  FC, useCallback, useMemo, useState,
} from 'react';
import {
  Backdrop,
  Button,
  Fade,
  CardHeader,
  Modal,
  Typography,
} from '@material-ui/core';
import { useRecipes } from '../../state/recipes-v3';
import { useLabels } from '../../state/label';
import {
  ModalContainer,
  ModalContent,
  ModalWrapper,
  RightCardActions,
} from '../styled';
import { LabelList } from '../LabelList';
import { uniq } from '../../utils/functions';

export const ExportModal: FC<{
  open: boolean,
  onClose: () => void,
}> = ({
  open,
  onClose,
}) => {
  const [filtered, setFiltered] = useState<string[]>([]);
  const addFilter = useCallback(
    (input: string) => setFiltered(
      (t) => uniq([...t, input]),
    ),
    [setFiltered],
  );
  const removeFilter = useCallback(
    (input: string) => setFiltered(
      (t) => uniq(t.filter((it) => it !== input)),
    ),
    [setFiltered],
  );
  const toggleFilter = useCallback(
    (input: string) => (filtered.includes(input)
      ? removeFilter(input)
      : addFilter(input)),
    [filtered, removeFilter, addFilter],
  );
  const clearFilter = useCallback(
    () => setFiltered([]),
    [setFiltered],
  );
  const onClick = useCallback(
    (name: string) => () => toggleFilter(name),
    [toggleFilter],
  );
  const { recipes, labels: allLabels } = useRecipes();
  const { rawLabels: labels } = useLabels();
  const filteredLabels = useMemo(
    () => {
      if (!labels) {
        return undefined;
      }
      if (filtered.length === 0) {
        return labels;
      }
      return Object.entries(labels)
        .filter(([key]) => filtered.includes(key))
        .reduce((prev, [key, value]) => ({
          ...prev,
          [key]: value,
        }), {});
    },
    [filtered, labels],
  );
  const filteredRecipes = useMemo(
    () => {
      if (!recipes) {
        return undefined;
      }
      if (filtered.length === 0) {
        return recipes;
      }
      return Object.entries(recipes)
        .filter(([,{ labels: l }]) => l
          && l.reduce(
            (prev: boolean, it) => prev || filtered.includes(it),
            false,
          ))
        .reduce((prev, [key, value]) => ({
          ...prev,
          [key]: value,
        }), {});
    },
    [filtered, labels],
  );
  const onSubmit = useCallback(
    () => {
      const blob = new Blob(
        [
          JSON.stringify({
            recipes: filteredRecipes || {},
            labels: filteredLabels || {},
          }, undefined, 2),
        ],
        { type: 'application/json' },
      );
      const obj = window.URL.createObjectURL(blob);
      const el = document.createElement('a');
      el.style.display = 'none';
      el.href = obj;
      el.download = 'export.json';
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    },
    [filteredRecipes, filteredLabels],
  );
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      disableEnforceFocus
      disableAutoFocus
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <ModalContainer>
          <ModalWrapper elevation={10}>
            <CardHeader title="Export" />
            <ModalContent>
              <Typography variant="h6">Only export recipes matching the following tags:</Typography>
              <Typography variant="body1">Leave blank to export all</Typography>
              <br />
              <LabelList
                labels={allLabels}
                active={filtered}
                onClick={onClick}
              />
            </ModalContent>
            <RightCardActions>
              {filtered.length > 0 && (
              <Button
                color="secondary"
                variant="contained"
                onClick={clearFilter}
              >
                Clear Filter
              </Button>
              )}
              <Button
                color="primary"
                variant="contained"
                onClick={onSubmit}
              >
                Export
              </Button>
              <Button
                color="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
            </RightCardActions>
          </ModalWrapper>
        </ModalContainer>
      </Fade>
    </Modal>
  );
};

export const Export: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const close = useCallback(
    () => setIsOpen(false),
    [setIsOpen],
  );
  const open = useCallback(
    () => setIsOpen(true),
    [setIsOpen],
  );
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={open}
      >
        Export
      </Button>
      <ExportModal open={isOpen} onClose={close} />
    </>
  );
};
