"use client";
import { acceptFollowRequest, declineFollowRequest } from "@/lib/actions";
import { FollowRequest, User } from "@prisma/client";
import Image from "next/image";
import { useOptimistic, useState } from "react";
interface FriendRequestListProps {
  requests: (FollowRequest & { sender: User })[];
}
function FriendRequestList({ requests }: FriendRequestListProps) {
  const [requestState, setRequestState] = useState(requests);

  const accept = async (requestId: number, userId: User["id"]) => {
    // 先乐观更新接受follow成功
    removeOptimisticRequest(requestId);

    try {
      await acceptFollowRequest(userId);
      setRequestState((prevRequests) =>
        prevRequests?.filter((request) => request.id !== requestId)
      );
    } catch (error) {}
  };
  const decline = async (requestId: number, userId: User["id"]) => {
    // 先乐观更新接受follow成功
    removeOptimisticRequest(requestId);

    try {
      await declineFollowRequest(userId);
      setRequestState((prevRequests) =>
        prevRequests?.filter((request) => request.id !== requestId)
      );
    } catch (error) {}
  };

  const [optimisticRequests, removeOptimisticRequest] = useOptimistic(
    requestState,
    (state, value: number) => state?.filter((request) => request.id !== value)
  );
  return (
    <>
      {optimisticRequests?.map((request) => {
        return (
          <div key={request.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={request?.sender?.avatar || "/noAvatar.png"}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold">
                {request?.sender?.name && request?.sender?.surname
                  ? request?.sender?.name + " " + request?.sender?.surname
                  : request?.sender?.username}
              </span>
            </div>
            <div className="flex gap-3 justify-end">
              <form
                className="flex items-center"
                action={() => accept(request.id, request.sender.id)}
              >
                <button>
                  <Image
                    src="/accept.png"
                    alt=""
                    width={20}
                    height={20}
                    className="cursor-pointer"
                  />
                </button>
              </form>

              <form
                className="flex items-center"
                action={() => decline(request.id, request.sender.id)}
              >
                <button>
                  <Image
                    src="/reject.png"
                    alt=""
                    width={20}
                    height={20}
                    className="cursor-pointer"
                  />
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default FriendRequestList;
