const Notification = ({ message, color }) => {
  if (message === null) {
    return null
  } else if (color === 'green') {
    return (
      <div className="green">
        {message}
      </div>
    )
  } else if (color === 'red') {
    return (
      <div className="red">
        {message}
      </div>
    )
  }
}

export default Notification