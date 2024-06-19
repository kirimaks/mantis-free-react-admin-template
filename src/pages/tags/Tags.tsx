import { useContext, useState } from 'react';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from  '@mui/material/Stack';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

import { AuthContext, resetAuthContext } from 'contexts/auth/AuthContext';
import { getTags } from 'tags/transport';
import { UnauthorizedError } from 'errors/transport';


const TAGS_QUERY_CACHE_KEY = 'transactionTags';


function Tag({ tag }):JSX.Element {

    const handleDeleteTagClick = (event) => {
        event.preventDefault();
    };

    return (
        <ListItem sx={{ pl: 4, border: '0px solid black' }}>
            <ListItemIcon>
                <Icon baseClassName="fas" className={ tag.iconName } sx={{ width: '1.2em', mr: 2 }} />
            </ListItemIcon>
            <ListItemText primary={ tag.name } />
            <IconButton color="secondary" onClick={ handleDeleteTagClick }>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    );
}


function TagGroup({ tagGroup }):JSX.Element {
    const [ tagGroupIsOpened, setTagGroupIsOpened ] = useState(false);
    const handleTagGroupClick = (event) => {
        event.preventDefault();
        setTagGroupIsOpened(!tagGroupIsOpened);
    };
    const handleCreateTag = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <ListItem>
                <ListItemIcon>
                    <Icon baseClassName="fas" className={ tagGroup.iconName } sx={{ width: '1.2em', mr: 2 }} />
                </ListItemIcon>
                <ListItemText primary={ tagGroup.name } />
                <IconButton color="secondary" onClick={ handleCreateTag }>
                    <AddCircleIcon />
                </IconButton>
                <IconButton onClick={ handleTagGroupClick }>
                    { tagGroupIsOpened ? <ExpandLess /> : <ExpandMore /> }
                </IconButton>
            </ListItem>
            <Collapse in={ tagGroupIsOpened } unmountOnExit>
                <List component="div" disablePadding>
                    { tagGroup.tags.map((tag) => <Tag key={ tag.id } tag={ tag } />) }
                </List>
            </Collapse>
        </>
    );
}


function TagsListComponent({ tags }):JSX.Element {
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Account tags
                </ListSubheader>
              }
        >
            { tags.map((tagGroup) => <TagGroup key={ tagGroup.id } tagGroup={ tagGroup }/>) }
            
        </List>
    );
}


function TagsComponent() {
    const authContext = useContext(AuthContext);

    const tagsQuery = useQuery({
        queryKey: [TAGS_QUERY_CACHE_KEY],
        queryFn: () => getTags(authContext.authInfo.authKey),
    });

    if (tagsQuery.isError) {
        console.error(tagsQuery.error);

        if (tagsQuery.error instanceof UnauthorizedError) {
            resetAuthContext(authContext);
        }
    }

    if (tagsQuery.isLoading) {
        return <span>Loading...</span>
    }

    console.log(tagsQuery.data);

    return (
        <Container>
            <Box display="flex" justifyContent="center">
                <Stack spacing={ 2 } direction="column" alignItems="center">
                    <Box>
                        <Button variant="contained" color="secondary">New tag group</Button>
                    </Box>
                    <Paper sx={{ minWidth: '350px' }}>
                        <Box display="flex" justifyContent="center">
                            <TagsListComponent tags={ tagsQuery.data.accountTags } />
                        </Box>
                    </Paper>
                </Stack>
            </Box>
        </Container>
    );
}

export default TagsComponent;
