import "../card/card.css"

import React from 'react'

export default function Card({className, title, autor, ano, editora, description, img}) {
  return (
    <div id="card-container" className={className}>
        <div id="post-cover-container">
            <img className="img-fluid" src={img}/>
        </div>
        <div id="text-container">
            <div id="post-infor-container">
                <h6>{title}</h6>
                <h6>{autor}</h6>
                <h6>{ano}</h6>
                <h6>{editora}</h6>
            </div>
            <div id="post-desc-container">
                <p>{description}</p>
            </div>
            <div id="options-container">
                <button className="btn btn-danger">Eliminar</button>
            </div>
        </div>
    </div>
  )
}
