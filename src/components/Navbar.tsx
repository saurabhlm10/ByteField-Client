import Link from "next/link";

const Navbar: React.FC = () => (
  <header className="bg-gray-800 text-white">
    <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
      <Link href="/" passHref>
        <span className="cursor-pointer flex title-font font-medium items-center text-white mb-4 md:mb-0">
          ByteField
        </span>
      </Link>
      <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
        <Link href="/about" passHref>
          <span className="mr-5 hover:text-gray-400 cursor-pointer">About</span>
        </Link>
        <Link href="/snippets" passHref>
          <span className="mr-5 hover:text-gray-400 cursor-pointer">
            Snippets
          </span>
        </Link>
        <Link href="/editor" passHref>
          <span className="mr-5 hover:text-gray-400 cursor-pointer">
            Editor
          </span>
        </Link>

        {/* Add more navigation links here */}
      </nav>
      {/* Implement login/logout functionality here */}
    </div>
  </header>
);

export default Navbar;
