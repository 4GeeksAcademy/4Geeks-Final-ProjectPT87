// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { CreateRunner } from "./pages/CreateRunner";
import { EditRunner } from "./pages/EditRunner";
import { ListMentors } from "./pages/ListMentors";
import { ListRunners } from "./pages/ListRunners";
import { SingleRunner } from "./pages/SingleRunner";
import { Authentication } from "./pages/Authentication";  
import { SingleMentor } from "./pages/SingleMentor";
import { ResetPassword } from "./pages/ResetPassword";
import Message from "./pages/Message";
// import { ProfileCard } from "./components/ProfileCard";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />{" "}
      {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />
      
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path = "/create_runner" element={<CreateRunner />} />
      <Route path = "/edit_runner/:theId" element={<EditRunner />} />
      <Route path = "/list_runners" element={<ListRunners />} />
      <Route path = "/list_mentors" element={<ListMentors />} />
      <Route path = "/single_runner/:theId/:pictureNumber" element={<SingleRunner />} />
      <Route path = "/single_mentor/:theId/:pictureNumber" element={<SingleMentor />} />
      <Route path = "/account" element={<Authentication />} />
      <Route path = "/messages/:otherUserId" element={<Message />} />
      {/* <Route path="/profile" element={<ProfileCard />} /> */}
    </Route>,
  ),
);
