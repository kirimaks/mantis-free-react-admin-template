import { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ListSubheader, List, ListItemButton, ListItemIcon, ListItemText, ListItem } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { Button, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import Collapse from '@mui/material/Collapse';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from  '@mui/material/Stack';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { AuthContext, resetAuthContext } from 'contexts/auth/AuthContext';
import { UnauthorizedError } from 'errors/transport';
import FA_ICONS from 'assets/icons/fa-icons';
import { getTags, createNewTagGroup, deleteTagGroup } from 'tags/transport';


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


function DeleteTagGroupConfirmation({ tagGroup, isConfirmationOpened, setIsConfirmationOpened }):JSX.Element {
    const authContext = useContext(AuthContext);
    const queryClient = useQueryClient();
    const deleteTagGroupMutation = useMutation({
        mutationFn: (payload) => deleteTagGroup(authContext.authInfo.authKey, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_CACHE_KEY] });
            setIsConfirmationOpened(false);
        },
        onError: (error) => {
            console.error(error);
            if (error instanceof UnauthorizedError) {
                resetAuthContext(authContext);
            }
        }
    });

    const handleClose = () => {
        setIsConfirmationOpened(false);
    };

    const handleDelete = () => {
        deleteTagGroupMutation.mutate({ tagGroupId: tagGroup.id });
    };

    return (
        <Dialog onClose={ handleClose } open={ isConfirmationOpened }>
            <DialogTitle>Removing tag group</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete tag group <b>{ tagGroup.name }</b>?
                <br/>
                All tags from this group also will be deleted
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="secondary" onClick={ handleClose }>Cancel</Button>
              <LoadingButton loading={ deleteTagGroupMutation.isPending } variant="contained" color="error" onClick={ handleDelete }>Delete</LoadingButton>
            </DialogActions>
        </Dialog>
    );
}


function DeleteTagGroupComponent({ tagGroup }):JSX.Element {
    const [ isConfirmationOpened, setIsConfirmationOpened ] = useState(false);

    const handleDeleteTagGroup = (event) => {
        event.preventDefault();
        setIsConfirmationOpened(!isConfirmationOpened);
    };

    return (
        <>
            <Tooltip title="Delete tag group">
                <IconButton color="secondary" onClick={ handleDeleteTagGroup }>
                    <DeleteIcon/>
                </IconButton>
            </Tooltip>
            <DeleteTagGroupConfirmation 
                tagGroup={ tagGroup } 
                isConfirmationOpened={ isConfirmationOpened } 
                setIsConfirmationOpened={ setIsConfirmationOpened } 
            />
        </>
    );
}


function CreateNewTagDialog(props):JSX.Element {
    const authContext = useContext(AuthContext);
    const queryClient = useQueryClient();

    const { 
        tagGroup, 
        isNewTagFormOpened, 
        setNewTagFormOpened,
        newTagName,
        setNewTagName,
        newTagIcon,
        setNewTagIcon,
    } = props;

    const [ isTagNameError, setTagNameErorr ] = useState(false);
    const [ isTagIconError, setTagIconError ] = useState(false);
    const [ formError, setFormError ] = useState<null|string>(null);

    const handleTagNameChange = (event) => {
        setNewTagName(event.target.value);
    };

    const handleTagIconChange = (event:React.ChangeEvent<HTMLInputElement>, newValue: string | null) => {

        if (newValue) {
            setNewTagIcon(newValue.label);

        } else {
            setNewTagIcon('');
        }
    };


    const newTagMutation = useMutation({
        mutationFn: (payload) => createNewTag(authContext.authInfo.authKey, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_CACHE_KEY] });
        },
        onError: (error) => {
            if (error instanceof UnauthorizedError) {
                resetAuthContext(authContext);
            }
            setFormError(error.message);
        }
    });

    const createNewTagClick = (event) => {
        newTagMutation.mutate({ newTagName, newTagIcon });
    };

    return (
        <Dialog onClose={ () => setNewTagFormOpened(false) } open={ isNewTagFormOpened }>
            <Box sx={{ padding: "10px" }}>
                <Stack direction="column" spacing={ 2 } alignItems="stretch">
                    <Typography variant="h3">Create new tag in <b>[{ tagGroup.name }]</b></Typography>
                    <Box>
                        <TextField
                            error={ isTagNameError }
                            label="Tag name"
                            variant="outlined"
                            value={ newTagName }
                            onChange={ handleTagNameChange }
                            fullWidth
                        />
                    </Box>
                    <Box>
                        <Autocomplete
                            options={ FA_ICONS }
                            renderInput={
                                (params) => <TextField error={ isTagIconError } { ...params } label="Tag icon" />
                            }
                            onChange={ handleTagIconChange }
                        />
                    </Box>
                    <LoadingButton loading={ newTagMutation.isPending } color="success" variant="outlined" onClick={ createNewTagClick }>Create</LoadingButton>
                </Stack>
            </Box>
        </Dialog>
    );
}


