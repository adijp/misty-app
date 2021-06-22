import { Refresh } from "plaid-threads";
import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import Context from "../PlaidContext";
import { v4 as uuidv4 } from 'uuid';
import { database } from "firebase-admin";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { linkToken, dispatch, accessToken } = useContext(Context);

  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const admin = require("firebase-admin")


  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
    .then((data) => {
      var UID = data.user.uid;
      var docref = db.collection("users").doc(UID)
      docref.set({
        email: email,
        createdAt: new Date().toISOString(),
        uid : UID, 
        tokens : [], 
      })
      var categories = [["Housing", "Spend"], ["Utilities", "Spend"], ["Entertainment", "Spend"], ["Education","Spend"], ["Investments", "Save"], ["Shopping","Spend"], ["Transportation","Spend"], 
      ["Healthcare","Spend"],["Misc","Spend"], ["Unclassified","Spend"]]
      categories.map(x => {
        var obj = {
          name : x[0], 
          balance : 0, 
          type : x[1], 
          id : x[0].toLowerCase(), 
          budget : 0, 
          active : true
        }
        docref.collection("categories").doc(x[0].toLowerCase()).set(obj)
        var obj1 = {
          name : "Cash", 
          official_name : "Cash", 
          currency : "CAD", 
          current_balance : 0,
          account_id : "cash"
        };
        docref.collection("accounts").doc("cash").set(obj1)
        var obj2 = {
          name : "Other", 
          official_name : "Other", 
          currency : "CAD", 
          current_balance : 0,
          account_id : "other"
        };
        docref.collection("accounts").doc("other").set(obj2)
      })
      
   })
  }

  function addTransactions(data) {
    var UID = currentUser.uid;
    const docref = db.collection('users').doc(UID);
    
    data.map(x => {
      var aname = "";
      docref.collection("accounts").doc(x.account_id).get().then((d)=> {
        if (d.data()) {
          aname = d.data().name;
        }
        return aname
      }).then((a)=>{
      var obj = {
        name : x.name, 
        amount : x.amount, 
        date : x.date, 
        category : "unclassified", 
        currency : x.iso_currency_code, 
        account_id : x.account_id, 
        account_name : a, 
        transaction_id : x.transaction_id, 
      };
      docref.collection("transactions").doc(x.transaction_id).get().then((doc) => {
        if (!doc.exists) {
          docref.collection("transactions").doc(x.transaction_id).set(obj)
          var d = new Date().getFullYear().toString() + '-'  + '0' + (new Date().getMonth() + 1).toString().slice(-2) + '-01' ;
          if (x.date >= d) {
            docref.collection("categories").doc("unclassified").get().then((da) => {
              docref.collection("categories").doc("unclassified").set({
                balance : da.data().balance + parseFloat(x.amount), 
                name : da.data().name, 
                type : da.data().type, 
                budget : da.data().budget, 
                active : true, 
                id : da.data().id
              })
            })
          }
        }
        
      }).catch((error) => {
        console.log("Error adding transaction", error);
      })
      
    })
    })
  }

  async function getTransactions() {
    var UID = currentUser.uid;
    const docref = await db.collection('users').doc(UID).collection("transactions").get();
    return docref.docs.map(doc => doc.data());
    // docref.get().then((doc) => {
    //   if (doc.exists) {
    //       return doc.data();
    //   } else {
    //       console.log("No such document!");
    //   }
    //   }).catch((error) => {
    //       console.log("Error getting document:", error);
    //   });
  }

  function addAccounts(data) {
    var UID = currentUser.uid;
    const docref = db.collection('users').doc(UID);
    data.map(x => {
      var obj = {
        name : x.name, 
        official_name : x.official_name, 
        currency : x.balances.iso_currency_code, 
        subtype : x.subtype, 
        type : x.type, 
        mask : x.mask, 
        current_balance : x.balances.current,
        account_id : x.account_id
      };
      docref.collection("accounts").doc(x.account_id).set(obj)
    })
  }

  function addCategories(UID) {
    const docref = db.collection('users').doc(UID);
    var categories = [["Housing", "Spend"], ["Utilities", "Spend"], ["Entertainment", "Spend"], ["Education","Spend"], ["Investments", "Save"], ["Shopping","Spend"], ["Transportation","Spend"], 
    ["Healthcare","Spend"],["Misc","Spend"], ["Unclassified","Spend"]]
    categories.map(x => {
      var obj = {
        name : x[0], 
        balance : 0, 
        type : x[1], 
        budget : 0, 
        active : true, 
        id : x[0].toLowerCase()
      }
      docref.collection("categories").doc(uuidv4()).set(obj)
    })
    console.log("add categories was successful")
    
  }

  function getDataPerToken(token) {
      fetch("http://localhost:3000/api/transactions" + "/" + token, {
          method: "GET", // or 'PUT'
      })
      .then((response) => response.json())
      .then((data) => {
        addAccounts(data["accounts"])
        addTransactions(data["transactions"])
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }

  function refreshTransactions() {
    console.log("refreshing transactions")
    var UID = currentUser.uid;
    const token_list = db.collection('users').doc(UID).get().then((doc) => {
      if (doc.exists) {
        doc.data().tokens.map(x => getDataPerToken(x));
      }
    })
  }

  function addToken(token) {
    var UID = currentUser.uid;
    const docref = db.collection('users').doc(UID);
    docref.get().then((doc) => {
      if (doc.exists){
        var t = doc.data().tokens;
        var j = [token]; 
        var u = [... new Set([...t, ...j])];
        docref.update({
          tokens : u
        }).then(() => {
          getDataPerToken(token);
        })
      }
    })
    // docref.update({
    //   tokens : admin.firestore.FieldValue.arrayUnion([token])
    // })
  }
  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    dispatch({
      type: "SET_STATE",
      state: {
        accessToken: null,
      },
    });
    console.log(accessToken)
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email).then(
      db.collection("users").doc(currentUser.uid).update({email : email})
    );
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    addToken, 
    getTransactions, 
    refreshTransactions
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
