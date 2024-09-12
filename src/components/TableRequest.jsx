import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, Stack, Heading, Flex, Input, HStack, Select} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function TableRequest() {
  const [Documents, SetDocuments] = useState([]);
  const [DocumentType, SetDocumentType] = useState("")
  const navigate = useNavigate()

  const handleFilterDocumentType = async (e) => {
    SetDocumentType(e.target.value)

    let {data} = await supabase.from('request').select('*').eq("document_type", e.target.value).eq('status', 'Pending');

    SetDocuments(data)
  }

  useEffect(() => {
    const fetchData = async () => {
      let {data} = await supabase.from('request').select('*').eq('status', 'Pending');

      SetDocuments(data)
    }

    fetchData()
  }, [])

  const handleViewRequest = (id) => {
    navigate(`/registrar/view-request/${id}`)
  }

  return(
    <Stack spacing={4}>
      <Heading size='md'>Requests</Heading>
      <HStack spacing={0} justifyContent='space-between'>
        <Flex flexDirection='row' alignItems='center' gap={4}>
          <Heading size='sm'>Filter</Heading>
          <Select
            size='sm'
            value={DocumentType}
            onChange={handleFilterDocumentType}
          >
            <option value="Transcript of Records">Transcript of Records</option>
            <option value="Diploma">Diploma</option>
            <option value="Good Moral">Good Moral</option>
          </Select>
        </Flex>
        <Flex flexDirection='row' alignItems='center' gap={2}>
          <Heading size='sm'>Search</Heading>
          <Input size='sm' placeholder='Search name, id, document' />
          <Button size='sm'>Go</Button>
        </Flex>
      </HStack>
      <TableContainer>
        <Table variant='simple' size='sm'>
          <Thead>
            <Tr>
              <Th>Request ID</Th>
              <Th>Program</Th>
              <Th>Last Name</Th>
              <Th>First Name</Th>
              <Th>Middle Name</Th>
              <Th>Year Graduated</Th>
              <Th>Purpose</Th>
              <Th>Contact Number</Th>
              <Th>Alternate Email</Th>
              <Th>Facebook</Th>
              <Th>Street</Th>
              <Th>Barangay</Th>
              <Th>City</Th>
              <Th>Region</Th>
              <Th>Date Requested</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
          {Documents.map((item) => (
            <Tr key={item.id}>
              <Td><Button variant='link' size='sm' onClick={() => handleViewRequest(item.id)}>{item.id}</Button></Td>
              <Td>{item.program}</Td>
              <Td>{item.last_name}</Td>
              <Td>{item.first_name}</Td>
              <Td>{item.middle_name}</Td>
              <Td>{item.year_graduated}</Td>
              <Td>{item.purpose}</Td>
              <Td>{item.contact_number}</Td>
              <Td>{item.alternate_email}</Td>
              <Td>{item.facebook}</Td>
              <Td>{item.street}</Td>
              <Td>{item.barangay}</Td>
              <Td>{item.city}</Td>
              <Td>{item.region}</Td>
              <Td>{new Date(item.date_requested).toLocaleString()}</Td>
              <Td>{item.status}</Td>
            </Tr>
          ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  )
}