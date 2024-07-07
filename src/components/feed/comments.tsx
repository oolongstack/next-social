import prisma from "@/lib/client";
import { CommentList } from "./comment-list";
async function Comments({ postId }: { postId: number }) {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      user: true,
    },
  });
  return (
    <div className="">
      <CommentList comments={comments} postId={postId} />
    </div>
  );
}

export default Comments;
