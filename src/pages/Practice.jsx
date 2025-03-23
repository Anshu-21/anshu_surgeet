import React, {useState} from 'react'

function Practice() {

    const [loading, setLoading] = useState()

        setLoading = (loading) => {
            loading = 1++;
        } 

    
  return (
    <div  >
    <button onClick={setLoading}>
    Click
    </button>
    </div>
  )
}

export default Practice