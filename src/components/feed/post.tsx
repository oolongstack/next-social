import { auth } from "@clerk/nextjs/server";
import { Post as PostType, User } from "@prisma/client";
import Image from "next/image";
import { Suspense } from "react";
import Comments from "./comments";
import PostInfo from "./post-info";
import PostInteraction from "./post-interaction";
export type PostProps = PostType & { user: User } & {
  likes: [{ userId: User["id"] }];
} & {
  _count: {
    comments: any;
  };
};
function Post({ post }: { post: PostProps }) {
  const { userId } = auth();
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
        {/* <Image src="/more.png" alt="more" width={16} height={16} /> */}
        {userId === post.user.id && <PostInfo postId={post.id} />}
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
      <Suspense fallback={<div>loading...</div>}>
        <PostInteraction
          postId={post.id}
          likes={post.likes?.map((like) => like.userId)}
          commentNumber={post._count.comments}
        />
      </Suspense>

      <Suspense fallback={<div>loading...</div>}>
        <Comments postId={post.id} />
      </Suspense>
    </div>
  );
}

export default Post;
