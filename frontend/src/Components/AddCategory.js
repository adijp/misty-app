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
  
export default function AddCategory(props) {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const {currentUser} = useAuth()
    const handleClickOpen = () => {
        setOpen(true);
    };
    var cardStyle = {
        width : 300,
        height : props.height || 440
    }
    const handleClose = () => {
        setOpen(false);
    };

    const [budget, setBudget] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('Spend');
    const handleBudget = (event) => {
        if (event.target.value < 0) {
            setBudget(0)
        } else {
            setBudget(event.target.value);
        }
        
    };
    const handleType = (event) => {
        setType(event.target.value)
    }
    const handleName = (event) => {
        setName(event.target.value)
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
      }
      
    async function handleDialogSubmit(e) {
        const docref = db.collection('users').doc(currentUser.uid);
        setLoading(true)
        e.preventDefault()
        if (name === '' || budget === '' || type === '') {
            setError("Missing form fields")
            setLoading(false)
            return null;
        }
        var lname = name.toLowerCase();
        docref.collection("categories").doc(lname).get().then((doc) => {
            if (doc.exists) {
                docref.collection("categories").doc(lname).get().then((doc) => {
                    if (doc.data().active === false) {
                        const obj = {
                            balance : 0,
                            budget : budget, 
                            id : lname,
                            type : type, 
                            name : capitalizeFirstLetter(name), 
                            active : true
                        };
                        docref.collection("categories").doc(lname).set(obj)
                        setLoading(false)
                        setOpen(false)
                        setError("")
                        setName("")
                        setType("")
                        setBudget("")
                    } else {
                        setError("Category already exists")
                        setLoading(false)
                        return null;
                    }
                })
            } else {
                const obj = {
                    balance : 0,
                    budget : budget, 
                    id : lname,
                    type : type, 
                    name : capitalizeFirstLetter(name), 
                    active : true
                };
                docref.collection("categories").doc(lname).set(obj)
                setLoading(false)
                setOpen(false)
                setError("")
                setName("")
                setType("")
                setBudget("")
            }
        })
        
    }
    return (
        <>
    <Card style = {cardStyle} className={classes.root + " " + "w-25"} variant="outlined">
    <CardContent>

        <Typography className={classes.title} color="textSecondary" gutterBottom>
        Add a new category
        </Typography>
        <Typography variant="h5" component="h2">
        Create a new category by adding the following info:
        </Typography>
        <div>
        <div className = {headerstyles.linkButton}> 
        <ButtonTwo type="button" onClick={handleClickOpen} large>Add a category</ButtonTwo>
        </div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add a category</DialogTitle>
            {error && <Alert variant="danger">{error}</Alert>}

            <DialogContent>
            <DialogContentText>
                Please enter the following fields
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Category name"
                type="text"
                fullWidth
                value = {name}
                onChange = {handleName}
                autocomplete="off"
            />
            <TextField
                autoFocus
                margin="dense"
                id="budget"
                label="Budget"
                type="number"
                min="0"
                width="50%"
                value = {budget}
                onChange = {handleBudget}
            /> 
            <br></br>
            <InputLabel width="100%" id="demo-simple-select-label">Category type</InputLabel>
            <Select 
            width="100%"
            label="Type"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            onChange = {handleType}
            >
            <MenuItem value = "Spend">Spend</MenuItem>
            <MenuItem value="Save">Save</MenuItem>
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
        </div>
        
        <br></br>
    </CardContent>
    </Card>
    </>
    )
}