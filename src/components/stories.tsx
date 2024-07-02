import Image from "next/image";
function Stories() {
  return (
    <div className="p-4 ng-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
      <div className="flex gap-8 w-max">
        <div className="flex flex-col items-center gap-2 cursor-pointer">
          <Image
            width={80}
            height={80}
            src="https://images.pexels.com/photos/25853709/pexels-photo-25853709.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
            alt="avatar"
            className="w-20 h-20 rounded-full ring-2"
          />
          <span className="font-medium">Name</span>
        </div>
      </div>
    </div>
  );
}

export default Stories;
