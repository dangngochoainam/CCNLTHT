import { useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis";
import Item from "../Item/Item";
import cookies from 'react-cookies'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [prev, setPrev] = useState(false)
  const [next, setNext] = useState(false)
  const [page, setPage] = useState(1)
  const location = useLocation()


  useEffect(() => {

      const loadPosts = async() => {
        let query = location.search;

        if(query === "")
          query = `?page=${page}`
        else
          query += `&page=${page}`

        try{

          let res = await Apis.get(`${endpoints['posts']}${query}`)
          setPosts(res.data.results)
          setNext(res.data.next !== null)
          setPrev(res.data.previous !== null)
        }
        catch(err){
          console.log(err)
        }
        
      }

      loadPosts()
      console.log("useEffect")
      
  }, [location.search, page])

  const paging = (inc) => {
    setPage(page + inc)
  }

  return (
    <>
      <Container>
        <h1 className="text-center">Danh sách các bài viết</h1>
        {posts.length === 0 && <Spinner animation="border" />}
        <Row>
         {posts.map((p, idx) => <Item key={idx} id={p.id} image={p.image} title={p.title} created_date={p.created_date} user={p.user}/>)}
        </Row>
        <ButtonGroup className='text-center d-flex justify-content-center'>
          <Button variant="info" onClick={() => paging(-1)} disabled={!prev}>&lt;&lt;</Button>
          <Button variant="info" onClick={() => paging(1)} disabled={!next}>&gt;&gt;</Button>
        </ButtonGroup>
      </Container>
    </>
  );
};

export default Home;
