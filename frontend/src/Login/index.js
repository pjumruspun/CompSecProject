import { useState } from 'react'
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core'
import axios from 'axios';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme)=>({
  root : {
    height : "100vh",
    background:"#eeeeee",
  },
  loginContainer : {
    background:"white",
    width:"320px",
    padding:"32px 32px",
    borderRadius:"8px",
    boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
    "& fieldset" : {
      borderRadius:"8px",
    }
  },
  inputField : {
    margin:"16px 0",
  },
  submitButton : {
    background:"#4caf50",
    color:"white",
    height:"40px",
    marginTop:"16px",
    borderRadius:"8px",
    transition:"background 0.3s ease-in-out",
    "&:hover" : {
      background:"#388e3c",
    }
  },
  header : {
    color:"#363636",
  }
}))

function setCookie(name,value,minutes) {
  var expires = "";
  if (minutes) {
      var date = new Date();
      date.setTime(date.getTime() + (minutes*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function Login() {
  const classes = useStyles()
  const [username,setUsername] = useState()
  const [password,setPassword] = useState()
  const history = useHistory()

  // console.log(process.env)

  const onSubmitSuccess = () => {
    history.push("/home")
  }

  const login = () =>
  new Promise((resolve,reject)=>{
    try {
    let body = {
      username : username,
      password : password,
    }
    axios.post(`http://localhost:3001/auth/login`,body).then((res)=>{
      resolve(res.data)
    }).catch((err)=>{
      reject(err)
    })
    } catch(err) {
      reject(err)
    }
  })

  const regis = () =>
  new Promise((resolve,reject)=>{
    try {
      let body = {
        username : username,
        hashedPassword : password,
        isModerator : false,
      }
      axios.post(`http://localhost:3001/users/create`,body).then((res)=>{
        resolve(res.data)
      }).catch((err)=>{
        reject(err)
      })
      } catch(err) {
        reject(err)
      }
  })

  const onSignIn = async () => {
    console.log("sign in")
    try {
      let response = await login()
      const { access_token } = response
      if (access_token) {
        setCookie("token",access_token,5)
        onSubmitSuccess()
      }
    } catch(err) {
      console.log(err)
      let response = await regis()
      if (response.username === username) {
        const { access_token } = await login()
        // console.log("resis success")
        if (access_token) { 
          setCookie("token",access_token,5)
          onSubmitSuccess()
        }
      }
    }
  }

  return (
    <Grid className={classes.root} container justify="center" alignItems="center">
      <Grid className={classes.loginContainer} container direction="column" alignItems="center">
        <Typography variant="h3" className={classes.header}>SIGN IN</Typography>
        <TextField label="username" variant="outlined" className={classes.inputField} fullWidth
          onChange={(e)=>setUsername(e.target.value)}
          value={username||""}
        />
        <TextField label="password" variant="outlined" className={classes.inputField} fullWidth
          onKeyPress={(e)=>{
            if (e.key === "Enter") {
              onSignIn()
            }
          }}
          onChange={(e)=>setPassword(e.target.value)}
          value={password||""}
        ></TextField>
        <Button fullWidth className={classes.submitButton}
          onClick={()=>onSignIn()}
        >Submit</Button>
      </Grid>
    </Grid>
  );
}

export default Login;
