import { Heading, Container, useDisclosure, useToast, TableContainer, Flex, Image, Table, Thead, Tbody, Th, Tr, Td, Stack, Button } from "@chakra-ui/react";
import { useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";

export default function ClientViewRequest() {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [RequestData, SetRequestData] = useState([])
  const [Status, SetStatus] = useState("")
  const {isOpen, onOpen, onClose} = useDisclosure()

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

  return(
    <Container  p={0} maxW='500px'>
      <Stack pb={4} spacing={4}>
        <Flex p={4} backgroundColor='rgb(7, 131, 7)' alignItems='center' justifyContent='space-between'>
          <Flex flexDirection='row' gap={3} alignItems='center'>
            <Image width='40px' src='/assets/bpc-logo.png' />
            <Heading color='#fff' size='md'>BPC E-Registrar</Heading>
          </Flex>
        </Flex>
        <Flex>
          <Button colorScheme="blue" onClick={() => navigate('/')}>Back</Button>
        </Flex>
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
        {Status === "Approved" && <Button colorScheme="red" size='lg'>Cancel</Button>}
      </Stack>
    </Container>
  )
}