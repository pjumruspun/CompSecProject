import { useCookies } from 'react-cookie';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Post from './Post';
import axios from 'axios'
import config from '../config'
import Button from '@material-ui/core/Button';

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
  const [user,setUser] = useState(); //{username,isModerator}
  const [cookie,setCookie] = useCookies();
  const [feed,setFeed] = useState([]);
  const authenHeader = {
    headers : {
      Authorization : `Bearer ${cookie.token}`
    }
  }


  const getProfile = () => 
  new Promise((resolve,reject)=>{
    axios.get(`${config.BACKEND_ENDPOINT}/profile`,authenHeader)
    .then((res)=>{
      resolve(res.data)
    }).catch((err)=>{
      reject(err)
    })
  })

  const getAllPost = () =>
  new Promise((resolve,reject)=>{
    axios.get(`${config.BACKEND_ENDPOINT}/posts`,authenHeader)
    .then((res)=>{
      resolve(res.data)
    }).catch((err)=>{
      reject(err.response)
    })
  })

  const refetchPost = async () => {
    try {
      const feed = await getAllPost()
      if (feed) setFeed(feed)
    } catch(err) {

    }
  }


  const createPost = (content) =>
  new Promise((resolve,reject)=>{
    let body = {
      content : "hello world",
    }
    axios.post(`${config.BACKEND_ENDPOINT}/posts/create`,body,authenHeader)
    .then((res)=>{
      resolve(res.data)
    }).catch((err)=>{
      reject(err.response)
    })
  })

  useEffect( async ()=>{
    try {
      const user = await getProfile()
      if (user.username) setUser(user)
      const feed = await getAllPost()
      // console.log(feed)
      if (feed) setFeed(feed)
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
          {/* <Post />
          <Post />
          <Post /> */}
          {feed.map((post)=>(
            <Post post={post} authenHeader={authenHeader} username={user.username||""} refetchPost={refetchPost}/>
          ))}
          </Paper>
        </Grid>
      </Grid>
      <Button onClick={()=>{createPost()}}>demo new post</Button>
    </div>
  );
}

export default Feed;
