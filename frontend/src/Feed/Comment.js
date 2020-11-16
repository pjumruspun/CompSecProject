import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
    IconButton,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
} from '@material-ui/core'
import config from '../config'
import axios from 'axios'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

const useStyles = makeStyles({
    root: {
        maxWidth: '100%',
        marginBottom: '10px'
    },
    header: {
        display: 'flex',
        flexDirection: 'row'
    },
    time: {
        marginLeft: '10px',
        fontSize: '12px',
        lineHeight: '27px'
    },
    content : {
        display:"flex",
        flexDirection:"row",
    }
});

var edittedContent

export default function Comment({comment, authenHeader, setNotification, refetchComment, signedUsername, isModerator}) {
    const classes = useStyles();
    const date = new Date(comment.publishedTime)
    const [isEditting,setIsEditting] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    


    const { commentId, content, post, publishedTime, username } = {...comment,publishedTime:`${date.toDateString()} ${date.toLocaleTimeString()}`}
    
    const deleteComment = () =>
    new Promise((resolve,reject)=>{
        axios.delete(`${config.BACKEND_ENDPOINT}/comments/delete/${commentId}`,authenHeader)
        .then((res)=>{
        //   console.log(res.data)
          resolve(res.data)
        })
        .catch((err)=>{
          reject(err)
          if (err.response.affected > 0) {
            setNotification("ลบ Comment สำเร็จ")
            refetchComment()
          }
          else {
            setNotification("ลบ Comment ไม่สำเร็จ")
          }
        })
      })

    const editComment = () =>
    new Promise((resolve,reject)=>{
    let body = {
        commentId : commentId,
        content : edittedContent,
    }
    axios.put(`${config.BACKEND_ENDPOINT}/comments/update`,body,authenHeader)
    .then((res)=>{
        resolve(res.data)
    })
    .catch((err)=>{
        reject(err)
    })
    })

    const onEditComment = () => {
        if (signedUsername === username || isModerator) {
            setIsEditting(true)
            edittedContent = content
          } else {
            setTimeout(()=>{
              setNotification("เจ้าของ post เท่านั้นจึงจะมีสิทธิ์แก้ไข post")
            },100)
          }
    }

    const handleDeleteComment = async () => {
        try {
            const res = await deleteComment()
            if (res.affected > 0) {
                setNotification("ลบ Comment สำเร็จ")
                refetchComment()
              }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    setNotification("เจ้าของ comment เท่านั้นที่จะมีสิทธิ์ลบ comment นี้")
                }
                if (err.response.status === 404) {
                    setNotification("กรุณาตรวจสอบการเชื่อมต่อ")
                }
            }
        }
    }

    const handleEditComment = async () => {
        try {
            const res = await editComment()
            if (res.affected > 0) {
                setNotification("แก้ไข Comment สำเร็จ")
                setIsEditting(false)
                refetchComment()
              }
        } catch (err) {
            if (err.response.status === 401) setNotification("เจ้าของ comment เท่านั้นที่จะมีสิทธิ์แก้ไข comment นี้")
            if (err.response.status === 404) setNotification("โปรดตรวจสอบการเชื่อมต่อ")
        }
    }

    const closeMenu = () => {
        setAnchorEl(null)
    }

    const openMenu = (e) => {
        // console.log(e.currentTarget)
        setAnchorEl(e.currentTarget)
      }
    
    const menuRender = () => (
        <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        >
        <MenuItem onClick={()=>{onEditComment();closeMenu()}}>edit</MenuItem>
        <MenuItem onClick={()=>{handleDeleteComment();closeMenu()}}>delete</MenuItem>
        </Menu>
    )
    
    return (
        <Card className={classes.root} key={`comment-${publishedTime}`}>
            <CardActionArea>
                <CardContent >
                    <div className={classes.header}>
                        <Typography gutterBottom >
                            {username}
                        </Typography>
                        <Typography className={classes.time} color="textSecondary" >{publishedTime}</Typography>
                        {((signedUsername === username) || isModerator)&&<IconButton aria-label="settings" style={{marginLeft:"auto",marginTop:"-12px"}} onClick={openMenu}>
                            <MoreVertIcon />
                        </IconButton>}
                    </div>
                    {isEditting?
                    <TextField variant="outlined" defaultValue={content} size="small"
                    fullWidth
                    onChange={(e)=>{edittedContent=e.target.value}}
                    onKeyPress={(e)=>{
                        if (e.key === "Enter") {
                        // console.log(edittedContent)
                        handleEditComment()
                        }
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="start"><KeyboardReturnIcon/></InputAdornment>,
                      }}
                    />
                    :
                    <Typography variant="body2" color="textPrimary" component="p" >
                        {content}
                    </Typography>}
                </CardContent>
            </CardActionArea>
            {menuRender()}
        </Card>
    );
}
