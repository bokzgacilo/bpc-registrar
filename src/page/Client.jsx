import { Container, Flex, Stack, Heading, Button, Image, useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text, Input, FormControl, FormLabel, Select, ModalFooter, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepSeparator, Box, StepTitle, useSteps, AlertDialog, Center, Spinner, AlertDialogOverlay, AlertDialogBody, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, useToast, TableContainer, Table, Thead, Tbody, Th, Tr, Td } from "@chakra-ui/react";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = ['Student Information', 'Contact and Address', 'Review'];

export default function Client({onLogout}) {
  const [session, setSession] = useState(null);
  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
  const toast = useToast()
  const [formData, setFormData] = useState({});
  const [SelectedDocument, SetSelectedDocument] = useState("")
  const [CurrentEmail, SetCurrentEmail] = useState("")
  const [CurrentUserID, SetCurrentUserID] = useState("")
  const [Loading, SetLoading] = useState(false)
  const [SelectedProgram, SetSelectedProgram] = useState("");

  const [isGraduate, SetIsGraduate] = useState(true)
  const [step, SetStep] = useState(0);
  const navigate = useNavigate()

  const [MyRequest, SetMyRequest] = useState([])

  const handleProgramChange = (event) => {
    SetSelectedProgram(event.target.value);
    console.log(event.target.value)
    
    formData.Program = event.target.value
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleNext = () => {
    SetStep(step + 1);
  };

  const handlePrevious = () => {
    SetStep(step - 1);
  };

  const handleSubmit = async () => {
    onOpen2()

    const { error } = await supabase
    .from('request')
    .insert([
      {
        user_id : CurrentUserID,
        document_type: SelectedDocument,
        program: formData.Program,
        last_name: formData.LastName,
        first_name: formData.FirstName,
        middle_name: formData.MiddleName,
        year_graduated: formData.YearGraduated,
        purpose: formData.Purpose,
        contact_number: formData.ContactNumber,
        alternate_email: formData.AlternateEmail,
        facebook: formData.Facebook,
        street: formData.Street,
        barangay: formData.Barangay,
        city: formData.City,
        region: formData.Region
      }
    ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully');

      await fetch('http://localhost/registrar/send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'email': CurrentEmail,
          'document_type' : SelectedDocument
        }),
      });
      onClose2()
      onClose()
      setFormData({})

      toast({
        title: 'Request Successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const getCurrentUserEmail = async () => {
    const user = await supabase.auth.getUser();
  
    if (user) {
      SetCurrentEmail(user.data.user.email)
      SetCurrentUserID(user.data.user.id)  
    } else {
      throw new Error('User is not authenticated');
    }
  };
  

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data?.session) {
        setSession(data.session); // Set session if user is signed in
      } else {
        navigate('/login');
      }
    };


    const getMyRequest = async () => {
      SetLoading(true)

      let {data} = await supabase.from('request').select('*').eq('user_id' , CurrentUserID)

      if(data) {
        SetMyRequest(data)

        supabase
        .channel('public:request')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'request' }, (payload) => {
          console.log('Change received!', payload);
          getMyRequest()
        })
        .subscribe();
      }

      SetLoading(false)
    }

    checkSession();
    getCurrentUserEmail()
    getMyRequest()
  }, [])

  const RequestDocument = (document_number) => {
    onOpen()

    let document_type;

    switch(document_number){
      case 1 :
        document_type = 'Transcript of Records'
        break;
      case 2 :
        document_type = 'Good Moral'
        break;
      case 3 :
        document_type = 'Diploma'
        break;
    }

    SetSelectedDocument(document_type)
  }

  return(
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size='md'>Requesting: {SelectedDocument}</Heading>
          </ModalHeader>
          <ModalBody>
            {step === 0 &&
            <Stack spacing={2}>
              <FormControl isRequired>
                <FormLabel>Program</FormLabel>
                <Select
                  onChange={handleProgramChange}
                  name="Program"
                >
                  <option value="">Select Program</option>
                  <option value="Associate in Computer Technology">Associate in Computer Technology</option>
                  <option value="Bachelor of Science in Information Systems">Bachelor of Science in Information Systems</option>
                  <option value="Bachelor of Science in Office Management">Bachelor of Science in Office Management</option>
                  <option value="Bachelor of Science in Customs Administration">Bachelor of Science in Customs Administration</option>
                  <option value="Bachelor of Technical-Vocational Teacher Education">Bachelor of Technical-Vocational Teacher Education</option>
                  <option value="Bachelor of Science in Accounting Information System">Bachelor of Science in Accounting Information System</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input name="LastName" value={formData.LastName || ''} onChange={handleChange} size='sm' type='text' />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input name="FirstName" value={formData.FirstName || ''} onChange={handleChange} size='sm' type='text' />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Middle Name</FormLabel>
                <Input name="MiddleName" value={formData.MiddleName || ''} onChange={handleChange} size='sm' type='text' />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Graduate</FormLabel>
                <Select name="isGraduated" onChange={e => SetIsGraduate(e.currentTarget.value === 'true')}>
                  <option value='true'>Yes</option>
                  <option value='false'>No</option>
                </Select>
              </FormControl>
              {isGraduate ? 
              <FormControl isRequired>
                <FormLabel>Year Graduated</FormLabel>
                <Input name="YearGraduated" value={formData.YearGraduated || ''} onChange={handleChange} size='sm' type='text' />
              </FormControl> :
              <FormControl isRequired>
              <FormLabel>Last Year Attended</FormLabel>
                <Input name="YearGraduated" value={formData.YearGraduated || ''} onChange={handleChange} size='sm' type='text' />
              </FormControl>
              }
              <FormControl isRequired>
                <FormLabel>Purpose of Request</FormLabel>
                <Input name="Purpose" value={formData.Purpose || ''} onChange={handleChange} size='sm' type='text' />
              </FormControl>
            </Stack>
            }
            {step === 1 && (
              <Stack spacing={4}>
              <FormControl id="contactNumber">
                <FormLabel>Contact Number</FormLabel>
                <Input
                  size='sm'
                  value={formData.ContactNumber || ''} onChange={handleChange}
                  name="ContactNumber"
                  placeholder="Enter your contact number"
                />
              </FormControl>
              <FormControl id="alternateEmail">
                <FormLabel>Alternate Email</FormLabel>
                <Input
                  size='sm'
                  value={formData.AlternateEmail || ''} onChange={handleChange}
                  name="AlternateEmail"
                  placeholder="Enter your alternate email"
                />
              </FormControl>
              <FormControl id="facebook">
                <FormLabel>Facebook Account URL</FormLabel>
                <Input
                  name="Facebook"
                  size='sm'
                  value={formData.Facebook || ''} onChange={handleChange}
                  placeholder="Enter your Facebook account URL"
                />
              </FormControl>
              <FormControl id="street">
                <FormLabel>Street</FormLabel>
                <Input
                  name="Street"
                  size='sm'
                  value={formData.Street || ''} onChange={handleChange}
                  placeholder="Enter your street"
                />
              </FormControl>
              <FormControl id="barangay">
                <FormLabel>Barangay</FormLabel>
                <Input
                  size='sm'
                  value={formData.Barangay || ''} onChange={handleChange}
                  name="Barangay"
                  placeholder="Enter your barangay"
                />
              </FormControl>
              <FormControl id="city">
                <FormLabel>City</FormLabel>
                <Input
                  size='sm'
                  value={formData.City || ''} onChange={handleChange}
                  name="City"
                  placeholder="Enter your city"
                />
              </FormControl>
              <FormControl id="region">
                <FormLabel>Region</FormLabel>
                <Input
                  size='sm'
                  value={formData.Region || ''} onChange={handleChange}
                  name="Region"
                  placeholder="Enter your region"
                />
              </FormControl>
            </Stack>
            )
            }

          {step === 2 && (
            <Stack spacing={2}>
              <Heading size='md'>Review your information:</Heading>
              <Text><strong>Program:</strong> {formData.Program}</Text>
              <Text><strong>Last Name:</strong> {formData.LastName}</Text>
              <Text><strong>First Name:</strong> {formData.FirstName}</Text>
              <Text><strong>Middle Name:</strong> {formData.MiddleName}</Text>
              <Text><strong>Last Year Graduated or Graduated Year:</strong> {formData.YearGraduated}</Text>
              <Text><strong>Purpose of Request:</strong> {formData.Purpose}</Text>
              <Text><strong>Contact Number:</strong> {formData.ContactNumber}</Text>
              <Text><strong>Alternate Email:</strong> {formData.AlternateEmail}</Text>
              <Text><strong>Facebook Account URL:</strong> {formData.Facebook}</Text>
              <Text><strong>Street:</strong> {formData.Street}</Text>
              <Text><strong>Barangay:</strong> {formData.Barangay}</Text>
              <Text><strong>City:</strong> {formData.City}</Text>
              <Text><strong>Region:</strong> {formData.Region}</Text>
            </Stack>
          )}
            
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={handlePrevious}
              isDisabled={step === 0}
            >
              Previous
            </Button>
            {step < steps.length - 1 ? (
              <Button colorScheme="blue" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button colorScheme="green" onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isOpen2} onClose={onClose2}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Submitting Requestion
          </AlertDialogHeader>
          <AlertDialogBody>
            <Stack spacing={4} alignItems='center'>
              <Spinner 
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
              />
              <Text textAlign='center'>Please do not close the tab or window while submitting request. Thank you</Text>
            </Stack>
          </AlertDialogBody>
          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Container p={0} maxW='500px'>
        <Stack spacing={4}>
          <Flex p={4} backgroundColor='rgb(7, 131, 7)' alignItems='center' justifyContent='space-between'>
            <Flex flexDirection='row' gap={3} alignItems='center'>
              <Image width='40px' src='/assets/bpc-logo.png' />
              <Heading color='#fff' size='md'>BPC E-Registrar</Heading>
            </Flex>
            <Button size='sm' onClick={onLogout}>Log out</Button>
          </Flex>
          <Stack p={4} spacing={4}>
            <Heading size='lg'>My Request</Heading>
            <TableContainer>
              <Table size='sm'>
                <Thead>
                  <Tr>
                    <Th>Request ID</Th>
                    <Th>Document Type</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                {MyRequest.map((item) => (
                  <Tr key={item.id}>
                    <Td><Button onClick={() => navigate(`/view-request/${item.id}`)} variant='link' size='sm'>{item.id}</Button></Td>
                    <Td>{item.document_type}</Td>
                    <Td>{item.status}</Td>
                  </Tr>
                ))}
                </Tbody>
              </Table>
            </TableContainer>
            {Loading && <Center><Spinner /></Center>}

          </Stack>
          <Stack p={4} spacing={4}>
            <Heading size='lg'>Request Document</Heading>
            <Button size='lg' onClick={() => RequestDocument(1)}>Transcript of Records</Button>
            <Button size='lg' onClick={() => RequestDocument(2)}>Good Moral</Button>
            <Button size='lg' onClick={() => RequestDocument(3)}>Diploma</Button>
          </Stack>
        </Stack>
      </Container>
    </>
  )
}