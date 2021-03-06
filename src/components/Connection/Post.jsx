import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useSelector } from 'react-redux';
import moment from 'moment';
import FacebookProgress from './FacebookProgress';
import { likePost } from '../../actions/posts';
import { useDispatch } from 'react-redux';
import {useHistory} from 'react-router-dom';
import {see} from '../../actions/wall';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
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
        backgroundColor: red[500],
    },
}));

const Post = ({ post }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const avts = useSelector((state) => state.getAVTs);
    const [progress, setProgress] = React.useState(false);
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const httpToHTTPS = (str, from, what) => {
        if (str) {
            return str.substring(0, from) + what + str.substring(from);
        }
        return '';
    }

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar} src={avts.filter((avt) => avt.id === post.creator).length > 0 ? httpToHTTPS(avts.filter((avt) => avt.id === post.creator)[0]?.avt, 4, 's') : post.creatorAvt}>
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={avts.filter((avt) => avt.id === post.creator)[0] ? avts.filter((avt) => avt.id === post.creator)[0]?.name : post.name}
                subheader={moment(post.createdAt).format('ddd, MMMM DD YYYY, hh:mm a')}
            />
            <CardMedia
                className={classes.media}
                image={httpToHTTPS(post.selectedFile, 4, 's')}
                title={post.title}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {post.title}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                {
                    progress ? <FacebookProgress /> :
                        <IconButton aria-label="add to favorites" onClick={() => {
                            setProgress(true);
                            dispatch(likePost(post._id)).then(() => setProgress(false)).catch(() => setProgress(false));
                        }}>
                            <FavoriteIcon style={{ color: post.likes.length > 0 ? (post.likes.find((like) => like === (user?.result?.googleId || user?.result?._id || user?.result?.ggId)) ? 'red' : '') : '' }} />
                        </IconButton>
                }
                <IconButton aria-label="share" onClick={()=>{
                    if (user) {
                        dispatch(see(post._id, user?.result?._id));
                    } else {
                        dispatch(see(post._id));
                    }
                    history.push(`/see/${post._id}`);
                    }}>
                    <ShareIcon />
                </IconButton>
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
                <CardContent>
                    <Typography paragraph>
                        {post.message}
                    </Typography>
                    <Typography paragraph>
                        {
                            post.tags.map((tag) => `#${tag} `)
                        }
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default Post;