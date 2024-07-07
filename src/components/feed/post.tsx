import { Post as PostType, User } from "@prisma/client";
import Image from "next/image";
import Comments from "./comments";
import PostInteraction from "./post-interaction";
export type PostProps = PostType & { user: User } & {
  likes: [{ userId: User["id"] }];
} & {
  _count: {
    comments: any;
  };
};
function Post({ post }: { post: PostProps }) {
  return (
    <div className="flex flex-col gap-4">
      {/* user */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post?.user?.avatar || "/noAvatar.png"}
            className="w-10 h-10 rounded-full"
            alt="user"
            width={40}
            height={40}
          />
          <span className="font-medium">
            {post.user.name && post.user.surname
              ? post.user.name + " " + post.user.surname
              : post.user.username}
          </span>
        </div>
        <Image src="/more.png" alt="more" width={16} height={16} />
      </div>

      {/* desc */}
      <div className="flex flex-col gap-4">
        {post?.img && (
          <div className="w-full min-h-96 relative">
            <Image
              src={post.img}
              fill
              className="object-cover rounded-md"
              alt="desc"
            />
          </div>
        )}
        <p>{post.desc}</p>
      </div>
      {/* interaction */}
      <PostInteraction
        postId={post.id}
        likes={post.likes?.map((like) => like.userId)}
        commentNumber={post._count.comments}
      />

      <Comments postId={post.id} />
    </div>
  );
}

export default Post;
