"use client";
import { Head } from "$fresh/runtime.ts";
import GoogleSignIn from "../../islands/GoogleSignIn.tsx";
import BusinessSignInForm from "../../islands/BusinessSignInForm.tsx";
import UsernameHeader from "../../islands/UsernameHeader.tsx";

export default function LoginPage() {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap"
        />
        <style>
          {`
          .gsi-material-button {
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            -webkit-appearance: none;
            background-color: WHITE;
            background-image: none;
            border: 1px solid #747775;
            -webkit-border-radius: 20px;
            border-radius: 20px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: #1f1f1f;
            cursor: pointer;
            font-family: 'Roboto', arial, sans-serif;
            font-size: 14px;
            height: 40px;
            letter-spacing: 0.25px;
            outline: none;
            overflow: hidden;
            padding: 0 12px;
            position: relative;
            text-align: center;
            -webkit-transition: background-color .218s, border-color .218s, box-shadow .218s;
            transition: background-color .218s, border-color .218s, box-shadow .218s;
            vertical-align: middle;
            white-space: nowrap;
            width: auto;
            max-width: 400px;
            min-width: min-content;
          }
          .gsi-material-button .gsi-material-button-icon {
            height: 20px;
            margin-right: 12px;
            min-width: 20px;
            width: 20px;
          }
          .gsi-material-button .gsi-material-button-content-wrapper {
            -webkit-align-items: center;
            align-items: center;
            display: flex;
            -webkit-flex-direction: row;
            flex-direction: row;
            -webkit-flex-wrap: nowrap;
            flex-wrap: nowrap;
            height: 100%;
            justify-content: space-between;
            position: relative;
            width: 100%;
          }
          .gsi-material-button .gsi-material-button-contents {
            -webkit-flex-grow: 1;
            flex-grow: 1;
            font-family: 'Roboto', arial, sans-serif;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: top;
          }
          .gsi-material-button .gsi-material-button-state {
            -webkit-transition: opacity .218s;
            transition: opacity .218s;
            bottom: 0;
            left: 0;
            opacity: 0;
            position: absolute;
            right: 0;
            top: 0;
          }
          .gsi-material-button:disabled {
            cursor: default;
            background-color: #ffffff61;
            border-color: #1f1f1f1f;
          }
          .gsi-material-button:disabled .gsi-material-button-contents {
            opacity: 38%;
          }
          .gsi-material-button:disabled .gsi-material-button-icon {
            opacity: 38%;
          }
          .gsi-material-button:not(:disabled):active .gsi-material-button-state, 
          .gsi-material-button:not(:disabled):focus .gsi-material-button-state {
            background-color: #303030;
            opacity: 12%;
          }
          .gsi-material-button:not(:disabled):hover {
            -webkit-box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
            box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
          }
          .gsi-material-button:not(:disabled):hover .gsi-material-button-state {
            background-color: #303030;
            opacity: 8%;
          }
          `}
        </style>
        <style>
          {`
          .font-oswald {
            font-family: 'Oswald', sans-serif;
          }
          `}
        </style>
      </Head>

      <div className="font-oswald px-4 py-8 w-screen h-screen bg-grey-light flex flex-col">
        <div className="flex justify-between items-center w-full px-8">
          <a href="/">
            <div className="flex text-2xl font-bold">
              <h1 className="text-yellow">The Highlander&nbsp;</h1>
              <h1 className="text-blue">Network</h1>
            </div>
          </a>
          <UsernameHeader />
        </div>

        <div className="flex flex-col justify-center items-center gap-8 mt-8 px-8">
          <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-6 text-center">
              Student Sign In
            </h2>
            <GoogleSignIn />
          </div>

          <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-6 text-center">
              Business Sign In
            </h2>
            <BusinessSignInForm />
            <div className="mt-4">
              <GoogleSignIn />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
