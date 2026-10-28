import { Link } from "react-router";

export default function NotFound () {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 pt-10">
        <img src="src/assets/not_found.png" alt="not_found" className="mx-auto"/>
        <div className="flex flex-col justify-center gap-6">
          <p className="text-7xl font-bold">Page not found.</p>
          <p>The Gecko searched high and low, but couldn’t find the page you’re looking for.</p>
          <p>Let’s find a better place for you to go:</p>
          <Link to="/" className="bg-green-400 text-green-800 w-fit p-2 rounded shadow-lg font-semibold hover:bg-green-300">Take me home</Link>
        </div>
      </div>
    </>
  );
}