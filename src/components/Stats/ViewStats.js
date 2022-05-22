const ViewStats = (props) => {
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center mt-3 mb-3">
        <h2>Số lượng bài viết: {props.conutPosts}</h2>
        <ul>
          {props.statsPosts.map((p) => (
            <li>
              <strong>{p.title}</strong>: có {p.like_count} lượt thích và{" "}
              {p.comment_count} lượt bình luận.
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ViewStats
