"use client";

import { handleLogin } from "@/libs/actions";
import apiService from "@/libs/apiService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";



enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const LoginPage = () => {
  const router = useRouter();

  const isLoggedIn = false ;

  if (isLoggedIn) {
    router.push("/");
  }

  const [mode, setMode] = useState(MODE.LOGIN);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const formTitle =
    mode === MODE.LOGIN
      ? "Log in"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      && "Reset Your Password"
      

  const buttonTitle =
    mode === MODE.LOGIN
      ? "Login"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      && "Reset";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      switch (mode) {
        case MODE.LOGIN:
          const loginFormData = {
                name: fullname,
                email: email,
                password: password1,
            }
          
          const loginResponse = await apiService.postWithoutToken('/login/', JSON.stringify(loginFormData));

          if (loginResponse.data.access) {
          
            toast.success("Login successfull. You will be redirected")
            handleLogin(loginResponse.data.access, loginResponse.data.refresh);	
          
          } else {
            const tmpError: string[] = Object.values(loginResponse.data).flat().map((error: any) => { return error; })           
            toast.error(tmpError)
          }
          break;

        case MODE.REGISTER:

          const signupFormData = {
                name: fullname,
                email: email,
                password1: password1,
                password2: password2
            }
          
          const signupResponse = await apiService.postWithoutToken('/signup/', JSON.stringify(signupFormData));

          if (signupResponse.status === 201) {
            toast.success("You have been registered. Please check your email to activate your account.")
            setMode(MODE.LOGIN);                    
          } else if (signupResponse.status === 400) {
            const tmpError: string[] = Object.values(signupResponse.data).flat().map((error: any) => { return error; })           
            toast.error(tmpError)
          }
          break;

        case MODE.RESET_PASSWORD:
          
          setMessage("Password reset email sent. Please check your e-mail.");
          break;

        default:
          break;
      }

    } catch (err) {
      console.log(err);
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold">{formTitle}</h1>
        
        {/* Username */}
        {mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Fullname</label>
            <input
              type="text"
              name="fullname"
              placeholder="john"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
        ) : null}


        {mode !== MODE.EMAIL_VERIFICATION ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="john@gmail.com"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Verification Code</label>
            <input
              type="text"
              name="emailCode"
              placeholder="Code"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setEmailCode(e.target.value)}
            />
          </div>
        )}
        {/* Password 1 */}
        {mode === MODE.LOGIN || mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password1"
              placeholder="Enter your password"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setPassword1(e.target.value)}
              required
            />
          </div>
        ) : null}

        {/* Password 2 */}
        {mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Repeat Password</label>
            <input
              type="password"
              name="password2"
              placeholder="Repeat your password"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>
        ) : null}

        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.RESET_PASSWORD)}
          >
            Forgot Password?
          </div>
        )}
        <button
          className="bg-red-500 text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : buttonTitle}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.REGISTER)}
          >
            {"Don't"} have an account?
          </div>
        )}
        {mode === MODE.REGISTER && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.LOGIN)}
          >
            Have and account?
          </div>
        )}
        {mode === MODE.RESET_PASSWORD && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.LOGIN)}
          >
            Go back to Login
          </div>
        )}
        {message && <div className="text-green-600 text-sm">{message}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
