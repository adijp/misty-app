import React, {useState, useEffect}from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import InfoIcon from "@material-ui/icons/Info";
import AssignmentIcon from '@material-ui/icons/Assignment';
import PlaidLink from "./PlaidLink.tsx"
import { Link,useHistory } from "react-router-dom";
import UpdateProfile from "./UpdateProfile.js"
import {useAuth} from "../contexts/AuthContext"
import Dashboard from "./Dashboard";
import CategoryTable from './CategoryTable';
export const mainListItems = (
  <>
    <ListItem button component={Link} to="/">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText  primary="Dashboard"/>
    </ListItem>
    <ListItem button component={Link} to="/category">
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText  primary="Categories" />
    </ListItem>
    <ListItem button component={Link} to="/update-profile">
      <ListItemIcon>
        <InfoIcon />
      </ListItemIcon>
      <ListItemText  primary="Update Info"/>
    </ListItem>
    
  </>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);