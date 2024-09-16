import { Navbar } from "../components/Navbar";
import ImageUploader from "../components/ImageUploader";

export const Home = () => {
  return (
    <div className="w-screen h-screen flex flex-col  items-center ">
      <Navbar />
      <ImageUploader />
    </div>
  );
};
