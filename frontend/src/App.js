import { useCookies } from 'react-cookie';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Post from './Post';

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

function App() {
  const classes = useStyles();
  const [cookies, setCookie] = useCookies();

  useEffect(() => {
    // if(cookies.token === undefined) {
    //   window.location.assign('/login');
    // }
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={5} >
        <Grid item xs>
          <Paper className={classes.paper}>
            <div className={classes.headline} >USER</div>
            <div className={classes.profile}>
              Name : Park
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

export default App;
