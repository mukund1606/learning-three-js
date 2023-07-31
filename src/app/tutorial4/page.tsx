import dynamic from "next/dynamic";

const Tutorial4 = dynamic(() => import("@/components/Tutorial4"), {
  ssr: false,
});

const Tutorial4Page = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-black">
      <Tutorial4 />
    </div>
  );
};

export default Tutorial4Page;
