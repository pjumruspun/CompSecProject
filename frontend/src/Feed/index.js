import { useCookies } from 'react-cookie';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Post from './Post';
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: "0 auto",
    padding: theme.spacing(10),
    backgroundColor: "#eeeeee",
    minHeight: "100vh"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  headline: {
    padding: theme.spacing(2),
    fontSize: "25px",
    fontWeight: "600"
  },
  profile: {
    padding: theme.spacing(2),
    margin: "5px",
    textAlign: 'left',
    color: theme.palette.text.primary,
    backgroundColor: "#eeeeee",
    wordWrap: "break-word"
  }
}));

function Feed() {
  const classes = useStyles();
  const [user,setUser] = useState();
  const [cookie,setCookie] = useCookies();
  const authenHeader = {
    Authorization : `Bearer ${cookie.token}`
  }

  const getProfile = () => 
  new Promise((resolve,reject)=>{
    axios.get(`http://localhost:3001/profile`,{headers:authenHeader})
    .then((res)=>{
      resolve(res.data)
    }).catch((err)=>{
      reject(err)
    })
  })

  useEffect( async ()=>{
    try {
      const user = await getProfile()
      if (user.username) setUser(user)
    } catch(err) {
      console.log(err)
    }
  },[])

  return (
    <div className={classes.root}>
      <Grid container spacing={5} >
        <Grid item xs>
          <Paper className={classes.paper}>
            <div className={classes.headline} >USER</div>
            <div className={classes.profile}>
              {`Name : ${user&&user.username}`}
            </div>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.paper}>
          <div className={classes.headline} >ALL POSTS</div>
          <Post />
          <Post />
          <Post />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Feed;
