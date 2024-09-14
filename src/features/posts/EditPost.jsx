import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { deletePost, selectPostsById, updatePost } from "./postsSlice";
import { useState } from "react";
import { selectAllUsers } from "../users/usersSlice";

const EditPostForm = () =>{
    const {postId} = useParams();
    const post = useSelector((state)=> selectPostsById(state, Number(postId)))

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const users = useSelector(selectAllUsers)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    /* onChangeFunction */
    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)

    const [addRequestStatus, setAddRequestStatus] = useState('idle')
    if(!post){
        return(
            <section>
                <h3>Posts Not Found</h3>
            </section>
        )
    }

    /* check whether all inputs were filled  */
    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

    const onUpdatePostClicked = async() =>{
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                await dispatch(updatePost({
                    id:post.id,
                    title,
                    body:content,
                    userId,
                    reactions:post.reactions,
                })).unwrap()
                setTitle('')
                setContent('')
                setUserId('')
                navigate(`/post/${post.id}`)
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    /* userList */
    const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>
        {user.name}
    </option>
));

    /* delete function */
    const onDeletePostClicked = async ()=>{
        await dispatch(deletePost({
            id: post.id,
        })).unwrap();
        setTitle('')
        setContent('')
        setUserId('')
        navigate('/')
    }

    return(
        <section>
            <form action="">
                <h2>Update/Edit the Post</h2>
                <label htmlFor="PostTitle"> Post Title:</label>
                <input
                    type="text"
                    value={title}
                    id="PostTitle"
                    onChange={onTitleChanged} />
                <label htmlFor="PostAuthor">Post Author:</label>
                <select
                    name="Post Author"
                    id="PostAuthor"
                    value={userId}
                    onChange={onAuthorChanged}>
                <option value="">Select an Author</option>
                    {userOptions}
                </select>
                <label htmlFor="Post Content">Post Content</label>
                <input
                    type="text"
                    value={content}
                    id="postContent"
                    onChange={onContentChanged} />

                {/* for both update and delete */}
                <button
                    onClick={onUpdatePostClicked}
                    disabled={!canSave}>Update Post</button>
                
                <button
                    className="deleteButton"
                    type="button"
                    onClick={onDeletePostClicked}>Delete Post</button>
            </form>
        </section>
    )
}
export default EditPostForm