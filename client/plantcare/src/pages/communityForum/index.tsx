import { FaUserPlus } from "react-icons/fa";
import NewPost from "../../componets/blog/CreatePost";
import LeftSidebar from "../../componets/blog/LeftSideBar";
import BlogPostList from "../../componets/blog/PostList";
import ChatPage from "../ChatPage";


const CommunityForumPage = () => {
  return (
    <div className="community-forum-container">
      <header className="forum-header">
        <h1>Community Forum</h1>
      </header>

      <div className="community-forum-content">
  
         <LeftSidebar/>

        <div className="main-feed">
          <h3>Trending Posts</h3>
          <section className="post-list-section">
            <BlogPostList />
          </section>
        </div>

    
        <div className="right-sidebar">
          <section className="create-post-section">
          <button>
                <FaUserPlus />
                create a post
              </button>
            <NewPost />
          </section>
          <ChatPage />
        </div>
      </div>
    </div>
  );
};

export default CommunityForumPage;
