import { Table, ActionIcon, TextInput } from '@mantine/core'
import { IconTrash, IconSearch } from '@tabler/icons-react'

function UserTable({ users, userUsernameSearch, handleInputChange, handleDeleteUser, handleSearchUser }) {
  let userRows
  if (users.length === 0) {
    userRows = (
      <Table.Tr key='no-user'>
        <Table.Td colSpan={6} style={{ textAlign: 'center' }}>No user</Table.Td>
      </Table.Tr>
    )
  } else {
    userRows = users.map(user => (
      <Table.Tr key={user.id}>
        <Table.Td>
          <ActionIcon
            color='red'
            variant='filled'
            radius='xl'
            size='sm'
            disabled={user.username === 'admin'}
            onClick={() => handleDeleteUser(user.username)}
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Table.Td>
        <Table.Td>{user.id}</Table.Td>
        <Table.Td>{user.username}</Table.Td>
        <Table.Td>{user.name}</Table.Td>
        <Table.Td>{user.email}</Table.Td>
        <Table.Td>{user.role}</Table.Td>
      </Table.Tr>
    ))
  }

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); handleSearchUser() }}>
        <TextInput
          mb='md'
          name='userUsernameSearch'
          placeholder='Search by Username'
          value={userUsernameSearch}
          onChange={handleInputChange}
          rightSection={
            <ActionIcon type='submit' variant='subtle'>
              <IconSearch size={16} />
            </ActionIcon>
          }
        />
      </form>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40} />
            <Table.Th>ID</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{userRows}</Table.Tbody>
      </Table>
    </>
  )
}

export default UserTable
