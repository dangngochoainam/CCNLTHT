import { useEffect, useState } from "react"
import { Container, Image } from "react-bootstrap"
import { useLocation, useParams } from "react-router-dom"
import Apis, { endpoints } from "../../configs/Apis"
import Item from "../Item/Item"
import UserDetail from "../UserDetail/UserDetail"
import cookies from 'react-cookies'
import PostsModal from "../PostsModal/PostsModal"

const UserPage = () => {

    let {userId} = useParams()
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState()

    
    useEffect(() => {

        const getUser = async() => {

            let res = await Apis.get(`${endpoints['users']}${userId}/`)
            setUser(res.data)
        }

        const getPostsUser = async() => {

            let res = await Apis.get(`${endpoints['users']}${userId}/posts/`)
            setPosts(res.data)
        }

        getUser()
        getPostsUser()

        console.log("useEffect")

    }, [userId])

    // let check = false

    // if(user){
    //     check = user.id === cookies.load('user').id
    // }

    return (
        <>
            <h1 className="text-center text-info">Thông tin người dùng</h1>
            <Container className="d-flex flex-column justify-content-center align-items-center">
                {user && <UserDetail avatar={user.avatar} first_name={user.first_name} last_name={user.last_name} email={user.email}/>}
                {posts && posts.map((p, idx) => <Item key={idx} id={p.id} image={p.image} user={userId} title={p.title} created_date={p.created_date} content={p.content}/>)}
            </Container>
        </>
    )
}

export default UserPage