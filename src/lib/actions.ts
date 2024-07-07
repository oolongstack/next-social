"use server";

import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "./client";

export const switchFollow = async (userId: User["id"]) => {
  // 这是当前登陆的人的id
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("Please sign in to follow a user");
  }

  try {
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    // 如果已经关注了
    if (existingFollow) {
      // 取关
      await prisma.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      // 关注

      // 先看有没有发过好友申请
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      });

      if (existingFollowRequest) {
        // 申请过就不用再申请了 删除该申请
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });
      } else {
        // 申请follow
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          },
        });
      }
    }
  } catch (error) {
    throw new Error("Failed to follow/unfollow user");
  }
};

export const switchBlock = async (userId: User["id"]) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) {
    throw new Error("Please sign in to block/unblock user");
  }
  try {
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });
    // 当前登陆用户已经把他拉黑
    if (existingBlock) {
      await prisma.block.delete({
        where: {
          id: existingBlock.id,
        },
      });
    } else {
      // 拉黑
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
    }
  } catch (error) {
    throw new Error("Failed to block/unblock user");
  }
};

// 接受follow请求的action
export const acceptFollowRequest = async (userId: User["id"]) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) {
    throw new Error("Please sign in to accept follow request");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      // 1. 先删除这一条follow申请
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
      // 2. 然后创建一条follow关系
      await prisma.follower.create({
        data: {
          followerId: userId,
          followingId: currentUserId,
        },
      });
    }
  } catch (error) {
    throw new Error("Failed to accept follow request");
  }
};

// 拒绝follow请求的action
export const declineFollowRequest = async (userId: User["id"]) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) {
    throw new Error("Please sign in to accept follow request");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      // 删除这一条follow申请
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
  } catch (error) {
    throw new Error("Failed to accept follow request");
  }
};

export const updateProfile = async (
  prevState: { success: boolean; error: boolean },
  payload: { formData: FormData; cover: string }
) => {
  const { formData, cover } = payload;
  const fields = Object.fromEntries(formData);

  const filteredFields = Object.fromEntries(
    Object.entries(fields).filter(
      ([_, value]) => (value as unknown as string) !== ""
    )
  );

  const { userId } = auth();

  if (!userId) {
    return { success: false, error: true };
  }

  const Profile = z.object({
    cover: z.string().optional(),
    name: z.string().max(60).optional(),
    surname: z.string().max(60).optional(),
    description: z.string().max(255).optional(),
    city: z.string().max(60).optional(),
    school: z.string().max(60).optional(),
    work: z.string().max(60).optional(),
    website: z.string().max(60).optional(),
  });

  const validatedFields = Profile.safeParse({ cover, ...filteredFields });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: validatedFields.data,
    });
    return { success: true, error: false };
  } catch (error) {
    console.log("error: ", error);
    return { success: false, error: true };
  }
};

export const switchLike = async (postId: number) => {
  const { userId } = auth();
  if (!userId) {
    return new Error("Please sign in to like/unlike a post");
  }
  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      // delete this like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // do like
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
  } catch (error) {
    return new Error("Failed to like/unlike a post");
  }
};

export const addComment = async (postId: number, desc: string) => {
  const { userId } = auth();
  if (!userId) {
    return new Error("Please sign in to add a comment");
  }

  try {
    const createComment = await prisma.comment.create({
      data: {
        postId,
        userId,
        desc,
      },
      include: {
        user: true,
      },
    });
    return createComment;
  } catch (error) {
    return new Error("Failed to add a comment");
  }
};

export const addPost = async (formData: FormData, img: string) => {
  const { userId } = auth();
  if (!userId) {
    return new Error("Please sign in to add a post");
  }

  const desc = formData.get("desc") as string;
  const Desc = z.string().min(1).max(255);

  const validatedDesc = Desc.safeParse(desc);

  if (!validatedDesc.success) {
    return new Error("Failed to add a post");
  }

  try {
    await prisma.post.create({
      data: {
        desc: validatedDesc.data,
        img,
        userId,
      },
    });

    // 刷新页面
    revalidatePath("/");
  } catch (error) {
    return new Error("Failed to add a post");
  }
};

export const addStory = async (img: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });

    if (existingStory) {
      await prisma.story.delete({
        where: {
          id: existingStory.id,
        },
      });
    }
    const createdStory = await prisma.story.create({
      data: {
        userId,
        img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });

    return createdStory;
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = async (postId: number) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    await prisma.post.delete({
      where: {
        id: postId,
        userId,
      },
    });
    revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
};
