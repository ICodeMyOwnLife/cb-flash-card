/* eslint-disable react/no-danger */
import React, { FC, memo } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from '@material-ui/core';
import clsx from 'clsx';
import useStyles from './styles';

export const FlashCardComponent: FC<FlashCardProps> = ({
  className,
  entryInfo,
  onClickAuto,
  onClickNext,
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(className, classes.root)} elevation={4}>
      {entryInfo ? (
        <>
          <CardHeader className={classes.header} title={entryInfo.title} />
          <CardContent className={classes.content}>
            <div dangerouslySetInnerHTML={{ __html: entryInfo.html }} />
          </CardContent>
        </>
      ) : (
        <div className={classes.empty} />
      )}
      <CardActions className={classes.actions}>
        <Button
          className={classes.button}
          color="secondary"
          onClick={onClickAuto}
          variant="contained"
        >
          AUTO
        </Button>
        <Button
          className={classes.button}
          color="primary"
          onClick={onClickNext}
          variant="contained"
        >
          NEXT
        </Button>
      </CardActions>
    </Card>
  );
};

const FlashCard = memo(FlashCardComponent);
FlashCard.displayName = 'FlashCard';
export default FlashCard;

export interface FlashCardProps {
  className?: string;
  entryInfo: EntryInfo | undefined;
  onClickAuto: VoidFunction;
  onClickNext: VoidFunction;
}

export interface EntryInfo {
  html: string;
  title: string;
}