function CreateNewTagComponent({ tagGroup }):JSX.Element {
    const [ isNewTagFormOpened, setNewTagFormOpened ] = useState(false);
    const [ newTagName, setNewTagName ] = useState('');
    const [ newTagIcon, setNewTagIcon ] = useState('');

    const handleCreateTag = (event) => {
        event.preventDefault();
        setNewTagFormOpened(!isNewTagFormOpened);
    };

    return (
        <>
            <Tooltip title="Add tags to group">
                <IconButton color="secondary" onClick={ handleCreateTag }>
                    <AddCircleIcon />
                </IconButton>
            </Tooltip>
            <CreateNewTagDialog {...{ 
                tagGroup, isNewTagFormOpened, setNewTagFormOpened, 
                newTagName, setNewTagName, newTagIcon, setNewTagIcon
            }} />
        </>
    );
}


function TagGroup({ tagGroup }):JSX.Element {
    const [ tagGroupIsOpened, setTagGroupIsOpened ] = useState(false);
    const handleTagGroupClick = (event) => {
        event.preventDefault();
        setTagGroupIsOpened(!tagGroupIsOpened);
    };

    return (
        <>
            <ListItem>
                <ListItemIcon>
                    <Icon baseClassName="fas" className={ tagGroup.iconName } sx={{ width: '1.2em', mr: 2 }} />
                </ListItemIcon>
                <ListItemText primary={ tagGroup.name } />
                <CreateNewTagComponent tagGroup={ tagGroup } />
                <DeleteTagGroupComponent tagGroup={ tagGroup }/>
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


function CreateTagGroupDialog(props):JSX.Element {
    const authContext = useContext(AuthContext);
    const queryClient = useQueryClient();

    const { 
        isNewTagGroupDialogOpened,
        setIsNewTagGroupDialogOpened,
        newTagGroupName,
        setNewTagGroupName,
        newTagGroupIcon,
        setNewTagGroupIcon
    } = props;

    const [ isTagGroupNameError, setIsTagNameError ] = useState(false);
    const [ isTagGroupIconError, setIsTagGroupIconError ] = useState(false);
    const [ formError, setFormError ] = useState<null|string>(null);
    
    const newTagGroupMutation = useMutation({
        mutationFn: (values) => createNewTagGroup(authContext.authInfo.authKey, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_CACHE_KEY] });
            setIsNewTagGroupDialogOpened(false);
        },
        onError: (error) => {
            console.error(error);
            if (error instanceof UnauthorizedError) {
                resetAuthContext(authContext);
            }
            setFormError(error.message);
        }
    });

    const handleDialogClose = (event) => {
        setIsNewTagGroupDialogOpened(false);
    };

    const handleTagGroupNameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setNewTagGroupName(event.target.value);
        if (event.target.value.length >= 3 && event.target.value.length < 100) {
            setIsTagNameError(false);
        }

        setFormError(null);
    };

    const handleTagGroupIconChange = (event:React.ChangeEvent<HTMLInputElement>, newValue: string | null) => {

        if (newValue) {
            setNewTagGroupIcon(newValue.label);
            if (newValue.label.length > 0 && newValue.label.length < 100) {
                setIsTagGroupIconError(false);
            }
        } else {
            setNewTagGroupIcon('');
        }

        setFormError(null);
    };

    const createNewTagGroupClick = (event) => {
        setFormError(null);

        if (newTagGroupName.length <= 3 || newTagGroupName.length > 100) {
            setIsTagNameError(true);

        } else {
            setIsTagNameError(false);
        }

        if (newTagGroupIcon.length <= 3 || newTagGroupIcon.length > 100) {
            setIsTagGroupIconError(true);

        } else {
            setIsTagGroupIconError(false);
        }

        if (!isTagGroupNameError && !isTagGroupIconError) {
            console.log(`Creating new tag group: ${newTagGroupName} / ${newTagGroupIcon}`);
            newTagGroupMutation.mutate({ newTagGroupName, newTagGroupIcon });
        }
    };

    return (
        <Dialog onClose={ handleDialogClose } open={ isNewTagGroupDialogOpened }>
            <Box sx={{ padding: "10px" }}>
                <Stack direction="column" spacing={ 2 } alignItems="stretch">
                    <DialogTitle>Create new tag group</DialogTitle>
                    <Box>
                        <TextField 
                            error={ isTagGroupNameError } 
                            label="Tag group name" 
                            variant="outlined" 
                            value={ newTagGroupName} 
                            onChange={ handleTagGroupNameChange } 
                            fullWidth
                        />
                    </Box>
                    <Box>
                        <Autocomplete 
                            options={ FA_ICONS } 
                            renderInput={ 
                                (params) => <TextField error={ isTagGroupIconError } { ...params } label="Tag group icon"/> 
                            } 
                            onChange={ handleTagGroupIconChange }
                        />
                    </Box>
                    <Box>
                        { formError ? <Alert severity="error">{ formError }</Alert> : null }
                    </Box>
                    <LoadingButton loading={ newTagGroupMutation.isPending } color="success" variant="outlined" onClick={ createNewTagGroupClick }>Create</LoadingButton>
                </Stack>
            </Box>
        </Dialog>
    );
}


