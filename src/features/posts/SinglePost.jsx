import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { selectPostsById } from './postsSlice';
import PostAuthor from './PostAuthor';
import ReactionsButton from './ReactionsButton';
import TimeAgo from './TimeAgo';

const SinglePost = () => {
  const { postId } = useParams(); // Extract postId from URL
  const post = useSelector((state) => selectPostsById(state, Number(postId))); // Get the post based on postId

  if (!post) { // Check if post exists
    return (
      <section>
        <h2>Post not Found!</h2>
      </section>
    );
  }

  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <div className="postCredit">
        <Link to={`/post/edit/${post.id}`}>Edit Post</Link> {/* Link to edit post */}
        <PostAuthor userId={post.userId} /> {/* Show author */}
        <TimeAgo timestamp={post.date} /> {/* Show post's timestamp */}
        <ReactionsButton post={post} /> {/* Reaction buttons */}
      </div>
    </article>
  );
};

export default SinglePost;
