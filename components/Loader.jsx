import Image from "next/image";
import images from "../assets";

const Loader = () => (
  <div className="flexStart min-h-screen">
    <div className="flexCenter w-full my-4">
      <Image
        src={images.loader}
        alt="loader"
        width={100}
        style={{ objectFit: "contain" }}
      />
    </div>
  </div>
);

export default Loader;
