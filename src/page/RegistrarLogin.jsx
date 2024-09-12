import { Container, Stack, Input, Button, FormControl, FormLabel, Image, Center, Heading, useToast, useDisclosure, Modal, ModalOverlay, ModalBody, ModalContent, ModalHeader, ModalCloseButton, ModalFooter } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrarLogin () {
  const [Email, SetEmail] = useState('');
  const [Password, SetPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(Email === "REG001" && Password === "12345"){
      localStorage.setItem('registrar_login', true)

      navigate('/registrar')

      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }else {
      toast({
        title: 'Login Failed',
        description: "Registrar Code and Password incorrect",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Container p={4} maxW='400px'>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4} pt='5vh'>
            <Center>
              <Image width='120px' src='/assets/bpc-logo.png' />
            </Center>
            <Heading mt={4} mb={4} >Registrar Login</Heading>
            <FormControl id="Email" isRequired>
              <FormLabel>Registrar Code</FormLabel>
              <Input placeholder="Code" type="text" value={Email} onChange={(e) => SetEmail(e.target.value)}/>
            </FormControl>
            <FormControl id="Password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input placeholder="Password" type='password' value={Password} onChange={(e) => SetPassword(e.target.value)} />
            </FormControl>
            <Button mt={4} colorScheme="green" type="submit" size='lg' >Log In</Button>
          </Stack>
        </form>
      </Container>
    </>
  )
}