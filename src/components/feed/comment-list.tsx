"use client";
import { addComment } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Comment, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOptimistic, useState } from "react";
type CommentWithUser = Comment & { user: User };
export function CommentList({
  comments,
  postId,
}: {
  comments: CommentWithUser[];
  postId: number;
}) {
  const { user } = useUser();
  const router = useRouter();

  const [commentState, setCommentState] = useState(comments);

  const [desc, setDesc] = useState("");

  const add = async () => {
    if (!user || !desc) return;
    // 乐观更新
    addOptimisticComments({
      id: Math.random(),
      desc,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      userId: user.id,
      postId,
      user: {
        id: user.id,
        username: "Sending Please Wait...",
        avatar: user.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(Date.now()),
      },
    });
    try {
      const createComment = (await addComment(postId, desc)) as CommentWithUser;
      setCommentState((prev) => [createComment, ...prev]);
      router.refresh();
    } catch (error) {}
  };

  const [optimisticComments, addOptimisticComments] = useOptimistic(
    commentState,
    (state, value: CommentWithUser) => [value, ...state]
  );
  return (
    <>
      {user && (
        <div className="flex items-center gap-4">
          <Image
            src={user.imageUrl || "/noAvatar.png"}
            width={32}
            height={32}
            alt=""
            className="w-8 h-8 rounded-full"
          />
          <form
            className="flex flex-1 items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
            action={add}
          >
            <input
              type="text"
              placeholder="Writing a comment..."
              className="bg-transparent flex-1 outline-none"
              onChange={(e) => setDesc(e.target.value)}
            />
            <Image
              src="/emoji.png"
              width={16}
              height={16}
              alt=""
              className="cursor-pointer"
            />
          </form>
        </div>
      )}
      {/* COMMENTS */}
      <div>
        {/* COMMENT */}
        {!!optimisticComments?.length &&
          optimisticComments.map((comment) => {
            return (
              <div key={comment.id} className="flex gap-4 justify-between mt-6">
                {/* AVATAR */}
                <Image
                  src={comment?.user?.avatar || "/noAvatar.png"}
                  width={40}
                  height={40}
                  alt=""
                  className="w-10 h-10 flex-shrink-0 rounded-full"
                />
                {/* DESC */}
                <div className="flex flex-col gap-2 flex-1">
                  <span className="font-medium">
                    {comment?.user?.name && comment?.user.surname
                      ? comment?.user.name + " " + comment?.user.surname
                      : comment?.user?.username}
                  </span>
                  <p>{comment?.desc}</p>
                  <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-4">
                      <Image
                        src="/like.png"
                        alt=""
                        width={16}
                        height={16}
                        className="cursor-pointer"
                      />
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500">123 Likes</span>
                    </div>
                    <div className="cursor-pointer">Reply</div>
                  </div>
                </div>
                {/* ICON */}
                <Image
                  src="/more.png"
                  alt=""
                  width={16}
                  height={16}
                  className="cursor-pointer w-4 h-4"
                />
              </div>
            );
          })}
      </div>
    </>
  );
}
