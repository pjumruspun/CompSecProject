import React from 'react'
import {
  makeStyles,
  Grid,
  TextField,
  Avatar,
  InputAdornment,
  IconButton,
} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme)=>({
  post: {
    padding: theme.spacing(2),
    margin: "20px",
    textAlign: 'left',
    color: theme.palette.text.primary,
    backgroundColor: "#eeeeee",
    wordWrap: "break-word"
  },
  avatar: {
    backgroundColor: "#47a779",
    margin:"0 16px"
  },
  textField : {
    width:"calc(100% - 40px - 64px)",
  } 
}))


function NewPost({username,content,handleContent,onPost}) {
  const classes = useStyles()
  return (
    <Grid className={classes.post} >
      <Grid container>
  <Avatar className={classes.avatar}>{username ? username[0].toUpperCase():"?"}</Avatar>
          <TextField
            // fullWidth
            variant="outlined"
            value={content}
            multiline
            onChange={(e)=>handleContent(e.target.value)}
            placeholder={`คุณคิดอะไรอยู่ ${username}`}
            className={classes.textField}
            onKeyPress={(e)=>{
              if (e.key === "Enter") {
                onPost()
              }
            }}
            InputProps={{
              endAdornment: 
              <InputAdornment position="start">
                <IconButton onClick={()=>onPost()}>
                 <SendIcon/>
                </IconButton>
              </InputAdornment>
             ,
            }}
          />
      </Grid>

    </Grid>
  )
}

export default NewPost