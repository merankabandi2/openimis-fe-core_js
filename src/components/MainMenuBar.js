import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModulesManager } from "../helpers/modules";
import MainMenuContribution from "./generics/MainMenuContribution";

function getMenus(modulesManager, key, rights) {
  const menus = modulesManager.getContribs(key);
  const menuConfig = modulesManager.getConf("fe-core", "menus", []);
  const isMenuConfigEmpty = !menuConfig || menuConfig.length === 0;
  
  let processedMenus;
  if (!isMenuConfigEmpty) {
    const sortedMenus = sortMenus(menus, menuConfig);
    processedMenus = processMenu(sortedMenus);
  } else {
    processedMenus = processMenu(menus);
  }

  const unmatchedMenus = getUnmatchedMenus(menuConfig, menus, rights, modulesManager);
  return [...processedMenus, ...unmatchedMenus];
};

function getUnmatchedMenus(menuConfig, menus, rights, modulesManager) {
  const existingIds = menus
    .filter((menu) => typeof menu === 'object')
    .map((menu) => menu.name);
  const history = useHistory();
  const unmatchedConfigs = menuConfig.filter((config) => !existingIds.includes(config.id));

  return unmatchedConfigs
  .map((config) => {
    if (config.filter && !config.filter(rights)) {
      return null;
    }

    return () => (
      <MainMenuContribution
        header={config.name}
        menuId={config.id}
        modulesManager={modulesManager}
        rights={rights}
        history={history}
        entries={[]}
      />
    );
  })
  .filter(Boolean);
}

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
  const rights = useSelector((state) => state.core?.user?.i_user?.rights || []);
  const components = useMemo(() => {
    const components = getMenus(modulesManager, contributionKey, rights);
    if (reverse) {
      components.reverse();
    }
    return components;
  }, [contributionKey, reverse, rights]);

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
