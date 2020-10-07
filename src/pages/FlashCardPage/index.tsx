import React, { FC, memo } from 'react';
import FlashCard from '../../components/FlashCard';
import { useFlashCardPage } from './utils';
import useStyles from './styles';

export const FlashCardPageComponent: FC = () => {
  const classes = useStyles();
  const { entryInfo, handleClickAuto, handleClickNext } = useFlashCardPage();

  return (
    <div className={classes.root}>
      <FlashCard
        className={classes.card}
        entryInfo={entryInfo}
        onClickAuto={handleClickAuto}
        onClickNext={handleClickNext}
      />
    </div>
  );
};

const FlashCardPage = memo(FlashCardPageComponent);
FlashCardPage.displayName = 'FlashCardPage';
export default FlashCardPage;
