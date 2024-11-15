import NewPost from "../../componets/blog/CreatePost";
import BlogPostList from "../../componets/blog/PostList";


const CommunityForumPage = () => {
  return (
    <div className="community-forum">
      <header className="forum-header">
        <h1>Community Forum</h1>
      </header>
      <section className="create-post-section">
        <NewPost />
      </section>
      <section className="post-list-section">
        <BlogPostList />
      </section>
    </div>
  );
};

export default CommunityForumPage;
