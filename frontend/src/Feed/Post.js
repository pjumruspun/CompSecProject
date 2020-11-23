import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TextField from '@material-ui/core/TextField';
import AddCommentIcon from '@material-ui/icons/AddComment';
import Comment from './Comment';
import config from '../config'
import axios from 'axios';
import { Menu,
  MenuItem,
  Snackbar,
  InputAdornment,
} from '@material-ui/core'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

const useStyles = makeStyles((theme) => ({
  post: {
    padding: theme.spacing(2),
    margin: "20px",
    textAlign: 'left',
    color: theme.palette.text.primary,
    backgroundColor: "#eeeeee",
    wordWrap: "break-word"
  },
  postHeader: {
    borderBottom: '1px solid black'
  },
  postData: {
    padding: "16px 16px 4px 16px"
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: "#47a779",
  },
  commentWrap: {
    paddingTop: "10px !important",
    paddingBottom: "20px !important",
    paddingLeft: "15px",
    paddingRight: "50px",
  },
  comment: {
    width: "80%",
    paddingBottom: "5px",
    verticalAlign: "middle",
    marginRight: "10px"
  },
  form: {
    flex: 'row',
  },
  input_text: {
    backgroundColor: '#ffffff'
  },
  button: {
    marginRight: '2px'
  }
}));

var edittedContent = ""


