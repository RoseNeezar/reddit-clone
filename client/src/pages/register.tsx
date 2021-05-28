import Head from "next/head";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { errorHelper } from "../utils/error-serial";
import InputGroup from "../components/InputGroup";
import { useRouter } from "next/router";
import { useAuthState } from "../context/auth";

const Register = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: "",
    username: "",
    password: "",
  });
  const { email, username, password } = formState;
  const { authenticated } = useAuthState();

  if (authenticated) router.push("/");
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const onChangeText =
    (name: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState({ ...formState, [name]: e.target.value });
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreement) {
      setErrors({ ...errors, agreement: "You must agree to T&Cs" });
      return;
    }
    try {
      await axios.post("/auth/register", {
        email,
        username,
        password,
      });
      router.push("/login");
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
        <link rel="stylesheet" href="/favicon.ico" />
      </Head>
      <div
        className="w-40 h-screen bg-center bg-cover"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      />
      <div className="flex flex-col justify-center pl-6 ">
        <div className=" w-70">
          <h1 className="mb-2 text-lg">Sign Up</h1>
          <p className="mb-4 text-xs">
            By signin in you comply to the rules and the Privacy Concern
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to everything here
              </label>
              <small className="block font-medium text-red-600">
                {errors.agreement}
              </small>
            </div>
            <InputGroup
              className="mb-2"
              type="email"
              value={email}
              setValue={onChangeText}
              error={errorHelper(errors.message, "email")}
              placeholder="Email"
            />
            <InputGroup
              className="mb-2"
              type="username"
              value={username}
              setValue={onChangeText}
              error={errorHelper(errors.message, "Username")}
              placeholder="Username"
            />
            <InputGroup
              className="mb-2"
              type="password"
              value={password}
              setValue={onChangeText}
              error={errorHelper(errors.message, "Password")}
              placeholder="Password"
            />
            <button className="w-full py-2 mt-2 mb-2 text-xs font-bold text-white bg-blue-500 border-blue-500 rounded focus:outline-none focus:border-blue-500">
              Sign Up
            </button>
          </form>
          <small>
            Already have an account ?
            <Link href="/login">
              <a className="ml-1 text-blue-500 ">Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
