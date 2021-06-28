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
import Paper from '@material-ui/core/Paper';
import ButtonTwo from "plaid-threads/Button";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';
import { v4 as uuidv4 } from 'uuid';
import AddCategory from './AddCategory'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';

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
    width : 50
}
export default function AddTransaction() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const {currentUser} = useAuth()
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [account, setAccount] = useState('');
    const [datepicker, setDate] = useState(new Date('2021-06-18T21:11:54'));
    const [type, setType] = useState('Withdrawal');
    const [category, setCategory] = useState('');
    const handleAmount = (event) => {
        if (event.target.value < 0) {
            setAmount(0)
        } else {
            setAmount(event.target.value);
        }
        
    };
    const handleAccount = (event) => {
        setAccount(event.target.value)
    }
    const handleType = (event) => {
        setType(event.target.value)
    }
    const handleName = (event) => {
        setName(event.target.value)
    }
    const handleDate = (date) => {
        setDate(date)
    }
    const handleCategory = (event) => {
        setCategory(event.target.value)
    }
    const [account_list, account_loading, account_error] = useCollection(
        db.collection("users").doc(currentUser.uid).collection('accounts')
        ,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    const [category_list, category_loading, category_error] = useCollection(
        db.collection("users").doc(currentUser.uid).collection('categories').where("active", "==",true)
        ,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        })
    const [value, loading_tran, perror] = useDocumentData(
        db.collection("users").doc(currentUser.uid),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
        );

    function getAccountName(id) {
        var a = account_list.docs.map((doc,index) => {
            if (id === doc.data().account_id) {
                return doc.data().name
            }
        })
        for (var i =0 ; i < a.length; i++) {
            if (a[i] !== undefined) {
                return a[i]
            }
        }
    }
    function getDate(time) {
        return time.getFullYear() + "-" + (time.getMonth()+1) + "-"  + time.getDate();
    }
    async function handleDialogSubmit(e) {
        const docref = db.collection('users').doc(currentUser.uid);
        setLoading(true)
        e.preventDefault()
        if (name === '' || amount === '' || category === '' || account === '') {
            setError("Missing form fields")
            setLoading(false)
            return null;
        }
        var aname = await getAccountName(account);
        var tid = uuidv4();
        var flag = 1;
        if (type == "Deposit") {
            flag = -1;
        }
        const obj = {
            name : name, 
            amount : flag * amount, 
            date : getDate(datepicker), 
            category : category.toLowerCase(), 
            currency : "CAD", 
            account_name : aname,
            account_id : account, 
            transaction_id : tid, 
        };
        
        docref.collection("transactions").doc(obj.transaction_id).set(obj)
        var d = new Date().getFullYear().toString() + '-'  + '0' + (new Date().getMonth() + 1).toString().slice(-2) + '-01' ;
        if (obj.date >= d) {
        docref.collection("categories").doc(obj.category).get().then((da) => {
            docref.collection("categories").doc(obj.category).set({
                balance : da.data().balance + parseFloat(obj.amount), 
                name : da.data().name, 
                type : da.data().type, 
                budget : da.data().budget, 
                active : true,
                id : da.data().name.toLowerCase()
            })
        })
        }
        setLoading(false)
        setOpen(false)
        setError("")
        setCategory("")
        setType("")
        setAmount("")
        setAccount("")
        setName("")
    }
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
    return (
        <>
        <Grid container spacing={1}>
            <Grid item xs={6} sm = {6} md = {3}>
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
            <Grid item xs={6} sm = {6} md = {3}>
                    <AddCategory height="200"></AddCategory>
            </Grid>
            <Grid item xs={6} sm = {6} md = {3}>
            
                <Card style = {cardStyle} className={classes.root + " " + "w-25"} variant="outlined">
                <CardContent>

                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Add a transaction
                    </Typography>
                    <Typography variant="h5" component="h2">
                    Manually add a transaction and its details
                    </Typography>
                    <div>
                    <div className = {headerstyles.linkButton}> 
                    <ButtonTwo type="button" onClick={handleClickOpen} large>Add a transaction</ButtonTwo>
                    </div>
                    
                    </div>
                    
                    <br></br>
                </CardContent>
                </Card>
            </Grid>

        </Grid>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add a transaction</DialogTitle>
            {error && <Alert variant="danger">{error}</Alert>}

            <DialogContent>
            <DialogContentText>
                Please enter the following fields
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Expense name"
                type="text"
                fullWidth
                value = {name}
                onChange = {handleName}
                autocomplete="off"
            />
            <TextField
                autoFocus
                margin="dense"
                id="amount"
                label="Amount"
                type="number"
                min="0"
                width="50%"
                value = {amount}
                onChange = {handleAmount}
            /> 
            <br></br>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date picker inline"
                    value={datepicker}
                    onChange={handleDate}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
            
                    />
            </MuiPickersUtilsProvider>
            <br></br>
            <InputLabel width="100%" id="demo-simple-select-label">Account Name</InputLabel>
            <Select 
            width="100%"
            label="Account"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={account}
            onChange = {handleAccount}
            >
            {account_list && account_list.docs.map((doc,index) => <MenuItem key = {index} value={doc.data().account_id}>{doc.data().name}</MenuItem>)}                            
            </Select>
            <br></br>
            <br></br>
            <InputLabel width="100%" id="demo-simple-select-label">Category</InputLabel>
            <Select 
            width="100%"
            label="Category"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category}
            onChange = {handleCategory}
            >
            {category_list && category_list.docs.map((doc,index) => <MenuItem key = {index} value={doc.data().name}>{doc.data().name}</MenuItem>)}                            
            </Select>
            <br></br>
            <br></br>
            <InputLabel width="100%" id="demo-simple-select-label">Account type</InputLabel>
            <Select 
            width="100%"
            label="Type"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            onChange = {handleType}
            >
            <MenuItem value = "Withdrawal">Withdrawal</MenuItem>
            <MenuItem value="Deposit">Deposit</MenuItem>
            </Select>

            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button disabled={loading} onClick={handleDialogSubmit} color="primary">
                Submit
            </Button>

            </DialogActions>
        </Dialog>
    </>
    )
}