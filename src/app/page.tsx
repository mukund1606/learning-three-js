import Link from "next/link";

const HomePage = () => {
  return (
    <main className="flex flex-col items-center justify-center w-full h-screen gap-5 text-white bg-black">
      <Link href="/css-3d" className="hover:underline">
        Link to CSS-3D
      </Link>
      <Link href="/tutorial1" className="hover:underline">
        Link to Tutorial 1
      </Link>
      <Link href="/tutorial2" className="hover:underline">
        Link to Tutorial 2
      </Link>
      <Link href="/tutorial3" className="hover:underline">
        Link to Tutorial 3
      </Link>
      <Link href="/tutorial4" className="hover:underline">
        Link to Tutorial 4
      </Link>
    </main>
  );
};

export default HomePage;
