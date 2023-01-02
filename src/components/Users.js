import { Link } from 'react-router-dom'

const UserLine = ({ user }) => {
  return (
    <tr>
      <td>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </td>
      <td>{user.blogs.length}</td>
    </tr>
  )
}

const UsersList = ({ users }) => {
  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td><strong>blogs created</strong></td>
          </tr>
          {users.map(user =>
            <UserLine key={user.id} user={user} />
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UsersList