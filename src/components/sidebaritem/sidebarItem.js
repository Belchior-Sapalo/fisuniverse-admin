import React from 'react'
import "../sidebaritem/sidebarItem.css"

export default function SidebarItem({title}) {
  return (
    <div className="sidebarItemContent">
        <div id="sidebarItemTitleContainer">
            <h4 id="sidebarItemTitle">{title}</h4>
        </div>
    </div>
  )
}
