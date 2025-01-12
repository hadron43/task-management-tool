"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen } from "@/lib/features/todosSlice";
import { RootState } from "@/lib/store";

export default function Sidebar() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(
    (state: RootState) => state.todosSlice.isSidebarOpen
  );
  const pathname = usePathname();

  const menuItems = [
    { href: "/open", label: "Open", color: "green" },
    { href: "/inProgress", label: "In Progress", color: "orange" },
    { href: "/closed", label: "Closed", color: "red" },
  ];

  const toggleSidebar = () => {
    dispatch(setSidebarOpen(!isSidebarOpen));
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={toggleSidebar}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const startX = touch.clientX;

            const handleTouchMove = (e: TouchEvent) => {
              const touch = e.touches[0];
              const diff = touch.clientX - startX;
              if (diff < -50) {
                toggleSidebar();
                document.removeEventListener("touchmove", handleTouchMove);
              }
            };

            document.addEventListener("touchmove", handleTouchMove);
            document.addEventListener(
              "touchend",
              () => {
                document.removeEventListener("touchmove", handleTouchMove);
              },
              { once: true }
            );
          }}
        />
      )}
      <div
        className={`fixed inset-0 sm:relative h-[100dvh] w-64 bg-white shadow-xl transform z-50 border-r ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out sm:translate-x-0`}
      >
        <div className="p-4">
          <Image src="/file.svg" width={32} height={32} alt="Company Logo" />
        </div>

        <hr />

        <nav className={`mt-4`}>
          <ul className="text-gray-800">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`p-4 hover:bg-gray-100 cursor-pointer flex items-center ${
                    pathname === item.href ? "bg-gray-200" : ""
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faCircle}
                    className={`mr-4 sm:mr-2 h-6 w-6 sm:h-4 sm:w-4`}
                    style={{ color: item.color, opacity: 0.7 }}
                  />
                  <span className="sm:inline">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
