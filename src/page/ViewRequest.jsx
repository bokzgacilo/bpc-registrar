import { Button, Container, Flex, Grid, Heading, Input, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

export default function ViewRequest() {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [RequestData, SetRequestData] = useState([])
  const [Status, SetStatus] = useState("")
  const {isOpen, onOpen, onClose} = useDisclosure()

  useEffect(() => {
    const getRequestData = async () => {
      let { data, error } = await supabase
      .from('request')
      .select("*")
      .eq('id', id)

      if(data) {
        SetRequestData(data)
        SetStatus(data[0].status)
        console.log(data)
      }
    }

    getRequestData()
  }, [])

  const handleBack = () => {
    navigate('/registrar')
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    return formattedDate;
  }

  const ReleaseRequest = async () => {
    const { error } = await supabase
      .from("request")
      .update({ status: "Released" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve the request.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Show confirmation toast
      const user = await supabase.auth.getUser();
  
      if (user) {
        const response = await fetch('http://localhost/registrar/send-email-release.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'email': user.data.user.email,
            'document_type' : RequestData[0].document_type
          }),
        });

        toast({
          title: "Released",
          description: "Request released.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
  
      } else {
        throw new Error('User is not authenticated');
      }

      onClose();
    }
  }

  const ApproveRequest = async () => {
    const { error } = await supabase
      .from("request")
      .update({ status: "Approved" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve the request.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Show confirmation toast
      const user = await supabase.auth.getUser();
  
      if (user) {
        const response = await fetch('http://localhost/registrar/send-email-approve.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'email': user.data.user.email,
            'document_type' : RequestData[0].document_type
          }),
        });

        toast({
          title: "Confirmed",
          description: "Request has been approved.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
  
      } else {
        throw new Error('User is not authenticated');
      }

      onClose();
    }
  }
  

  return(
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {Status === 'Pending' && <ModalHeader>Confirm Request Approval</ModalHeader>}
          {Status === 'Approved' && <ModalHeader>Release Request</ModalHeader>}
          
          
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight='500'>Are you sure you want to proceed? This action cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            {Status === 'Pending' && <Button colorScheme="green" onClick={ApproveRequest}>Confirm</Button>}
            {Status === 'Approved' && <Button colorScheme="green" onClick={ReleaseRequest}>Confirm</Button>}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Stack spacing={4}>
      <Flex flexDirection='row' gap={2} alignItems='center'>
        <Button onClick={handleBack} size='sm'>Back</Button>
        
      </Flex>
      <Grid templateColumns="75% 25%">
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
            {RequestData.map((data) => (
              <>
              <Tr>
                <Td><Heading size='md'>Request Details</Heading></Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Status</Td>
                <Td>{data.status}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Request ID</Td>
                <Td>{data.id}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Request Date</Td>
                <Td>{formatDate(data.date_requested)}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Document Type</Td>
                <Td>{data.document_type}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Purpose</Td>
                <Td>{data.purpose}</Td>
              </Tr>
              <Tr>
                <Td><Heading size='md'>Student Details</Heading></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Student Last Name</Td>
                <Td>{data.last_name}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Student First Name</Td>
                <Td>{data.first_name}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Student Middle Name</Td>
                <Td>{data.middle_name}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Program</Td>
                <Td>{data.program}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Year Graduated / Last Year Attended</Td>
                <Td>{data.year_graduated}</Td>
              </Tr>
              <Tr>
                <Td><Heading size='md'>Contact Details</Heading></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Alternate Email</Td>
                <Td>{data.alternate_email}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Contact Number</Td>
                <Td>{data.contact_number}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Facebook Account</Td>
                <Td>{data.facebook}</Td>
              </Tr>
              <Tr>
                <Td><Heading size='md'>Address Details</Heading></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Street</Td>
                <Td>{data.street}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Barangay</Td>
                <Td>{data.barangay}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">City</Td>
                <Td>{data.city}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Region/Province</Td>
                <Td>{data.region}</Td>
              </Tr>
              </>
            ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Stack spacing={2}>
          <Heading size='md'>Actions</Heading>
          {Status === 'Pending' ? <Button onClick={onOpen} mt={4} colorScheme="green">Approve</Button> : ""}
          {Status === 'Approved' ? <Button onClick={onOpen} mt={4} colorScheme="green">Release</Button> : ""}
          <Button  colorScheme="red">Reject</Button>
        </Stack>
      </Grid>
    </Stack>
    </>
    
  )
}