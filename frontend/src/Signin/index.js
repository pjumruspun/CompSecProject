import { useEffect, useState } from 'react'
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core'
import axios from 'axios';
import { useHistory } from "react-router-dom";
import RegisConfirmDialog from './RegisConfirmDialog'
import config from '../config'

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


function Signin() {
  const classes = useStyles()
  const [username,setUsername] = useState()
  const [password,setPassword] = useState()
  const [submitEnable,setSubmitEnable] = useState(true)
  const [openConfirm,setOpenConfirm] = useState(false)
  const [accountInvalid,setAccountInvalid] = useState(false)
  const [helperText,setHelperText] = useState("")
  const history = useHistory()

  // console.log(process.env)

  const onSubmitSuccess = () => {
    setSubmitEnable(true)
    history.push("/home")
  }

  const login = () =>
  new Promise((resolve,reject)=>{
    try {
    let body = {
      username : username,
      password : password,
    }
    axios.post(`${config.BACKEND_ENDPOINT}/auth/login`,body).then((res)=>{
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
      axios.post(`${config.BACKEND_ENDPOINT}/users/create`,body).then((res)=>{
        resolve(res.data)
      }).catch((err)=>{
        reject(err)
      })
      } catch(err) {
        reject(err)
      }
  })

  const confirmRegis = () => {
    setOpenConfirm(true)
  }

  const handleClose = () => {
    setOpenConfirm(false)
  }

  const handleConfirm = async (confirm) => {
    if (confirm) {
      let response = await regis()
      if (response.username === username) {
        const { access_token } = await login()
        if (access_token) { 
          setCookie("token",access_token,5)
          onSubmitSuccess()
        }
      }
    }  else {
      setSubmitEnable(true)
    }
  }

  const onSignIn = async () => {
    if (submitEnable) {
      setSubmitEnable(false)
      try {
        let response = await login()
        // console.log(response)
        const { access_token } = response
        if (access_token) {
          setCookie("token",access_token,5)
          onSubmitSuccess()
        }
      } catch(err) {
        if (err.response.status === 401) {
          //wrong password
          setAccountInvalid(true)
          setHelperText("password wrong")
        }
        if (err.response.status === 500) {
          confirmRegis()
        }
        if (err.response.status === 404) {
          setHelperText("lose connection")
        }
      }
    }
  }

  useEffect(()=>{
    setSubmitEnable(true)
    setAccountInvalid(false)
    setHelperText("")
  },[username,password])

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
          type="password"
          value={password||""}
          error={accountInvalid}
          helperText={helperText}
        ></TextField>
        <Button fullWidth className={classes.submitButton}
          onClick={()=>onSignIn()}
          disabled={!submitEnable}
        >Submit</Button>
      </Grid>
      <RegisConfirmDialog open={openConfirm} handleClose={handleClose} handleConfirm={handleConfirm}/>
    </Grid>
  );
}

export default Signin;
