import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
    }
});

export default function Comment() {
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardContent>
                    <div className={classes.header}>
                        <Typography gutterBottom >
                            Lizard
                        </Typography>
                        <Typography className={classes.time} color="textSecondary" >14:30 (11/11/2020)</Typography>
                    </div>
                    <Typography variant="body2" color="textPrimary" component="p">
                        Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                        across all continents except Antarctica
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
