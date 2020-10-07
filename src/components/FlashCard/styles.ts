import { makeStyles, createStyles, Theme } from '@material-ui/core';

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',

      '& ul': {
        paddingInlineStart: `${spacing(4)}px`,
        lineHeight: 1.9,
        listStyleType: 'square',
        listStylePosition: 'inside',
      },

      '& div > ul:first-of-type': {
        marginLeft: `-${spacing(4)}px`,
      },
    },
    empty: {
      minHeight: 320,
    },
    header: {
      padding: spacing(3, 4, 2),
      textAlign: 'center',
      borderBottom: '1px solid',
      borderBottomColor: palette.divider,
    },
    content: {
      padding: spacing(2, 4),
      overflowY: 'auto',
      borderBottom: '1px solid',
      borderBottomColor: palette.divider,
    },
    actions: {
      padding: spacing(2, 4, 3),
      justifyContent: 'center',
    },
    button: {
      minWidth: 120,
    },
  });

const useStyles = makeStyles(styles, { name: 'FlashCard' });

export default useStyles;
