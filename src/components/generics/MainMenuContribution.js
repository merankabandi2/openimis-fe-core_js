import React, { Component, Fragment } from "react";
import * as Icons from "@material-ui/icons";
import PropTypes from "prop-types";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import { withTheme, withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Divider,
  List,
  IconButton,
  MenuList,
  MenuItem,
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
} from "@material-ui/core";
import withModulesManager from "../../helpers/modules";
import { _historyPush } from "../../helpers/history";


const styles = (theme) => ({
  panel: {
    margin: "0 !important",
    padding: 0,
  },
  drawerHeading: {
    fontSize: theme.menu.drawer.fontSize,
    fontWeight: theme.menu.drawer.fontWeight,
    color: theme.menu.drawer.textColor,
  },
  drawerDivider: {
    // width: 100
  },
  menuHeading: {
    fontSize: theme.menu.appBar.fontSize,
    color: theme.palette.text.second,
    paddingTop: theme.menu.appBar.fontSize / 2,
    textTransform: "none",
  },
  appBarMenuPaper: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  popper: {
    zIndex: 1200,
  },
});

const Accordion = withStyles({
  root: {
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    margin: "0",
    padding: "0",
    alignItems: 'center',
    justifyContent: 'start',
    "&$expanded": {
      margin: "0",
    },
    color: theme.palette.secondary.main
  },
  expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: "block",
  },
}))(MuiAccordionDetails);

const getIconComponent = (iconName) => {
  const IconComponent = Icons[iconName];
  if (IconComponent) {
    return <IconComponent />;
  }
  return null;
};

function fetchSubmenuConfig(modulesManager, allEntries, entries, menuId, rights) {
  const menuConfig = modulesManager.getConf("fe-core", "menus", []);
  const isMenuConfigEmpty = !(menuConfig?.length);
  const submenuMapping = {};
  const menuIcons = {}; 
  const copyOfEntries = entries;

  if (!isMenuConfigEmpty) {
    menuConfig
      .filter(menu => menu.id == menuId)
      .forEach(menu => {
        (menu.submenus || []).forEach(submenu => {
          submenuMapping[submenu.id] = submenu.position;
          if (submenu.icon) {
            menuIcons[submenu.id] = submenu.icon;
          }
        });
      });

    const updatedEntries = allEntries
      .map(entry => {
        const customIcon = menuIcons[entry.id];
        return {
          ...entry,
          position: submenuMapping[entry.id] || null,
          icon: customIcon ? getIconComponent(customIcon) : entry.icon,
        };
      })
      .filter(entry => entry.position !== null)
      .sort((a, b) => a.position - b.position);

    const uniqueEntries = new Map();
    updatedEntries.forEach(entry => {
      if (!uniqueEntries.has(entry.id)) {
        uniqueEntries.set(entry.id, entry);
      }
    });

    return Array.from(uniqueEntries.values()).filter(entry => {
      return !entry.filter || entry.filter(rights);
    });
  }

  const uniqueEntriesFallback = new Map();
  copyOfEntries.forEach(entry => {
    if (!uniqueEntriesFallback.has(entry.id)) {
      uniqueEntriesFallback.set(entry.id, entry);
    }
  });

  return Array.from(uniqueEntriesFallback.values());
}

class MainMenuContribution extends Component {
  state = {
    expanded: false,
    anchorRef: React.createRef(),
  };

  toggleExpanded = (event) => {
    this.setState({ expanded: !this.state.expanded });
  };

  handleMenuClose = (event) => {
    if (this.state.anchorRef.current && this.state.anchorRef.current.contains(event.target)) {
      return;
    }
    this.toggleExpanded(event);
  };

  handleMenuSelect = (e, route) => {
    // block normal href only for left click
    if (e.type === 'click') {
      e.stopPropagation();
      e.preventDefault();
    }
    this.toggleExpanded(e);
    this.redirect(route);
  };
  
  redirect(route) {
    const { modulesManager, history } = this.props;
    _historyPush(modulesManager, history, route);
  }

  appBarMenu = (entries) => {
    return (
      <Fragment>
        <Button ref={this.state.anchorRef} onClick={this.toggleExpanded} className={this.props.classes.menuHeading}>
          {this.props.header}
          <ExpandMoreIcon />
        </Button>
        <Popper
          className={this.props.classes.popper}
          open={this.state.expanded}
          anchorEl={this.state.anchorRef.current}
          transition
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper className={this.props.classes.appBarMenuPaper} id={`${this.props.header}-menu-list`}>
                <ClickAwayListener onClickAway={this.handleMenuClose}>
                  <MenuList>
                    {entries.map((entry, idx) => (
                      <div key={`${this.props.header}_${idx}_menuItem`}>
                        <MenuItem onClick={(e) => this.handleMenuSelect(e, entry.route)}  component="a"  href={`${process.env.PUBLIC_URL || ""}${entry.route}`} passHref>
                          <ListItemIcon>{entry.icon}</ListItemIcon>
                          <ListItemText primary={entry.text}/>
                          
                        </MenuItem>
                        {entry.withDivider && (
                          <Divider
                            key={`${this.props.header}_${idx}_divider`}
                            className={this.props.classes.drawerDivider}
                          />
                        )}
                      </div>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Fragment>
    );
  };

  drawerMenu = (entries) => {
    return (
      <Accordion className={this.props.classes.panel} expanded={this.state.expanded} onChange={this.toggleExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`${this.props.header}-header`}>
          <IconButton>{this.props.icon}</IconButton>
          <Typography className={this.props.classes.drawerHeading}>{this.props.header}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List component="nav">
            {entries.map((entry, idx) => (
              <Fragment key={`${this.props.header}_${idx}`}>
                <ListItem
                  button
                  key={`${this.props.header}_${idx}_item`}
                  onClick={(e) => {
                    this.redirect(entry.route);
                  }}
                >
                  {entry.icon && <ListItemIcon>{entry.icon}</ListItemIcon>}
                  <ListItemText primary={entry.text}/>
                </ListItem>
                {entry.withDivider && (
                  <Divider key={`${this.props.header}_${idx}_divider`} className={this.props.classes.drawerDivider} />
                )}
              </Fragment>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  };

  render() {
    const { menuVariant, modulesManager } = this.props;
    const allEntries = modulesManager.getMenuEntries();
    const updatedEntries = fetchSubmenuConfig(
      modulesManager, allEntries, this.props.entries, this.props.menuId, this.props.rights
    );
    if (menuVariant === "AppBar") {
      return this.appBarMenu(updatedEntries);
    } else {
      return this.drawerMenu(updatedEntries);
    }
  }
}

MainMenuContribution.propTypes = {
  header: PropTypes.string.isRequired,
  entries: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  menuId: PropTypes.object.isRequired,
};

export default withModulesManager(withTheme(withStyles(styles)(MainMenuContribution)));
