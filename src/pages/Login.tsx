import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router";

const provider = new GoogleAuthProvider();

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Usuário autenticado:", user);

      navigate("/app");
    } catch (error: any) {
      console.error("Erro no login:", error.message);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login com Google</button>
    </div>
  );
}

export default Login;
