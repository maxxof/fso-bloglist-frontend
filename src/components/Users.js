const UserLine = ({ name, blogs }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{blogs}</td>
    </tr>
  )
}

const Users = ({ users }) => {
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
            <UserLine key={user.id} name={user.name} blogs={user.blogs.length} />
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Users