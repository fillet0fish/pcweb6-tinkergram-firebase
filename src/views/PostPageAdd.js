import React, { useEffect, useState } from "react";
import { Button, Container, Form, Image} from "react-bootstrap";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { signOut } from "firebase/auth";
import Navigation from "../components/Navigation"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"


export default function PostPageAdd() {
  const  [caption, setCaption] = useState("");
  const [ image, setImage] = useState("");
  const [ user, loading ] = useAuthState(auth);
  const [imageName,setImageName] =useState("");
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(
    "https://zca.sg/img/placeholder"
  );

  async function addPost() {
    const imageReference = ref(storage, `images/${image.name}`);
    const response = await uploadBytes(imageReference,image);
    const imageUrl = await getDownloadURL(response.ref)
    await addDoc(collection (db, "posts"),{caption,image:imageUrl,imageName:imageName});
    navigate("/");
  }

  useEffect(() => {
    if(loading) return ;
    if(!user) return navigate("/login");

  }, [loading, user, navigate]);

  return (
    <>
    <Navigation />
      {/* <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Post</Nav.Link>
            <Nav.Link onClick = {(e) => signOut(auth)}>🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar> */}
      <Container>
        <h1 style={{ marginBlock: "1rem" }}>Add Post</h1>
        <Form>
          <Form.Group className="mb-3" controlId="caption">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lovely day"
              value={caption}
              onChange={(text) => setCaption(text.target.value)}
            />
          </Form.Group>

          <Image 
          src = {previewImage} 
          style={{
            objectFit:"cover",
            width: "10rem",
            height: "10rem"
          }}
          />
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="file"
              // placeholder="https://zca.sg/img/1"
              // value={image}
              onChange={(e) => {
                // console.log(e.target.files[0]);
                const imageFile=e.target.files[0];
                setImage(e.target.files[0]);
                const previewImage = URL.createObjectURL(imageFile);
                setPreviewImage(previewImage);
                setImageName(imageFile.name);
              }
              }
            />
            <Form.Text className="text-muted">
              Make sure the url has a image type at the end: jpg, jpeg, png.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" onClick={async (e) => addPost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}
