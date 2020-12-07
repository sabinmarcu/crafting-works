import React, { FC, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';

export const Redirect: FC = () => {
  const history = useHistory();
  const search = useMemo(
    () => window.location.search
      .substr(1)
      .split('&')
      .map((it) => it
        .split('=')
        .map(decodeURIComponent))
      .reduce((prev, [key, value]) => ({
        ...prev,
        [key]: value,
      }), {} as Record<string, string>),
    [],
  );
  useEffect(
    () => {
      if (search.r) {
        history.push(search.r);
      }
    },
    [search, history],
  );
  return <></>;
};
