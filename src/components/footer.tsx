export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="h-[80px] flex flex-col justify-center items-center">
      <p>&copy; {year} k2ep-ru2ning</p>
    </footer>
  );
}
