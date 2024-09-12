import { Button, Container, Flex, Grid, Heading, Image, SimpleGrid, Stack } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Registrar() {
  const navigate = useNavigate()

  useEffect(() => {
    if(localStorage.getItem('registrar_login') === true || localStorage.getItem('registrar_login') !== null){
      console.log('Logged')
    }else {
      navigate('/registrar/login')
    }
  }, [])

  return(
    <Container p={0} maxW='full'>
      <Flex p={4} backgroundColor='rgb(7, 131, 7)' flexDirection='row' alignItems='center'>
        <Flex flexDirection='row' gap={3} alignItems='center'>
          <Image width='40px' src='/assets/bpc-logo.png' />
          <Heading color='#fff' size='md'>BPC Registrar Dashboard</Heading>
        </Flex>
      </Flex>
      <Grid templateColumns='20% 80%' p={4}>
        <Stack spacing={2} p={4}>
          <Heading size='md'>Menu</Heading>
          <Button onClick={() => navigate('/registrar')}>Requests</Button>
          <Button onClick={() => navigate('/registrar/approved')}>Approved</Button>
          <Button onClick={() => navigate('/registrar/released')}>Released</Button>
          {/* <Button onClick={() => navigate('/registrar/accounts')}>Accounts</Button> */}
        </Stack>
        <Stack p={4}>
          <Outlet />
        </Stack>
      </Grid>
    </Container>
  )
}