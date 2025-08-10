import Image from "next/image";

const BannerImage = () => {
  return (
    <div className="relative w-full h-28 ">
      <Image
        src="/images/banner/cynus_loop.jpg"
        alt="Banner"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
};

export default BannerImage;
