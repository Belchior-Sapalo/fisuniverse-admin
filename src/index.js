import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './pages/home/home';
import './index.css';
import OnePost from './pages/post/OnePost';
import RecoverPass from './pages/recoverPass/recoverPass';
import Anexos from './pages/Anexos/anexos';
import PostsManager from './pages/Posts/postsManager';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/painel-adm/posts" element={<PostsManager/>}/>
          <Route path="/painel-adm/anexos" element={<Anexos/>}/>
          <Route path="/post" element={<OnePost/>}/>
          <Route path="/recover-pass" element={<RecoverPass/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
