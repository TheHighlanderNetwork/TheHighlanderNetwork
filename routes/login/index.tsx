import { Head } from "$fresh/runtime.ts";

export default function LoginPage() {
  // Handler for business (email/password) sign in
  const handleBusinessFormSubmit = (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    // Assume the username field is the email for Firebase.
    const email = formData.get("username") as string;
    const password = formData.get("password") as string;
    // Firebase email/password sign in (replace with your actual code)
    // firebase.auth().signInWithEmailAndPassword(email, password)
    //   .then((userCredential) => {
    //     console.log("Firebase Business Login success", userCredential);
    //   })
    //   .catch((error) => {
    //     console.error("Firebase Business Login error", error);
    //   });
    console.log("Business Login", { email, password });
  };

  // Handler for Google sign in
  const handleGoogleSignIn = () => {
    // Firebase Google sign in (replace with your actual code)
    // const provider = new firebase.auth.GoogleAuthProvider();
    // firebase.auth().signInWithPopup(provider)
    //   .then((result) => {
    //     console.log("Firebase Google Login success", result);
    //   })
    //   .catch((error) => {
    //     console.error("Firebase Google Login error", error);
    //   });
    console.log("Google Sign In clicked");
  };

  // Google button markup converted to JSX.
  const GoogleButton = () => (
    <button
      className="gsi-material-button block mx-auto"
      onClick={handleGoogleSignIn}
    >
      <div className="gsi-material-button-state"></div>
      <div className="gsi-material-button-content-wrapper">
        <div className="gsi-material-button-icon">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{ display: "block" }}
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>
        <span className="gsi-material-button-contents">
          Sign in with Google
        </span>
        <span style={{ display: "none" }}>Sign in with Google</span>
      </div>
    </button>
  );

  return (
    <>
      <Head>
        {/* Import Oswald font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap"
        />
        {/* Include the Google button CSS */}
        <style>{`
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
        `}</style>
        {/* Ensure Oswald is applied globally */}
        <style>{`
          .font-oswald {
            font-family: 'Oswald', sans-serif;
          }
        `}</style>
      </Head>
      <div className="font-oswald px-4 py-8 w-screen h-screen bg-grey-light flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center w-full px-8">
          <a href="/">
            <div className="flex text-2xl font-bold">
              <h1 className="text-yellow">The Highlander&nbsp;</h1>
              <h1 className="text-blue">Network</h1>
            </div>
          </a>
          <div className="flex gap-4">
            <a
              href="/login"
              className="px-4 py-2 bg-blue text-white rounded-md text-sm font-medium"
            >
              Login
            </a>
            <a
              href="/signup"
              className="px-4 py-2 bg-yellow text-white rounded-md text-sm font-medium"
            >
              Sign Up
            </a>
          </div>
        </div>
  
        {/* Main Content (stacked in a column) */}
        <div className="flex flex-col justify-center items-center gap-8 mt-8 px-8">
          {/* Student Sign In */}
          <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-6 text-center">Student Sign In</h2>
            <GoogleButton />
          </div>
  
          {/* Business Sign In */}
          <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-6 text-center">Business Sign In</h2>
            <form onSubmit={handleBusinessFormSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="px-4 py-2 border rounded-md"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="px-4 py-2 border rounded-md"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue text-white rounded-md text-sm"
              >
                Sign In with Username & Password
              </button>
            </form>
            <div className="mt-4">
              <GoogleButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
