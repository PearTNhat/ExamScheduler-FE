import { useCallback, useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { sideBarActions } from "~/stores/slice/sideBar";
import { navItems } from "~/constants/navAdmin";
import { showToastSuccess } from "~/utils/alert";
import { userActions } from "~/stores/slice/userSlice";
import { LaptopLogo, Logo } from "~/assets/images";

const SideBar = () => {
  const navigate = useNavigate();
  const { isExpanded, isMobileOpen, isHovered } = useSelector(
    (state) => state.sideBar
  );
  const { accessToken } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const handleToggle = () => {
    dispatch(sideBarActions.toggleSidebar());
  };

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );
  const handleLogout = () => {
    dispatch(userActions.logout());
    showToastSuccess("Đăng xuất thành công!");
    navigate("/login");
  };
  useEffect(() => {
    let submenuMatched = false;
    ["main"].forEach((menuType) => {
      const items = navItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType, index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  // Reset submenu khi sidebar được thu nhỏ hoặc hover bị tắt
  useEffect(() => {
    if (!isExpanded && !isHovered && !isMobileOpen) {
      setOpenSubmenu(null);
      dispatch(sideBarActions.resetSubmenu());
    }
  }, [isExpanded, isHovered, isMobileOpen, dispatch]);
  useEffect(() => {
    if (!accessToken) {
      dispatch(userActions.logout());
      navigate("/login");
    }
  }, [accessToken]);
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    // Chỉ cho phép toggle submenu khi sidebar được mở rộng hoặc đang hover
    if (!isExpanded && !isHovered && !isMobileOpen) {
      return;
    }

    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <IoChevronDownCircleOutline
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                } ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() =>
        !isExpanded && dispatch(sideBarActions.setIsHovered(true))
      }
      onMouseLeave={() => {
        dispatch(sideBarActions.setIsHovered(false));
        // Đóng submenu khi mouse leave và sidebar đang thu nhỏ
        if (!isExpanded && !isMobileOpen) {
          setOpenSubmenu(null);
        }
      }}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <div className="flex items-center justify-between flex-1">
          <button>
            {isExpanded || isHovered || isMobileOpen ? (
              <div className="">
                <Link to="/">
                  <img
                    className="rounded-full w-10 h-10"
                    src={Logo}
                    alt="Logo"
                    width={40}
                    height={40}
                  />
                </Link>
              </div>
            ) : (
              <Link to="/">
                <img
                  className="rounded-full w-10 h-10"
                  src={Logo}
                  alt="Logo"
                  width={32}
                  height={32}
                />
              </Link>
            )}
          </button>
          <button
            className={`${
              !isExpanded && !isHovered && "hidden"
            } border text-xl p-2 rounded-md`}
            onClick={handleToggle}
          >
            <FiMenu />
          </button>
        </div>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>{renderMenuItems(navItems, "main")}</div>
          </div>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mt-auto p-1 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`w-full menu-item group menu-item-inactive hover:menu-item-active transition-all duration-200 ${
            !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
          }`}
        >
          <span className="menu-item-icon-size menu-item-icon-inactive group-hover:menu-item-icon-active">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </span>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="menu-item-text">Đăng xuất</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
