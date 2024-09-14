import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddNewPost";
import SinglePost from "./features/posts/SinglePost";
import EditPostForm from "./features/posts/EditPost";
import UserList from "./features/users/UserList";
import UserPage from "./features/users/UserPage";

function App() {
  return (
    <Routes>
      {/* Root layout */}
      <Route path="/" element={<Layout />}>
      <Route index element={<PostsList />} />
      
        {/* Posts routes */}
        <Route path="post">
        <Route index element={<AddPostForm />} />
        <Route path=":postId" element={<SinglePost />} />
        <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>

        {/* Users routes */}
        <Route path="user" element={<UserList />} />
        <Route path="user/:userId" element={<UserPage />} />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
