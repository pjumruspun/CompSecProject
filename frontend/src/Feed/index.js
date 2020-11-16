import { useCookies } from 'react-cookie';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Post from './Post';
import axios from 'axios'
import config from '../config'
import Button from '@material-ui/core/Button';
import NewPost from './NewPost'
import { Redirect } from "react-router-dom";

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
  },
  logoutBUtton : {
    background:"#4caf50",
    margin:"16px 0",
    "&:hover" : {
      background:"#388e3c",
    }
  }
}));

function setCookie(name,value,minutes) {
  var expires = "";
  if (minutes) {
      var date = new Date();
      date.setTime(date.getTime() + (minutes*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function Feed() {
  const classes = useStyles();
  const [user,setUser] = useState(); //{username,isModerator}
  const [cookie,setCookie] = useCookies();
  const [feed,setFeed] = useState([]);
  const [content,setContent] = useState("");

  // const getCookie = () =>{
  //   return cookie.token
  // }

  const authenHeader = {
    headers : {
      Authorization : `Bearer ${getCookie("token")}`
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
      reject(err)
    })
  })

  const refetchPost = async () => {
    try {
      const feed = await getAllPost()
      if (feed) setFeed(feed)
    } catch(err) {
      if (err.response) {
        if (err.response.status === 401) {
          console.log("401")
          return window.location=`/login`
        }
      }
    }
  }

  const handleContent = (content) => {
    setContent(content)
  }


  const createPost = () =>
  new Promise((resolve,reject)=>{
    if (content.length > 0) {
      let body = {
        content : content,
      }
      axios.post(`${config.BACKEND_ENDPOINT}/posts/create`,body,authenHeader)
      .then((res)=>{
        resolve(res.data)
      }).catch((err)=>{
        reject(err.response)
      })
    }
  })

  const handlePost = async () => {
    try {
      const response = await createPost()
      if (response.username === user.username) {
        setContent("")
        refetchPost()
      }
    } catch (err) {

    }
  }

  const onLogout = () => {
    setCookie("token","",0)
    window.location="/login"
  }

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

  useEffect(()=>{
    window.setInterval(function(){
      refetchPost()
    }, 5000);
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
          <Button fullWidth onClick={onLogout} className={classes.logoutBUtton}>Log out</Button>
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.paper}>
          <div className={classes.headline} >ALL POSTS</div>
          {/* <Post />
          <Post />
          <Post /> */}
          <NewPost username={user?user.username:""} content={content} handleContent={handleContent} onPost={handlePost}/>
          {feed.map((post,i)=>(
            <Post 
            post={post} 
            authenHeader={authenHeader} 
            username={user.username||""} 
            refetchPost={refetchPost} 
            key={`feed-${i}`}
            isModerator = {user.isModerator}
            />
          ))}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Feed;
