import { useSelector } from "react-redux";
import { getPostsError, getPostsStatus, selectPostsIds } from "./postsSlice";
import PostExcerpt from "./PostExcerpts";

const PostsList = () => {
    let content;

    // Fetch posts status, error and orderedPostIds from Redux store
    const orderedPostIds = useSelector(selectPostsIds);
    const postsStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);

    // Handle loading, success, or error states
    if (postsStatus === 'loading') {
        content = <p>Loading...</p>;
    } else if (postsStatus === 'succeeded') {
        content = orderedPostIds.length > 0
            ? orderedPostIds.map(postId => <PostExcerpt key={postId} postId={postId} />)
            : <p>No posts available.</p>;
    } else if (postsStatus === 'failed') {
        content = <p>Error: {error}</p>;
    }

    return (
        <section>
            {content}
        </section>
    );
};

export default PostsList;
