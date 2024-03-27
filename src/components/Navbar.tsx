import Link from "next/link";

const Navbar: React.FC = () => (
  <header className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white shadow-md">
    <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
      <Link href="/" passHref>
        <span className="cursor-pointer flex title-font font-semibold items-center text-white mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          ByteField
        </span>
      </Link>
      <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
        <Link href="/about" passHref>
          <span className="mr-5 hover:text-white transition duration-300 cursor-pointer">
            About
          </span>
        </Link>
        <Link href="/snippets" passHref>
          <span className="mr-5 hover:text-white transition duration-300 cursor-pointer">
            Snippets
          </span>
        </Link>
        <Link href="/editor" passHref>
          <span className="mr-5 hover:text-white transition duration-300 cursor-pointer">
            Editor
          </span>
        </Link>
        <Link href="/projects" passHref>
          <span className="mr-5 hover:text-white transition duration-300 cursor-pointer">
            Projects
          </span>
        </Link>
        <Link href="/login" passHref>
          <span className="mr-5 hover:text-white transition duration-300 cursor-pointer">
            Login
          </span>
        </Link>
      </nav>
    </div>
  </header>
);

export default Navbar;
