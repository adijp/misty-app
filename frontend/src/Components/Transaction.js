import { useCollection } from 'react-firebase-hooks/firestore';
import {db} from "../firebase"
import React, { useEffect, useContext, useCallback, useState } from "react";
import { useAuth } from "../contexts/AuthContext"

import { DataGrid, GridToolbarContainer,
    GridToolbarExport, bgBG} from '@material-ui/data-grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
function preventDefault(event) {
    event.preventDefault();
  }
  
export default function Transaction() {
      
    const { currentUser, getTransactions } = useAuth();
    const [val, setVal] = useState("");

  const handleAccount = (event, params) => {
    console.log(params)
    setVal(event.target.value[1])
    console.log(event.target.value)
    var rowdata = params.row;
    const obj = {
        name : rowdata.name, 
        amount : rowdata.amount, 
        date : rowdata.date, 
        category : event.target.value[1].toLowerCase(), 
        currency : "CAD", 
        account_id : rowdata.account_id, 
        account_name : rowdata.account_name, 
        transaction_id : rowdata.transaction_id, 
    };
    var category = obj.category;
    console.log(obj)
    db.collection('users').doc(currentUser.uid).collection("transactions").doc(rowdata.transaction_id).set(obj).then(() => {
      console.log("It worked")
  })
  .catch((error) => {
      console.error("Error writing document: ", error);
    });
    var docref = db.collection('users').doc(currentUser.uid);
    var d = new Date().getFullYear().toString() + '-'  + '0' + (new Date().getMonth() + 1).toString().slice(-2) + '-01' ;
    if (obj.date >= d) {
        docref.collection("categories").doc(obj.category).get().then((da) => {
          console.log(da);
          docref.collection("categories").doc(obj.category).set({
              balance : da.data().balance + parseFloat(obj.amount), 
              name : da.data().name, 
              type : da.data().type, 
              budget : da.data().budget, 
              active : true, 
              id : da.data().name.toLowerCase()
          })
        })
        docref.collection("categories").doc(rowdata.category).get().then((da) => {
          docref.collection("categories").doc(rowdata.category).set({
              balance : da.data().balance - parseFloat(obj.amount), 
              name : da.data().name, 
              type : da.data().type,
              budget : da.data().budget, 
              active : true,
              id : da.data().name.toLowerCase()
          })
        })
    }

  }
  const [account_list, account_loading, account_error] = useCollection(
    db.collection("users").doc(currentUser.uid).collection('accounts')
    ,
    {
        snapshotListenOptions: { includeMetadataChanges: true },
    }
    );
    const [category_list, category_loading, category_error] = useCollection(
      db.collection("users").doc(currentUser.uid).collection('categories').where("active","==",true)
      ,
      {
          snapshotListenOptions: { includeMetadataChanges: true },
      })
      const columns = [
        { field: 'id', headerName: 'ID', width: 80, editable: false,headerAlign: 'center', },
        { field: 'date', headerName: 'Date', width: 80, type: 'date', editable: true, headerAlign: 'center', },
        {
          field: 'name',
          headerName: 'Name',
          type: 'string',
          width: 180,
          headerAlign: 'center',
          editable: false
        },
        {
          field: 'amount',
          headerName: 'Amount',
          type: 'number',
          width: 80,
          headerAlign: 'center',
          editable: false
        },
        {
            field: 'account_name',
            headerName: 'Account',
            type: 'String',
            width: 110,
            editable: false,
            headerAlign: 'center',
          },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
            headerAlign: 'center',
          },
          {
            field: 'choosecategory',
            headerName: 'Change Category',
            width: 150,
            headerAlign: 'center',
            renderCell: (params) => (
              <strong>
                <FormControl>
          <InputLabel id="demo-simple-select-label">Change Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange = {(e) => handleAccount(e, params)}
            value={params.row.category}
          >
            {category_list.docs.map((doc,index) => <MenuItem key = {index} value={[doc.data().balance, doc.data().name]}>{doc.data().name}</MenuItem>)}
          </Select>
        </FormControl>
              </strong>
            ),
          },
      ];
    var d = new Date().getFullYear().toString() + '-'  + '0' + (new Date().getMonth() + 1).toString().slice(-2) + '-01' ;
    console.log(d)
    const [value, loading, error] = useCollection(
    db.collection("users").doc(currentUser.uid).collection('transactions').where("date",">=",d)
    ,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
    );
    

  return (
    <>
    <div className="w-100" style={{maxWidth:"150%" }}>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <>
          <div style={{ height: 800, width : 800 }}>
          <DataGrid autoPageSize pagination rowHeight={45} components={{
    Toolbar: CustomToolbar,
  }} rows={value.docs.map((doc, index) => (
        {
            id : index + 1, 
            date : doc.data().date, 
            name : doc.data().name, 
            amount : doc.data().amount, 
            account_name : doc.data().account_name,
            account_id : doc.data().account_id,
            category : doc.data().category, 
            transaction_id : doc.data().transaction_id,
        }))} columns={columns} />
    </div>

          </>
        )}
    </div>
    </>
  );
}

