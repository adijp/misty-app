import React, {useState, useEffect} from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { PieChart } from 'react-minimal-pie-chart';
import {db} from "../firebase"
import {useAuth} from "../contexts/AuthContext"

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


export default function CategoryCard(props) {
    const [budget, setBudget] = useState(0);
    const {currentUser} = useAuth()
    const classes = useStyles();
    const updateBudget = (event) => {
        if (event.target.value < 0) {
            setBudget(0)
        } else {
            setBudget(event.target.value);
        }
        
    };

    function handleUpdate(cid) {
        const docref = db.collection('users').doc(currentUser.uid);
        const obj = {
            balance : props.balance, 
            name : props.name, 
            type : props.type, 
            budget : budget, 
            active : true, 
            id : props.name.toLowerCase()
        }
        docref.collection('categories').doc(props.name.toLowerCase()).set(obj).then(()=> {
            setBudget(0)
        })
    }
    function handleDelete(cid) {
        const docref = db.collection('users').doc(currentUser.uid);
        var lname = props.name.toLowerCase();
        const obj = {
            balance : 0, 
            name : props.name, 
            type : props.type, 
            budget : 0, 
            active : false, 
            id : lname
        }
        var lid = props.name.toLowerCase();
        docref.collection('categories').doc(lid).set(obj)
        docref.collection('transactions').where("category", "==", lid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((da) => {
                if (da.data().category === lid){
                    console.log(da.data())
                    const obj = {
                        name : da.data().name, 
                        amount : da.data().amount, 
                        date : da.data().date, 
                        category : "unclassified", 
                        currency : "CAD", 
                        account_name : da.data().account_name,
                        account_id : da.data().account_id, 
                        transaction_id : da.data().transaction_id, 
                    };
                    console.log(obj, da.data())
                    docref.collection('transactions').doc(obj.transaction_id).set(obj).then(() => {
                        console.log("updated transaction")
                    }).catch((error) => {
                        console.log("Error updating document: ", error);
                    });
                    var d = new Date().getFullYear().toString() + '-'  + '0' + (new Date().getMonth() + 1).toString().slice(-2) + '-01' ;
                    if (obj.date >= d) {
                        docref.collection("categories").doc("unclassified").get().then((da) => {
                            docref.collection("categories").doc("unclassified").set({
                                balance : da.data().balance + parseFloat(obj.amount), 
                                name : da.data().name, 
                                type : da.data().type, 
                                budget : da.data().budget, 
                                active : true, 
                                id : da.data().id
                            })
                        })
                    }
                    
                }
            });  
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }
    function getValue() {
        var a = 0;
        if(props.balance < 0) {
            return 0
        } else {

        }
    }

    function getColor() {
        var color = ['#4caf50', '#66bb6a','#81c784','#fff176','#ffee58','#ffeb3b','#fdd835','#fbc02d','#f9a825','#f57f17','#ef6c00','#e65100']
        var index = Math.ceil((getData()+1)/10)-1;
        console.log(props.name,"getcolor", index)
        if (props.type === "Spend") {
            console.log(props.name,"getcolor", index, color[index])
            return color[index]
        } else {
            console.log(props.name,"getcolor", index, color[10 - index])
            return color[10 - index]
        }
    }

    function getData() {
        var a = 1000;
        if (props.budget === 0 && props.balance > 0) {
            a = 100
        } else if (props.balance < 0) {
            a = 0
        } else if (props.balance > props.budget ){
            a = 100
        } else if (props.balance === 0 && props.balance === 0){
            a = 0
        } else {
            a = Math.min(100, Math.ceil(props.balance / props.budget * 100))
        }
        console.log(props.name, a)
        return a
    }
    function getChartText() {
        if (props.budget === 0 && props.balance > 0) {
            return 100;
        } else if (props.balance < 0 || props.budget === 0) {
            return 0
        } else {
            return Math.ceil(props.balance / props.budget * 100)
        }
    }
  return (
    <Card className={classes.root}>
      <CardContent>
      <Typography className = {classes.bigF} variant="body2" color="textSecondary" component="p">
          {props.name}. {Math.ceil(props.balance)}/{props.budget} 
          
          <div className = {classes.textF}>
        <TextField
          id="filled-helperText"
          label="Modify budget"
          defaultValue={props.budget}
          variant="filled"
          type="number"
          value = {budget}
          onChange = {updateBudget}
        />
        </div>
        </Typography>
        <br></br> <br></br>
        <PieChart
      data={[{ value: getData(), color: getColor() }, {value : 100 - getData(), color : '#f5f5f5'}]}
      totalValue={100}
      lineWidth={20}
      startAngle={270}
      label={({ dataEntry }) => getChartText() + "%"}
      labelStyle={{
        fontSize: '15px',
        fontFamily: 'sans-serif',
        fill: '#BBDEFB',
      }}
      radius={40}
      labelPosition={0}
    />
        
        
      </CardContent>
      <CardActions disableSpacing>
        <Button size="small" color="primary" disabled = {props.id === "unclassified"} onClick = {(e) => handleDelete(props.id)}>
          Delete
        </Button>
        <Button size="small" color="secondary" onClick = {(e) => handleUpdate(props.id)}>
          Update
        </Button>
      </CardActions>
    </Card>
  );
}
