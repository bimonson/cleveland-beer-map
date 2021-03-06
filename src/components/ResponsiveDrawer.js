import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import FilterInput from './FilterInput';

// Powered By FourSquare attribution image
import PoweredByFourSquare from '../powered-by-foursquare-grey.svg';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  closeChevron: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  title: {
    fontSize: "1.25em",
    fontWeight: 500,
  }
});

const ResponsiveDrawer = (props) => {

    const { classes, theme } = props;

    const drawer = (
      <div>
        <div className={classes.toolbar}>
          <div className={classes.drawerHeader}>
            <img id="powered-by-foursquare" src={PoweredByFourSquare} alt="Powered By FourSquare" />
            <IconButton className={classes.closeChevron}
              aria-label="Close drawer"
              onClick={props.handleDrawerToggle}
            >
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
        </div>

        <Divider />
        <FilterInput
          query={props.query}
          filterVenues={props.filterVenues}
        />
        <Divider />
        <List>
          {props.filtered && props.filtered.length > 0 ? props.filtered
          .map((venue, index) => (
            <ListItem
              button key={index}
              onClick={() => { props.liClick(venue) }}
            >
              <ListItemText primary={venue.name} />
            </ListItem>
          )) :
          <ListItem>
            <ListItemText primary='No matches. Please enter another query.' />
          </ListItem>
          }
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={props.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h1" color="inherit" className={classes.title} noWrap>
              Cleveland Beer Map
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={props.container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={props.mobileOpen}
              onClose={props.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
      </div>
    );
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
