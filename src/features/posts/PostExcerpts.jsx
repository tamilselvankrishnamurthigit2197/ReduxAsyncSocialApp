import { useSelector } from "react-redux";
import { selectPostsById } from "./postsSlice";
import { Link } from "react-router-dom";
import TimeAgo from "./TimeAgo";
import ReactionsButton from "./ReactionsButton";
import PostAuthor from "./PostAuthor";

const PostExcerpt = ({ postId }) => {
    const post = useSelector(state => selectPostsById(state, postId));

    if (!post) return null; // Ensure the post is loaded

    return (
        <article>
            <h2>{post.title}</h2>
            <p className="excerpt">
                {post.body.length > 75 ? post.body.substring(0, 75) + '...' : post.body}
            </p>
            <div className="postCredit">
                <Link to={`/post/${post.id}`}> View Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
                <ReactionsButton post={post} />
            </div>

        </article>
    );
};

export default PostExcerpt;
