import React, { FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
} from '@material-ui/core';
import styled from 'styled-components';

import { Title } from '../state/title';

export const StyledContainer = styled(Container)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

export const Error404Screen: FC = () => (
  <>
    <Title>Not Found</Title>
    <StyledContainer>
      <Card>
        <CardHeader title="404 Error" />
        <CardContent>
          <Typography>
            This is not the page you&apos;re looking for
          </Typography>
        </CardContent>
      </Card>
    </StyledContainer>
  </>
);
