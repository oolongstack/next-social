import { User } from "@prisma/client";
import { Suspense } from "react";
import Ad from "../ad";
import UserInfoCard from "../user-info-card";
import UserMediaCard from "../user-media-card";
import Birthdays from "./birthdays";
import FriendRequests from "./friend-requests";

interface RightMenuProps {
  user?: User;
}

function RightMenu({ user }: RightMenuProps) {
  return (
    <div className="flex flex-col gap-6">
      {user ? (
        <>
          <Suspense fallback={<div>loading...</div>}>
            <UserInfoCard user={user} />
          </Suspense>
          <Suspense fallback={<div>loading...</div>}>
            <UserMediaCard user={user} />
          </Suspense>
        </>
      ) : null}
      <FriendRequests />
      <Birthdays />
      <Ad size="md" />
    </div>
  );
}

export default RightMenu;
