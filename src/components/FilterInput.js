import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    margin: 16,
    width: '100%',
  },
});

const FilterInput = (props) => {

  const { classes } = props;

  return (
    <form className={classes.container} noValidate autoComplete="off">

      <TextField
        id="outlined-dense"
        label="Filter Breweries"
        className={classNames(classes.textField, classes.dense)}
        margin="dense"
        variant="outlined"
        value={props.query}
        onChange={(e) => { props.filterVenues(e.target.value) }}
      />

    </form>
  );
}

FilterInput.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterInput);
