import Link from "next/link";

export default function Home() {
  const styles = {
    link: "p-2 border border-gray-200 border-solid",
  };

  return (
    <div className="container mx-auto ">
      <div className="grid place-items-center min-h-[100vh]">
        <div className="grid place-items-center space-y-4">
          <Link className={styles.link} href="/xr-calendar">
            XR Calendar
          </Link>
          <Link className={styles.link} href="/finger-spinner">
            Finger Spinner
          </Link>
        </div>
      </div>
    </div>
  );
}
