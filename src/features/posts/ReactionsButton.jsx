import { useDispatch } from "react-redux";
import { rectionAdded } from "./postsSlice";

const reactionsEmoji = {
  thumbsup: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionsButton = ({ post }) => {
  const dispatch = useDispatch();

  const reactionButtons = Object.entries(reactionsEmoji).map(([name, emoji]) => {
    return ( // Add 'return' here
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() =>
          dispatch(
            rectionAdded({
              postId: post.id,
              reaction: name,
            })
          )
        }
      >
        {emoji} {post.reactions[name]} {/* Ensure correct 'reactions' access */}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};

export default ReactionsButton;




/* const reactionsEmoji = {
    thumbsup: "👍",
    wow: "😮",
    heart: "❤️",
    rocket: "🚀",
    coffee: "☕",
}
 */