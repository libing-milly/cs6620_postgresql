import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function MyPgAdmin(props) {
    console.log("username: ", props.username)
  return (
  <Box >
    <Typography sx={{ visibility: props.visibility, display: props.display }} 
    variant="h4" gutterBottom component="div">
        PGAdmin
    </Typography>
    <Container maxWidth="md">
    <iframe id="pgadmin" 
    title="pgadmin" 
    width="800px"
    height="700px"
    src="https://2886795281-80-kitek08.environments.katacoda.com/pgadmin4/login?next=%2Fpgadmin4%2F">

    </iframe>
    </Container>
  </Box>);
}