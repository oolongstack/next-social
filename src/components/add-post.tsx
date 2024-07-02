import Image from "next/image";

function AddPost() {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src="https://images.pexels.com/photos/26742034/pexels-photo-26742034.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
        height={48}
        width={48}
        alt="avatar"
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <div className="flex gap-4">
          <textarea
            placeholder="what's on your mind?"
            className="flex-1 bg-slate-100 rounded-lg p-2 outline-none resize-none"
          />
          <Image
            src="/emoji.png"
            height={20}
            width={20}
            alt="emoji"
            className="w-5 h-5 cursor-pointer self-end"
          />
        </div>
        {/* POST OPTIONS */}
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addImage.png" height={20} width={20} alt="add photo" />
            Photo
          </div>
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
