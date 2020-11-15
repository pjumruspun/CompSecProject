import React, { useEffect } from 'react';
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

export default function Post({post}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const {content, postId, publishedTime, username} = {...post,publishedTime:`${new Date(post.publishedTime).toDateString()} ${new Date(post.publishedTime).toLocaleTimeString()}`}

  useEffect(()=>{
    console.log(content, postId, publishedTime, username)
  },[post])
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
          <IconButton aria-label="settings">
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
          <Comment />
          <Comment />
          <Comment />
        </CardContent>
      </Collapse>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField className={classes.comment} id="outlined-basic" InputProps={{ classes: { input: classes.input_text } }} variant="filled" label="Enter your comment here!" />
        <IconButton color="primary" aria-label="add to shopping cart">
          <AddCommentIcon />
        </IconButton>
      </form>
    </Card>
  );
}
