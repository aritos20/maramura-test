export const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontSize: 16,
        fontWeight: 600,
        boxShadow: 'none',
        padding: '10px 24px',
        color: '#f8f8f8'
      },
      outlined: {
        borderColor: '#f8f8f8'
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      }
    }
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8, // Adjust the border radius as needed
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#b3b3b3', // Default border color
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#f8f8f8', // Border color on hover
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#f8f8f8', // Border color on focus
        },
      },
    },
  },
  MuiInputLabel : {
    styleOverrides: {
      root: {
        color: '#f8f8f8',
        '&.Mui-focused': {
          color: '#f8f8f8'
        }
      }
    }
  }
}