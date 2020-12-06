import {
  useRef,
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  CardContent,
  withTheme,
  Theme,
} from '@material-ui/core';
import Tree from 'react-d3-tree';
import Measure, { BoundingRect } from 'react-measure';
import styled from 'styled-components';

import { RecipeAST } from '../utils/types';
import {
  onMobile,
} from './styled';

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

export const SVG = withTheme(
  styled.div`
    width: 100%;
    height: 100%;
    ${svgStyle}
    .linkBase {
      stroke: currentColor;
      opacity: 0.5 !important;
    }
    .nodeBase, .nodeNameBase, .leafNodeBase {
      fill: currentColor;
      stroke: transparent;
    }
  `,
);

export const AST: FC<{
  data: RecipeAST
}> = ({
  data,
}) => {
  const [size, setSize] = useState<BoundingRect>();
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
          <SVG ref={measureRef}>
            <Tree
              data={data}
              orientation="vertical"
              collapsible={false}
              translate={translate}
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
