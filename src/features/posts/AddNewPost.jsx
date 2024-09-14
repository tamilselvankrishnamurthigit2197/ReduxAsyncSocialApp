import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNewPost } from './postsSlice';
import { selectAllUsers } from '../users/usersSlice';

const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');

  /* Get users from userSlice */
  const users = useSelector(selectAllUsers);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* onChange event handlers */
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  /* Request status */
  const [addRequestStatus, setAddRequestStatus] = useState('idle');

  /* Can save logic */
  const canSave = [title, userId, content].every(Boolean) && addRequestStatus === 'idle';

  /* Save post function */
  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        await dispatch(
          addNewPost({
            title,
            body: content,
            userId,
          })
        ).unwrap();
        setTitle('');
        setContent('');
        setUserId('');
        navigate('/');
      } catch (error) {
        console.log(error.message);
      } finally {
        setAddRequestStatus('idle');
      }
    }
  };

  /* User options for select */
  const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  /* Render form */
  return (
    <section>
      <form>
        <h2>Add New Post</h2>

        <label htmlFor="PostTitle">Post Title:</label>
        <input
          type="text"
          id="PostTitle"
          value={title}
          onChange={onTitleChanged}
        />

        <label htmlFor="PostAuthor">Post Author:</label>
        <select id="PostAuthor" value={userId} onChange={onAuthorChanged}>
          <option value="">Select an Author</option>
          {userOptions}
        </select>

        <label htmlFor="PostContent">Post Content:</label>
        <textarea
          id="PostContent"
          value={content}
          onChange={onContentChanged}
        />

        <button
          type="button"
          onClick={onSavePostClicked}
          disabled={!canSave}
        >
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
