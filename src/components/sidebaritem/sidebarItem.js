import "../sidebaritem/sidebarItem.css"

import React from 'react'

export default function SidebarItem({icon, title, isVisible}) {
  return (
    <div className="sidebarItemContent">
        <div id="sidebarIconContainer" className={isVisible ? "sidebarIconContainer": "sidebarIconContainer-invisible"}>
            {icon}
        </div>
        <div id="sidebarItemTitleContainer">
            <h4 id="sidebarItemTitle" className={isVisible ? "sidebarItemTitle": "sidebarItemTitle-invisible"}>{title}</h4>
        </div>
    </div>
  )
}
