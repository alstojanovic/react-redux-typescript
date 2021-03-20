import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BarChartIcon from '@material-ui/icons/BarChart';
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Link } from 'react-router-dom';

export const MenuItems = () => {
    const [selectedItem, setSelectedItem] = useState(window.location.pathname);

    const handleListItemClick = (item: string) => {
        setSelectedItem(item);
    };

    return (
        <React.Fragment>
            <ListItem
                button
                selected={selectedItem === '/'}
                onClick={() => handleListItemClick('/')}
                component={Link}
                to={`/`}
            >
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
                button
                selected={selectedItem === '/reports'}
                onClick={() => handleListItemClick('/reports')}
                component={Link}
                to={'/reports'}
            >
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
            </ListItem>
            <ListItem
                button
                selected={selectedItem === '/account'}
                onClick={() => handleListItemClick('/account')}
                component={Link}
                to={'/account'}
            >
                <ListItemIcon>
                    <AccountCircleSharpIcon />
                </ListItemIcon>
                <ListItemText primary="Account" />
            </ListItem>
        </React.Fragment>
    );
};

export const SecondaryMenuItems = () => (
    <React.Fragment>
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
            <ListItemText primary="Year-end deposits" />
        </ListItem>
    </React.Fragment>
);
