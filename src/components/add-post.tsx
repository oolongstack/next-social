"use client";
import { addPost } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import AddPostButton from "./add-post-button";

function AddPost() {
  // const { userId } = auth();
  const { user, isLoaded } = useUser();

  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<CloudinaryUploadWidgetInfo>();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user?.imageUrl || "/noAvatar.png"}
        height={48}
        width={48}
        alt="avatar"
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <form
          action={(formData) => addPost(formData, img?.secure_url || "")}
          className="flex gap-4"
        >
          <textarea
            placeholder="what's on your mind?"
            className="flex-1 bg-slate-100 rounded-lg p-2 outline-none resize-none"
            onChange={(e) => setDesc(e.target.value)}
            name="desc"
            value={desc}
          />
          <div>
            <Image
              src="/emoji.png"
              height={20}
              width={20}
              alt="emoji"
              className="w-5 h-5 cursor-pointer self-end"
            />
            <AddPostButton />
          </div>
        </form>
        {/* POST OPTIONS */}
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <CldUploadWidget
            uploadPreset="social"
            onSuccess={(result, { widget }) => {
              setImg(result.info as CloudinaryUploadWidgetInfo);
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image
                    src="/addImage.png"
                    height={20}
                    width={20}
                    alt="add photo"
                  />
                  Photo
                </div>
              );
            }}
          </CldUploadWidget>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addVideo.png" height={20} width={20} alt="add photo" />
            Video
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/poll.png" height={20} width={20} alt="add photo" />
            Poll
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addEvent.png" height={20} width={20} alt="add photo" />
            Event
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPost;
