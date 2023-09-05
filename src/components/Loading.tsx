
export const Loading = () => {

  const spinnerStyle = {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(0, 0, 0, 0.1)',
    borderTop: '5px solid blue',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={spinnerStyle}></div>
    </div>
  )
}