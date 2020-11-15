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
} from '@material-ui/core'

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

export default function Post({post, authenHeader}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [comment,setComment] = useState("")
  const [commentList,setCommentList] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [openNoti,setOpenNoti] = useState(false)
  const [messageNoti,setMessageNoti] = useState("")

  const date = new Date(post.publishedTime)
  const {content, postId, publishedTime, username} = {...post,publishedTime:`${date.toDateString()} ${date.toLocaleTimeString()}`}

  useEffect( async ()=>{
    const commentsList = await getComments()
    setCommentList(commentsList)
    console.log(commentsList)
  },[post])
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCloseNoti = () => {
    setOpenNoti(false)
  }

  const getComments = () =>
  new Promise((resolve,reject)=>{
    axios.get(`${config.BACKEND_ENDPOINT}/comments/findbypostid/${postId}`,authenHeader)
    .then((res)=>{
      resolve(res.data)
    })
    .catch((err)=>{
      reject(err.response)
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

  const handleComment = (value) => {
    setComment(value)
  }

  const postComment = async (e) => {
    e.preventDefault()
    try {
      const response = await createComment()
      console.log(response)
      if (response.post === postId) setComment("")
    } catch(err) {
      console.log(err)
    }
  }

  const handleDeletePost = async () => {
    try {
      const response = await deletePost()
      if (response.affected > 0) {
        setOpenNoti(true)
        setMessageNoti("ลบ post สำเร็จ")
      }
      else {
        setOpenNoti(true)
        setMessageNoti("คุณไม่มีสิทธิ์ในการลบ post นี้")
      }
    } catch(err) {
      setOpenNoti(true)
      setMessageNoti("คุณไม่มีสิทธิ์ในการลบ post นี้")
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
      <MenuItem>edit</MenuItem>
      <MenuItem onClick={()=>handleDeletePost()}>delete</MenuItem>
    </Menu>
  )

  const notiSnackbarRender = () => (
    <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    open={openNoti}
    autoHideDuration={6000}
    onClose={handleCloseNoti}
    message={messageNoti}
    >

    </Snackbar>
  )
  return (
    <Card className={classes.post} >
      <CardHeader
        className={classes.postHeader}
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {username?username[0].toUpperCase():"?"}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
        }
        title={username}
        subheader={publishedTime}
      />
      <CardContent className={classes.postData} >
        <Typography variant="body2" color="textPrimary" component="p">
        {content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Typography variant="body2" color="textSecondary" component="p">
          Comments
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
          {commentList.map((comment)=>(
            postId === comment.post &&
            <Comment comment={comment}/>
          ))}
        </CardContent>
      </Collapse>
      <form className={classes.form} noValidate onSubmit={postComment} autoComplete="off">
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
              // postComment()
              console.log(comment)
            }
          }}
        />
        <IconButton color="primary" aria-label="add to shopping cart">
          <AddCommentIcon />
        </IconButton>
      </form>
      {menuRender()}
      {notiSnackbarRender()}
    </Card>
  );
}
