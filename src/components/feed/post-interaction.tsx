"use client";
import { switchLike } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useOptimistic, useState } from "react";
import { toast } from "sonner";
import { PostProps } from "./post";
interface PostInteractionProps {
  postId: PostProps["id"];
  likes: string[];
  commentNumber: number;
}
function PostInteraction({
  postId,
  likes,
  commentNumber,
}: PostInteractionProps) {
  const { isLoaded, userId } = useAuth();
  const [likeState, setLikeState] = useState({
    likeCount: likes.length,
    isLiked: userId ? likes.includes(userId) : false,
  });

  const [optimisticLike, switchOptimisticLike] = useOptimistic(
    likeState,
    (state, value) => {
      return {
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      };
    }
  );

  const likeAction = async () => {
    switchOptimisticLike("switchLike");
    try {
      await switchLike(postId);
      // 操作成功
      setLikeState((state) => ({
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      }));
    } catch (error) {
      toast.error("Failed to like/unlike the post");
    }
  };
  return (
    <div className="flex items-center justify-between text-sm my-4">
      <div className="flex gap-8">
        <div className="flex items-center gap-4 justify-center bg-slate-50 p-2 rounded-3xl">
          <form action={likeAction}>
            <button>
              <Image
                className="cursor-pointer"
                src={optimisticLike.isLiked ? "/liked.png" : "/like.png"}
                alt="like"
                width={16}
                height={16}
              />
            </button>
          </form>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {optimisticLike.likeCount}
            <span className="hidden md:inline "> Likes</span>
          </span>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-3xl">
          <Image
            className="cursor-pointer"
            src="/comment.png"
            alt="comment"
            width={16}
            height={16}
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {commentNumber} <span className="hidden md:inline"> Comments</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-3xl">
        <Image
          className="cursor-pointer"
          src="/share.png"
          alt="share"
          width={16}
          height={16}
        />
        <span className="text-gray-300">|</span>
        <span className="text-gray-500">
          <span className="hidden md:inline"> Share</span>
        </span>
      </div>
    </div>
  );
}

export default PostInteraction;
