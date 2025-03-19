// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_customClaims_getUserClaims from "./routes/api/customClaims/getUserClaims.ts";
import * as $api_customClaims_setUserClaims from "./routes/api/customClaims/setUserClaims.ts";
import * as $api_firebaseAdmin from "./routes/api/firebaseAdmin.ts";
import * as $api_joke from "./routes/api/joke.ts";
import * as $api_login_verifyIdToken from "./routes/api/login/verifyIdToken.ts";
import * as $api_search_search from "./routes/api/search/search.ts";
import * as $courses_course_id_index from "./routes/courses/[course_id]/index.tsx";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $login_index from "./routes/login/index.tsx";
import * as $requestprofessor_index from "./routes/requestprofessor/index.tsx";
import * as $reviewprofessors_index from "./routes/reviewprofessors/index.tsx";
import * as $signup_index from "./routes/signup/index.tsx";
import * as $test_index from "./routes/test/index.tsx";
import * as $AddProfessorReview from "./islands/AddProfessorReview.tsx";
import * as $AddReviewButton from "./islands/AddReviewButton.tsx";
import * as $BusinessSignInForm from "./islands/BusinessSignInForm.tsx";
import * as $BusinessSignUpForm from "./islands/BusinessSignUpForm.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $CourseInfo from "./islands/CourseInfo.tsx";
import * as $FirestoreQuery from "./islands/FirestoreQuery.tsx";
import * as $GoogleSignIn from "./islands/GoogleSignIn.tsx";
import * as $GoogleSignUp from "./islands/GoogleSignUp.tsx";
import * as $HeaderSignUpButton from "./islands/HeaderSignUpButton.tsx";
import * as $ProfessorRequestForm from "./islands/ProfessorRequestForm.tsx";
import * as $ProfessorReviews from "./islands/ProfessorReviews.tsx";
import * as $Review from "./islands/Review.tsx";
import * as $Reviews from "./islands/Reviews.tsx";
import * as $UsernameHeader from "./islands/UsernameHeader.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/customClaims/getUserClaims.ts":
      $api_customClaims_getUserClaims,
    "./routes/api/customClaims/setUserClaims.ts":
      $api_customClaims_setUserClaims,
    "./routes/api/firebaseAdmin.ts": $api_firebaseAdmin,
    "./routes/api/joke.ts": $api_joke,
    "./routes/api/login/verifyIdToken.ts": $api_login_verifyIdToken,
    "./routes/api/search/search.ts": $api_search_search,
    "./routes/courses/[course_id]/index.tsx": $courses_course_id_index,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
    "./routes/login/index.tsx": $login_index,
    "./routes/requestprofessor/index.tsx": $requestprofessor_index,
    "./routes/reviewprofessors/index.tsx": $reviewprofessors_index,
    "./routes/signup/index.tsx": $signup_index,
    "./routes/test/index.tsx": $test_index,
  },
  islands: {
    "./islands/AddProfessorReview.tsx": $AddProfessorReview,
    "./islands/AddReviewButton.tsx": $AddReviewButton,
    "./islands/BusinessSignInForm.tsx": $BusinessSignInForm,
    "./islands/BusinessSignUpForm.tsx": $BusinessSignUpForm,
    "./islands/Counter.tsx": $Counter,
    "./islands/CourseInfo.tsx": $CourseInfo,
    "./islands/FirestoreQuery.tsx": $FirestoreQuery,
    "./islands/GoogleSignIn.tsx": $GoogleSignIn,
    "./islands/GoogleSignUp.tsx": $GoogleSignUp,
    "./islands/HeaderSignUpButton.tsx": $HeaderSignUpButton,
    "./islands/ProfessorRequestForm.tsx": $ProfessorRequestForm,
    "./islands/ProfessorReviews.tsx": $ProfessorReviews,
    "./islands/Review.tsx": $Review,
    "./islands/Reviews.tsx": $Reviews,
    "./islands/UsernameHeader.tsx": $UsernameHeader,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
