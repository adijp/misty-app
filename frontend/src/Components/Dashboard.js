import React, {useState, useEffect} from 'react'
import {Alert} from "react-bootstrap"
import {useAuth} from "../contexts/AuthContext"
import {Link, useHistory} from "react-router-dom"
import PlaidLink from "./PlaidLink.tsx"
import {db} from "../firebase"
import Transaction from "./Transaction.js"
import { useDocumentData,useCollection } from 'react-firebase-hooks/firestore'
import FixedBar from './FixedBar.js'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import headerstyles from "./Headers/index.module.scss";
import styles from "../App.module.scss";
import Grid from '@material-ui/core/Grid';
import AddTransaction  from './AddTransaction';
import EditableTable from './EditableTable'
const useStyles = makeStyles({
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    root: {
        flexGrow: 1,
        minWidth: 275,
    },
    leftpad : {
        paddingLeft : 100
    }
  });
  var cardStyle = {
    height : 200, 
    width : 20

}

export default function Dashboard() {
    const classes = useStyles();
    
    const {currentUser} = useAuth()
    const [value, loading, perror] = useDocumentData(
        db.collection("users").doc(currentUser.uid),
        {
          snapshotListenOptions: { includeMetadataChanges: true },
        }
      );
    
    var flag = false;
    var reflag = true;
    var cardMessage = "Welcome to Misty!"
    var subCardMessage = "Automatically add transactions to Misty by linking to your bank below."
    var LinkMessage = "Connect to your bank"
    if(value) {
        if (value.tokens.length > 0) {
            flag = true;
            LinkMessage = "Add another bank"
        } 
    }
    const [account_list, account_loading, account_error] = useCollection(
        db.collection("users").doc(currentUser.uid).collection('accounts')
        ,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
    });
    const [category_list, category_loading, category_error] = useCollection(
        db.collection("users").doc(currentUser.uid).collection('categories')
        ,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
    })
    const [transaction_list, transaction_loading, transaction_error] = useCollection(
        db.collection("users").doc(currentUser.uid).collection('transactions')
        ,
        {
          snapshotListenOptions: { includeMetadataChanges: true },
        }
        );
        console.log(transaction_loading)
    return (
        <>
        <FixedBar name="Dashboard">

        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <div className={classes.root + " " + classes.leftpad}>
        <Grid container spacing={12}>
            <Grid item xs={3}>
                    <Card style = {cardStyle} className={classes.root + " " + "w-25"} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {cardMessage}
                        </Typography>
                        <Typography variant="h5" component="h2">
                        {subCardMessage}
                        </Typography>
                        <PlaidLink description = {LinkMessage}></PlaidLink>
                    </CardContent>
                </Card> 
            </Grid>
            <br></br>
            <Grid item xs = {6}>
            <AddTransaction></AddTransaction>
            </Grid>
      </Grid>
      
      <Grid container spacing={12}>
        <Transaction></Transaction>
      </Grid>
      </div>
        
    <br></br>
      <br></br>
    </FixedBar>
        </>
    )
}
