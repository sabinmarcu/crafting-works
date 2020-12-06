import {
  useRef,
  FC,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {
  CardContent,
  withTheme,
  Theme,
} from '@material-ui/core';
import Tree from 'react-d3-tree';
import Measure, { BoundingRect } from 'react-measure';
import styled from 'styled-components';

import { useHistory } from 'react-router';
import { RecipeAST } from '../utils/types';
import {
  onMobile,
} from './styled';
import { capitalizedToCamelCase } from '../utils/strings';
import { recipeBaseRoute } from '../config/constants';
import { useSymbols } from '../state/recipes-v3';

export const SVGWrapper = styled(CardContent)`
  width: 100%;
  height: 500px;
  ${onMobile} {
    height: 300px;
  }
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
`;

const svgStyle = ({
  theme: {
    palette: {
      background: {
        default: background,
      },
      text: {
        primary: text,
      },
    },
    shadows: [shadow],
  },
}: { theme: Theme }) => `
  background: ${background};
  color: ${text};
  box-shadow: ${shadow};
`;
const leafNodeStyle = ({
  theme: {
    palette: {
      text: {
        disabled: text,
      },
    },
  },
}: { theme: Theme }) => `
  --leaf-color: ${text};
`;

export const SVG = withTheme(
  styled.div<{styleLeafNodes: boolean}>`
    width: 100%;
    height: 100%;
    ${svgStyle}
      ${leafNodeStyle}
    .linkBase {
      stroke: currentColor;
      opacity: 0.5 !important;
    }
    .nodeBase, .nodeNameBase, .leafNodeBase {
      fill: currentColor;
      stroke: transparent;
    }
    ${({ styleLeafNodes }) => (styleLeafNodes
    ? `
        .leafNodeBase {
          color: var(--leaf-color);
        }
      `
    : '')}
  `,
);

export const AST: FC<{
  data: RecipeAST
  styleLeafNodes?: boolean,
}> = ({
  data,
  styleLeafNodes = true,
}) => {
  const [size, setSize] = useState<BoundingRect>();
  const symbols = useSymbols();
  const history = useHistory();
  const translate = useMemo(
    () => (size
      ? ({
        x: size.width / 2,
        y: size.height / 2,
      })
      : undefined),
    [size],
  );
  const rootRef = useRef<HTMLDivElement>();
  const onClick = useCallback(
    ({ name }) => {
      const shortName = capitalizedToCamelCase(name.trim());
      const symbol = symbols.find(({ name: n }) => n === shortName);
      if (symbol?.composite) {
        history.push([
          recipeBaseRoute.replace(':name', shortName),
          'view',
        ].join('/'));
      }
    },
    [history, symbols],
  );
  useEffect(
    () => {
      const el = rootRef.current;
      if (el) {
        const handler = (event: TouchEvent) => event.preventDefault();
        el.addEventListener('touchmove',
          handler,
          { passive: false });
        return () => el.removeEventListener('touchmove', handler);
      }
      return undefined;
    },
    [rootRef],
  );
  return (
    <SVGWrapper innerRef={rootRef}>
      <Measure
        bounds
        onResize={({ bounds }) => setSize(bounds)}
      >
        {({ measureRef }) => (
          <SVG ref={measureRef} styleLeafNodes={styleLeafNodes}>
            <Tree
              data={data}
              orientation="vertical"
              collapsible={false}
              translate={translate}
              onClick={onClick}
              nodeSize={{
                x: 200,
                y: 200,
              }}
              textLayout={{
                textAnchor: 'start',
                y: 0,
                x: 15,
              }}
            />
          </SVG>
        )}
      </Measure>
    </SVGWrapper>
  );
};
