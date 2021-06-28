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
        paddingLeft : 150
    }
  });
  var cardStyle = {
    height : 200, 
    width : 40

}

export default function Dashboard() {
    const classes = useStyles();
    
    const {currentUser} = useAuth()
    
    
    
    return (
        <>
        <FixedBar name="Dashboard">

        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <div className={classes.root + " " + classes.leftpad}>
        
        <AddTransaction></AddTransaction>
        <br></br>
        <br></br>
        <Grid container spacing={12}>
          <Transaction></Transaction>
        </Grid>
        </div>
    </FixedBar>
        </>
    )
}
