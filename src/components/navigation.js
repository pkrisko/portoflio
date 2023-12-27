import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="absolute top-0 left-0 py-6 px-24 w-full">
      <ul className="flex justify-between w-full">
        <li>
          <Link href="/">
            Patrick Krisko
          </Link>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/pkrisko" className="text-lg">Portfolio</a>
        </li>
        <li>
          <a href="mailto:patrick.krisko@gmail.com" className="text-lg">patrick.krisko@gmail.com</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
