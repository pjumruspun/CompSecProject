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

function chunkString (str, len) {
  const size = Math.ceil(str.length/len)
  const r = Array(size)
  let offset = 0
  
  for (let i = 0; i < size; i++) {
    r[i] = str.substr(offset, len)
    offset += len
  }
  
  return r
}

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function genKeySeed(token) {
  let currentMin = 0
  let key_seed = []
  while (true) {
    let seed = getRandomArbitrary(currentMin,Math.min(currentMin+getRandomArbitrary(currentMin,config.token_split_key.length-1),config.token_split_key.length-1) )
    let key = config.token_split_key[seed]
    key_seed.push(key)
    if (seed >= config.token_split_key.length-1) {
      break
    }
    currentMin = seed+1
  }
  return {
    keys : key_seed,
    tokenLen : Math.ceil(token.length/key_seed.length),
  }

}

const cipher = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

  return text => text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
}


function Signin() {
  const classes = useStyles()
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [submitEnable,setSubmitEnable] = useState(true)
  const [openConfirm,setOpenConfirm] = useState(false)
  const [accountInvalid,setAccountInvalid] = useState(false)
  const [helperText,setHelperText] = useState("")
  const history = useHistory()
  const apotoxin4869 = cipher(config.xeSv)

  // console.log(process.env)

  const onSubmitSuccess = () => {
    setSubmitEnable(true)
    history.push("/home")
  }

  const setToken = (token) => {
    // const split_token = chunkString(token,19)
    // console.log(split_token)
    // const tokenSplitNum = config.token_split_range[getRandomArbitrary(0,5)]
    // console.log(tokenSplitNum)
    const {keys, tokenLen} = genKeySeed(token)
    const splited_token = chunkString(token,tokenLen)
    keys.forEach((key,i)=>{
      
      setCookie(key,apotoxin4869(splited_token[i]),5)
    })
    return 0

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

 
  const confirmRegis = () => {
    setOpenConfirm(true)
  }

  const handleClose = () => {
    setOpenConfirm(false)
  }


  const onSignIn = async () => {
    if (submitEnable) {
      setSubmitEnable(false)
      try {
        let response = await login()
        // console.log(response)
        const { access_token } = response
        if (access_token) {
          // setCookie("token",access_token,5)
          setToken(access_token)
          onSubmitSuccess()
        }
      } catch(err) {
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
    </Grid>
  );
}

export default Signin;
