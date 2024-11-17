import { FaBell, FaComments, FaHome, FaPlus } from "react-icons/fa";
import LeftSidebar from "../../componets/blog/LeftSideBar";
import BlogPostList from "../../componets/blog/PostList";

const CommunityForumPage = () => {
  return (
    <div className="community-forum-container">
      <header className="forum-header">
        <h1>Community Forum</h1>
      </header>

      <div className="community-forum-content">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Feed */}
        <div className="main-feed">
          <h3>Trending Posts</h3>
          <section className="post-list-section">
            <BlogPostList />
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <a href="/" className="sidebar-icon">
            <FaHome />
            <span>Home</span>
          </a>
          <a href="/create-post" className="sidebar-icon">
            <FaPlus />
            <span>Create Post</span>
          </a>
          <a href="/chat" className="sidebar-icon">
            <FaComments />
            <span>Chat</span>
          </a>
          <a href="/notifications" className="sidebar-icon">
            <FaBell />
            <span>Notifications</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CommunityForumPage;
