import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import PrivateRoute from './components/privateRoute/privateRoute';
import './index.css';
import BooksManager from './pages/booksManager/booksManager';
import ErrorPage from './pages/errorPage/errorPage';
import Home from './pages/home/home';
import PostAndComments from './pages/postAndComments/postAndComments';
import PostsManager from './pages/postManager/postsManager';
import RecoverPass from './pages/recoverPass/recoverPass';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<App/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/admin/posts" element={<PrivateRoute><PostsManager/></PrivateRoute>}/>
          <Route path="/admin/books" element={<PrivateRoute><BooksManager/></PrivateRoute>}/>
          <Route path="/post/comments" element={<PrivateRoute><PostAndComments/></PrivateRoute>}/>
          <Route path="/admin/auth/recover" element={<RecoverPass/>}/>
          <Route path="/error" element={<ErrorPage/>}/>
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
