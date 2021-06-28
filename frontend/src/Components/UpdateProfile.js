import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import FixedBar from "./FixedBar"
export default function UpdateProfile() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser, updatePassword, updateEmail } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }
    const promises = []
    setLoading(true)
    setError("")
    if (emailRef.current.value !== currentUser.email) {
        promises.push(updateEmail(emailRef.current.value))
    }

    if (passwordRef.current.value) {
        promises.push(updatePassword(passwordRef.current.value))
    }

    Promise.all(promises).then (() => {
        history.push('/')
    }).catch(() => 
    setError("Failed to update account")
    ).finally(() => {
        setLoading(false)
    })

  }

  return (
    <>
    <FixedBar name="Update Profile">
      <Card style={{fontSize : 20 }}>
        <Card.Body>
          <h2  style={{fontSize : 35 }} className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label >Email</Form.Label>
              <Form.Control style={{fontSize : 20 }} type="email" ref={emailRef} required defaultValue={currentUser.email}/>
            </Form.Group>
            <br></br>
            <Form.Group id="password">
              <Form.Label >Password</Form.Label>
              <Form.Control style={{fontSize : 20 }} type="password" ref={passwordRef} placeholder="Leave blank to keep the same"/>
            </Form.Group>
            <br></br>
            <Form.Group id="password-confirm">
              <Form.Label >Password Confirmation</Form.Label>
              <Form.Control style={{fontSize : 20 }} type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same"/>
            </Form.Group>
            <br></br>
            <Button style={{fontSize : 20 }} disabled={loading || currentUser.email === "demo.misty.app@gmail.com"} className="w-100" type="submit">
              Update
            </Button>
            <br></br>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
         <Link style={{fontSize : 20 }} to="/"> Cancel</Link>
      </div>
      </FixedBar>
    </>
  )
}