function CreateNewTagGroupComponent():JSX.Element {
    const [ isNewTagGroupDialogOpened, setIsNewTagGroupDialogOpened ] = useState(false);
    const [ newTagGroupName, setNewTagGroupName ] = useState('');
    const [ newTagGroupIcon, setNewTagGroupIcon ] = useState('');

    const dialogProps = {
        isNewTagGroupDialogOpened,
        setIsNewTagGroupDialogOpened,
        newTagGroupName,
        setNewTagGroupName,
        newTagGroupIcon,
        setNewTagGroupIcon
    };

    const createNewTagGroupClick = (event) => {
        setNewTagGroupName('');
        setNewTagGroupIcon('');
        setIsNewTagGroupDialogOpened(!isNewTagGroupDialogOpened);
    };

    return (
        <Box>
            <Button variant="contained" color="secondary" onClick={ createNewTagGroupClick }>New tag group</Button>
            <CreateTagGroupDialog { ...dialogProps } />
        </Box>
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

    const tags = tagsQuery.data ? tagsQuery.data.accountTags : [];

    return (
        <Container>
            <Box display="flex" justifyContent="center">
                <Stack spacing={ 2 } direction="column" alignItems="center">
                    <CreateNewTagGroupComponent />
                    <Paper sx={{ minWidth: '350px' }}>
                        <Box display="flex" justifyContent="center">
                            <TagsListComponent tags={ tags } />
                        </Box>
                    </Paper>
                </Stack>
            </Box>
        </Container>
    );
}

export default TagsComponent;
