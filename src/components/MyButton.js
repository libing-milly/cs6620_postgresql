import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';



const useStyles = makeStyles({
    root: {
        border: 0,
        borderRadius: 3,
        color: 'white',
        height: 48,
        padding: '0 30px',
      background: (props) =>{
        switch (props.color) {
          case 'red':
            return 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
          case 'blue':
            return 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
          case 'green':
            return 'linear-gradient(45deg, #20bf55 30%, #80ff72 90%)'
          default:
            return 'linear-gradient(45deg, #f2be06 30%, #f0e619 90%)'
        }
        },

      boxShadow: (props) =>{switch (props.color) {
        case 'red':
          return '0 3px 5px 2px rgba(255, 105, 135, .3)'
        case 'blue':
          return '0 3px 5px 2px rgba(33, 203, 243, .3)'
        case 'green':
          return '0 3px 5px 2px rgba(100, 200, 200, .3)'
        default:
          return '0 3px 5px 2px rgba(240, 230, 25, .3)'
      }}
        
    },
  });

  export default function MyButton(props) {
    const { color, ...other } = props;
    const classes = useStyles(props);
    return <Button className={classes.root} {...other} />;
  }
  
  
