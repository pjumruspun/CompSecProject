import {
  Grid,
  TextField,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core'
const axios = require('axios');

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
    transition:"background 0.3s ease-in-out",
    "&:hover" : {
      background:"#388e3c",
    }
  }
}))


function Login() {
  const classes = useStyles()

  return (
    <Grid className={classes.root} container justify="center" alignItems="center">
      <Grid className={classes.loginContainer} container direction="column" alignItems="center">
        <Typography variant="h3">Sign in</Typography>
        <TextField label="username" variant="outlined" className={classes.inputField} fullWidth></TextField>
        <TextField label="password" variant="outlined" className={classes.inputField} fullWidth></TextField>
        <Button fullWidth className={classes.submitButton}>Submit</Button>
      </Grid>
    </Grid>
  );
}

export default Login;
