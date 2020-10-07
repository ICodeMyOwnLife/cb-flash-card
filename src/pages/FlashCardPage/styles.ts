import { makeStyles, createStyles, Theme } from '@material-ui/core';

const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100vh',
      padding: spacing(4),
      boxSizing: 'border-box',
    },
    card: {
      maxHeight: '90%',
    },
  });

const useStyles = makeStyles(styles, { name: 'FlashCardPage' });

export default useStyles;