export default function Post({post, authenHeader, username:signedUsername, refetchPost, isModerator}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [comment,setComment] = useState("")
  const [commentList,setCommentList] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [openNoti,setOpenNoti] = useState(false)
  const [messageNoti,setMessageNoti] = useState("")
  const [postEditing,setPostEditing] = useState(false)

  const date = new Date(post.publishedTime)
  const {content, postId, publishedTime, username} = {...post,publishedTime:`${date.toDateString()} ${date.toLocaleTimeString()}`}

  useEffect( async ()=>{
    try {
      const commentsList = await getComments()
      setCommentList(commentsList)
    } catch(err) {
      if (err.response.status === 401) {
        // console.log(window.location.hostname)
        return window.location=`/login`
      }
    }
    
  },[post])

  // useEffect(()=>{
  //   if (postEditing) {
  //     setPostContentComp(TextField)
  //   } else {
  //     setPostContentComp(Typography)
  //   }
  // },[postEditing])
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCloseNoti = () => {
    setOpenNoti(false)
  }

  const setNotification = (message,type) => {
    setMessageNoti(message)
    setOpenNoti(true)
  }

  const refetchComment = async () => {
    try {
      const commentsList = await getComments()
      setCommentList(commentsList)
    } catch (err) {

    }
  }

  const getComments = () =>
  new Promise((resolve,reject)=>{
    axios.get(`${config.BACKEND_ENDPOINT}/comments/findbypostid/${postId}`,authenHeader)
    .then((res)=>{
      resolve(res.data)
    })
    .catch((err)=>{
      reject(err)
    })
  })

  const createComment = () => 
  new Promise((resolve,reject)=>{
    let body = {
      post : postId,
      content : comment,
    }
    axios.post(`${config.BACKEND_ENDPOINT}/comments/create`,body,authenHeader)
    .then((res)=>{
      resolve(res.data)
    })
    .catch((err)=>{
      reject(err.response)
    })
  })

  const deletePost = () => 
  new Promise((resolve,reject)=>{
    axios.delete(`${config.BACKEND_ENDPOINT}/posts/delete/${postId}`,authenHeader)
    .then((res)=>{
      console.log(res.data)
      resolve(res.data)
    })
    .catch((err)=>{
      reject(err.response)
    })
  })

  const editPost = () =>
  new Promise((resolve,reject)=>{
    let body = {
      postId : postId,
      content : edittedContent,
      username : signedUsername,
    }
    axios.put(`${config.BACKEND_ENDPOINT}/posts/update`,body,authenHeader)
    .then((res)=>{
      resolve(res.data)
    })
    .catch((err)=>{
      reject(err.response)
    })
  })

  const handleComment = (value) => {
    setComment(value)
  }

  const onEditPost = () => {
    if (signedUsername === username || isModerator) {
      setPostEditing(true)
      edittedContent = content
    } else {
      setTimeout(()=>{
        setNotification("เจ้าของ post เท่านั้นจึงจะมีสิทธิ์แก้ไข post")
      },100)
    }
  }
  const handlePostComment = async (e) => {
    e.preventDefault()
    try {
      if (comment.length > 0) {
      const response = await createComment()
      // console.log(response)
      if (response.post === postId) {
        setComment("")
        setExpanded(true)
        refetchComment()
      }
      } else {
        setNotification(`คุณคิดอะไรอยู่ ${signedUsername}`)
      }
    } catch(err) {
      console.log(err)
    }
  }

  const handleDeletePost = async () => {
    try {
      const response = await deletePost()
      if (response.affected > 0) {
        setNotification("ลบ Post สำเร็จ")
        refetchPost()
      }
      else {
        setNotification("ลบ Post ไม่สำเร็จ")
      }
    } catch(err) {
      if (err.status === 401) {
        setNotification("เจ้าของ post เท่านั้นที่จะมีสิทธิ์ลบ post นี้")
      }
      if (err.status === 404) {
        setNotification("กรุณาตรวจสอบการเชื่อมต่อ")
      }
    }
  }

  const handleEditPost = async () => {
    try {
      const response = await editPost()
      // console.log(response)
      if (response.affected > 0) {
        setNotification("แก้ไข post สำเร็จ")
        setPostEditing(false)
        refetchPost()
      } else {
        setNotification("แก้ไข post ไม่สำเร็จ")
      }
    } catch(err) {
      console.log(err)
      if (err.status === 401) setNotification("เจ้าของ post เท่านั้นที่จะมีสิทธิ์แก้ไข post นี้")
      if (err.status === 404) setNotification("โปรดตรวจสอบการเชื่อมต่อ")
    }
  }

  const openMenu = (e) => {
    // console.log(e.currentTarget)
    setAnchorEl(e.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const menuRender = () => (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={closeMenu}
    >
      <MenuItem onClick={()=>{onEditPost();closeMenu()}}>edit</MenuItem>
      <MenuItem onClick={()=>{handleDeletePost();closeMenu()}}>delete</MenuItem>
    </Menu>
  )

  const notiSnackbarRender = () => (
    <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    open={openNoti}
    autoHideDuration={3000}
    onClose={handleCloseNoti}
    message={messageNoti}
    >

    </Snackbar>
  )
  return (
    <Card className={classes.post} key={`post-${publishedTime}`}>
      {console.log(isModerator)}
      <CardHeader
        className={classes.postHeader}
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {username?username[0].toUpperCase():"?"}
          </Avatar>
        }
        action={ ((signedUsername === username) || isModerator) &&
          <IconButton aria-label="settings" onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
        }
        title={username}
        subheader={publishedTime}
      />
      <CardContent className={classes.postData} >
        {!postEditing?
        <Typography variant={postEditing?"outlined":"body2"} color="textPrimary" component="p">
          {content}
        </Typography>:
        <TextField variant="outlined" defaultValue={content} size="small"
          onChange={(e)=>{edittedContent=e.target.value}}
          onKeyPress={(e)=>{
            if (e.key === "Enter") {
              // console.log(edittedContent)
              handleEditPost()
            }
          }}
          fullWidth
          multiline
          InputProps={{
            endAdornment: <InputAdornment position="start"><KeyboardReturnIcon/></InputAdornment>,
          }}
          />
        }
      </CardContent>
      <CardActions disableSpacing>
        <Typography variant="body2" color="textSecondary" component="p">
          {`Comments (${commentList.length})`}
        </Typography>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className={classes.commentWrap} >
          {/* <Comment />
          <Comment />
          <Comment /> */}
          {commentList.map((comment,i)=>(
            postId === comment.post &&
            <Comment 
              key ={`comment-comp-${i}-${publishedTime}`}
              comment={comment} 
              signedUsername={signedUsername} 
              setNotification={setNotification} 
              authenHeader={authenHeader}
              refetchComment={refetchComment}
              isModerator={isModerator}
            />
          ))}
        </CardContent>
      </Collapse>
      <form className={classes.form} noValidate onSubmit={handlePostComment} autoComplete="off">
        <TextField 
          className={classes.comment} 
          id="outlined-basic" 
          InputProps={{ classes: { input: classes.input_text } }} 
          variant="filled" 
          label="Enter your comment here!" 
          onChange={(e)=>handleComment(e.target.value)}
          value={comment}
          onKeyPress={(e)=>{
            if (e.key==="Enter") {
              // handlePostComment()
              // console.log(comment)
            }
          }}
        />
        <IconButton color="primary" aria-label="add to shopping cart"  onClick={handlePostComment}>
          <AddCommentIcon/>
        </IconButton>
      </form>
      {menuRender()}
      {notiSnackbarRender()}
    </Card>
  );
}
