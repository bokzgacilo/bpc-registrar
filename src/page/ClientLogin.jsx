import { Container, Stack, Input, Button, FormControl, FormLabel, Box, Image, Center, Heading, useToast, useDisclosure, Modal, ModalOverlay, ModalBody, ModalContent, ModalHeader, ModalCloseButton, ModalFooter } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function ClientLogin () {
  const [session, setSession] = useState(null);
  const [Email, SetEmail] = useState('');
  const [Password, SetPassword] = useState('');
  const [RegEmail, SetRegEmail] = useState('');
  const [RegPassword, SetRegPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const {isOpen, onOpen, onClose} = useDisclosure();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data?.session) {
        setSession(data.session); // Set session if user is signed in
        navigate('/');
      } else {
        // If no session, redirect to login page
        navigate('/login');
      }
    };

    checkSession()
  }, [session])

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email: Email,
      password: Password,
    });

    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/')
    }
  };


  const openRegisterForm = () => {
    onOpen()
  }

  const signUpNewUser = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: RegEmail,
      password: RegPassword,
      options: {
        emailRedirectTo: 'http://localhost:5173',
      },
    })

    console.log(data)

    const userId = data.user.id;  // Use the authenticated user id

    if (error) {
      toast({
        title: 'Register Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {

      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            user_id: userId,                // User ID from Supabase Auth
            email: RegEmail,
            password: RegPassword,                     // Email
            requested_ids: [],         // Initialize empty array for requested IDs
            last_signed_in: new Date()  // Store current timestamp
          }
        ]);

      if (insertError) {
        console.error('Error saving user data to table:', insertError.message);
      } else {
        console.log('User data saved to table successfully');
      }

      toast({
        title: 'Register Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={signUpNewUser}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="Email" name="reg_email" type="email" value={RegEmail} onChange={(e) => SetRegEmail(e.target.value)}/>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input placeholder="Password" name="reg_password" type="password" value={RegPassword} onChange={(e) => SetRegPassword(e.target.value)} />
                </FormControl>
                <Button type="submit" colorScheme="blue">Register</Button>
              </Stack>
            </form>
            
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <Container p={4} maxW='400px'>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4} pt='5vh'>
            <Center>
              <Image width='120px' src='/assets/bpc-logo.png' />
            </Center>
            <Heading mt={4} mb={4} >Student Login</Heading>
            <FormControl id="Email" isRequired>
              <FormLabel>Student Email</FormLabel>
              <Input placeholder="Student Email" type="email" value={Email} onChange={(e) => SetEmail(e.target.value)}/>
            </FormControl>
            <FormControl id="Password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input placeholder="Password" type='password' value={Password} onChange={(e) => SetPassword(e.target.value)} />
            </FormControl>
            <Button mt={4} colorScheme="green" type="submit" size='lg' >Log In</Button>
            <Button variant='link' onClick={openRegisterForm}>Register</Button>
          </Stack>
        </form>
      </Container>
    </>
  )
}