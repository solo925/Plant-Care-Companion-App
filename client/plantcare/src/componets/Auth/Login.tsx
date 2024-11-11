import { useContext, useState } from "react"
import { PlantCareContext } from "../../context"


function Login() {
    const context = useContext(PlantCareContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
   
    if(!context) throw new Error ("Context must be used inside a provider")
    
    const { loading, setLoading,user,setUser } = context
    
    

    const handleLogin = async (e:React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault()
        try {
            
        } catch (error) {
            console.log(error)
            
        } finally {
            setLoading(false)
        }

        if (loading) return <h3>please wait loading login form</h3> 
        setLoading(true)
        const response = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
     
            })
            
        });

        const data = await response.json()
        if (response.ok) { setUser(data.user) } 
        console.log(data.message)
        window.location.href = 'http://localhost:5173/home';     
    }

  return (
      <div>
          <h2>login</h2>
          <form onSubmit={handleLogin}>
              <div className="loginform">
              <input type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
              />
              <input type="password"
                  placeholder="Password"
                  value={password}
                  onChange = {(e)=>setPassword(e.target.value)}
                  />
              </div>
              <div className="login-button">
                  <button type="submit">login</button>
              </div>
          </form>

          

    </div>
  )
}

export default Login