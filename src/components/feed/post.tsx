import Image from "next/image";
import Comments from "./comments";
function Post() {
  return (
    <div className="flex flex-col gap-4">
      {/* user */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="https://images.pexels.com/photos/26742034/pexels-photo-26742034.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
            className="w-10 h-10 rounded-full"
            alt="user"
            width={40}
            height={40}
          />
          <span className="font-medium">Name</span>
        </div>
        <Image src="/more.png" alt="more" width={16} height={16} />
      </div>

      {/* desc */}
      <div className="flex flex-col gap-4">
        <div className="w-full min-h-96 relative">
          <Image
            src="https://images.pexels.com/photos/6459243/pexels-photo-6459243.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
            fill
            className="object-cover rounded-md"
            alt="desc"
          />
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
          quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent
          mauris. Fusce nec tellus sed augue semper porta. Mauris massa.
          Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad
          litora torquent per conubia nostra, per inceptos himenaeos. Curabitur
          sodales ligula in libero.
        </p>
      </div>
      {/* interaction */}
      <div className="flex items-center justify-between text-sm my-4">
        <div className="flex gap-8">
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-3xl">
            <Image
              className="cursor-pointer"
              src="/like.png"
              alt="like"
              width={16}
              height={16}
            />
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              123 <span className="hidden md:inline xl:hidden"> Likes</span>
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
              123 <span className="hidden md:inline xl:hidden"> Comments</span>
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
            123 <span className="hidden md:inline xl:hidden"> Shares</span>
          </span>
        </div>
      </div>

      <Comments />
    </div>
  );
}

export default Post;
