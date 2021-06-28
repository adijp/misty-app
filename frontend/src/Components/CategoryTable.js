import { useCollection } from 'react-firebase-hooks/firestore';
import {db} from "../firebase"
import React, { useEffect, useContext, useCallback, useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import TextField from '@material-ui/core/TextField';
import { DataGrid, GridToolbarContainer,
    GridToolbarExport, bgBG} from '@material-ui/data-grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import FixedBar from './FixedBar.js'
import CategoryCard from './CategoryCard';
import Grid from '@material-ui/core/Grid';
import { PieChart } from 'react-minimal-pie-chart';
import AddCategory from './AddCategory.js';
function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const useStyles = makeStyles({
    root: {
      width : 300,
      height : 440
    },
    textF : {
        width : 80, 
    }, 
    bigF : {
        fontSize : 20
    }, 
  });
export default function CategoryTable() {
    const { currentUser } = useAuth();
    const classes = useStyles();
    
    const [category_list, category_loading, category_error] = useCollection(
        db.collection("users").doc(currentUser.uid).collection('categories').where("active","==",true)
        ,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        })
        const columns = [
            {
                field: 'category',
                headerName: 'Category',
                width: 150,
                headerAlign: 'center',
              },
            {
              field: 'balance',
              headerName: 'Balance',
              type: 'number',
              width: 80,
              headerAlign: 'center',
              editable: false
            },
              {
                field: 'choosecategory',
                headerName: 'Change Category',
                width: 150,
                headerAlign: 'center',
                renderCell: (params) => (
                  <strong>
                    <FormControl>
                    <InputLabel width="100%" id="demo-simple-select-label">Category type</InputLabel>
                        <Select 
                        label="Type"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        >
                        <MenuItem value = "Spend">Spend</MenuItem>
                        <MenuItem value="Save">Save</MenuItem>
                        </Select>
                        </FormControl>
                  </strong>
                ),
              },
          ];

    return (
        <>
        <FixedBar name="Categories">
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <Grid container spacing={3} style = {{paddingLeft : 150}}>
        {category_list && category_list.docs.map(x => 
            
            <Grid item xs={8} sm = {6} md = {4}>
            <CategoryCard name = {x.data().name} id = {x.data().name.toLowerCase()} budget={x.data().budget} balance = {x.data().balance}type={x.data().type}></CategoryCard>
            </Grid>
        )}
        <Grid item xs={8} sm = {6} md = {4}>
            <AddCategory></AddCategory>
        </Grid>
        </Grid>
            
        </FixedBar>
        </>
    
    )
}
