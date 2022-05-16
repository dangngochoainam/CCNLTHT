import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./layouts/Header/Header";
import Footer from "./layouts/Footer/Footer";
import Home from "./components/Home/Home";
import { createContext, useReducer } from "react";
import userReducer from "./reducers/UserReducer";
import Login from "./components/Login/Login";
import cookies from 'react-cookies'
import Register from "./components/Register/Register";
import UserDetail from "./components/UserDetail/UserDetail";
import UserPage from "./components/UserPage/UserPage";
import PostsDetail from "./components/PostsDetail/PostsDetail";
import PostsModal from "./components/PostsModal/PostsModal";
import { authAxios, endpoints } from "./configs/Apis";


export const UserContext = createContext()


function App() {

  const [user, dispatch] = useReducer(userReducer, cookies.load("user"))



  return (
    <>
      <BrowserRouter>

        <UserContext.Provider value={[user, dispatch]}>

          <Header />
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/users/:userId" element={<UserPage/>}/>
            <Route path="/posts/:postsId" element={<PostsDetail/>}/>
            <Route path='/posts/add-posts' element={<PostsModal/>}/>
            <Route path='/posts/:postsId/update-posts' element={<PostsModal />}/>
          </Routes>
          <Footer />

        </UserContext.Provider>

      </BrowserRouter>
    </>
  );
}

export default App;
