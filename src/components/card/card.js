import "../card/card.css"
import React from 'react'

export default function Card({title, autor, ano, editora, description, img, id, Delbtn, EdBtn, token}) {

  return (
    <div id="card-container" className="col-12">
        <div id="post-cover-container">
            <img className="img-fluid" src={img} style={{ maxWidth: '150px' }} alt={title}/>
        </div>
        <div id="text-container">
            <div id="text-about-book">
                <div id="post-infor-container">
                    <h6>{title}</h6>
                </div>
                <div id="post-desc-container">
                    <p>{description}</p>
                </div>
                <div id="post-more-infor-container">
                    <h6>{autor}</h6>
                    <h6>{ano}</h6>
                    <h6>{editora}</h6>
                </div>
            </div>
            
            <div id="options-container" style={{display: token ? "flex" : "none"}}>
                <div>
                    {Delbtn}
                </div>

                <div>
                    {EdBtn}
                </div>
            </div>
        </div>
    </div>
  )
}
