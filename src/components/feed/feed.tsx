import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import PostComponent from "./post";
interface FeedProps {
  username?: string;
}
async function Feed({ username }: FeedProps) {
  const { userId } = auth();

  let posts: any[] = [];
  if (username) {
    // 只请求自己的posts
    posts = await prisma.post.findMany({
      where: {
        user: {
          username,
        },
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  if (!username && userId) {
    // 拿到我专注的人的posts
    const following = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following?.map((f) => f.followingId);

    const ids = [userId, ...followingIds];

    posts = await prisma.post.findMany({
      where: {
        userId: {
          in: ids,
        },
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12">
      {posts?.length
        ? posts?.map((post) => {
            return <PostComponent key={post.id} post={post} />;
          })
        : "No posts found!"}
    </div>
  );
}

export default Feed;
