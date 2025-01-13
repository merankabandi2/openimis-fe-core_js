import React, { useMemo } from "react";
import { useModulesManager } from "../helpers/modules";

function getMenus(modulesManager, key) {
  const menus = modulesManager.getContribs(key);
  const menuConfig = modulesManager.getConf("fe-core", "menus", []);
  const isMenuConfigEmpty = !menuConfig || menuConfig.length === 0;
  if ( !isMenuConfigEmpty ) {
    const sortedMenus = sortMenus(menus, menuConfig);
    return processMenu(sortedMenus);
  }
  else {
    return processMenu(menus);
  } 
};

function processMenu(menus) {
  return menus
    .map((menu) => {
      const menuType = typeof menu;
      return (
        menuType === 'object' ? menu.component : menu
      )
    }
  ).filter(Boolean);
};

function sortMenus(menus, menuConfig) {
  const filteredMenus = menus.filter((menu) => {
    const menuId = typeof menu === 'object' ? menu.name : menu;
    return menuConfig.some(config => config.id === menuId);
  });

  const updatedMenus = filteredMenus.map((menu) => {
    const menuId = typeof menu === 'object' ? menu.name : menu;
    const configMatch = menuConfig.find(config => config.id === menuId);
    if (configMatch && typeof menu === 'object') {
      return { ...menu, ...configMatch };
    }
    return menu;
  });
  return updatedMenus.sort((a, b) => a.position - b.position);
}

const MainMenuBar = ({ children = null, contributionKey, reverse = false, ...delegated }) => {
  const modulesManager = useModulesManager();
  const components = useMemo(() => {
    const components = getMenus(modulesManager, contributionKey);
    if (reverse) {
      components.reverse();
    }
    return components;
  }, [contributionKey, reverse]);

  return (
    <>
      {children}
      {components.map((Comp, idx) => {
        return <Comp key={`${contributionKey}_${idx}`} modulesManager={modulesManager} {...delegated} />
        }
      )}
    </>
  );
};

export default MainMenuBar;
