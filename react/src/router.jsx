import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard.jsx";
import Lessons from "./views/Lessons.jsx";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import Users from "./views/Users.jsx";
import Tuner from "./views/Tuner.jsx";
import SheetAnalyser from "./views/SheetAnalyser.jsx";
import UserView from "./views/UserView.jsx";
import Students from "./views/Students.jsx";
import StudentView from "./views/StudentView.jsx";
import Archive from "./views/Archive.jsx";
import ArchiveView from "./views/ArchiveView.jsx";
import VideoPlayer from "./views/VideoPlayer.jsx";
import LessonPlayer from "./views/LessonPlayer.jsx";
import OCRView from "./views/OCRView.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: '/dashboard',
                element: <Navigate to="/" />
            },
            {
                path: '/',
                element: <Dashboard />
            },
            {
                path: '/users',
                element: <Users />
            },
            {
                path: '/users/create',
                element: <UserView />
            },
            {
                path: '/users/:id',
                element: <UserView />
            },
            {
                path: '/tuner',
                element: <Tuner />
            },
            {
                path: '/lessons',
                element: <Lessons />
            },
            {
                path: '/lessons/create',
                element: <SheetAnalyser />
            },
            {
                path: '/lessons/:id',
                element: <SheetAnalyser />
            },
            {
                path: '/lessons/play/:id',
                element: <LessonPlayer />
            },
            {
                path: '/students',
                element: <Students />
            },
            {
                path: '/student/:id',
                element: <StudentView />
            },
            {
                path: '/archive',
                element: <Archive />
            },
            {
                path: '/archive/create',
                element: <ArchiveView />
            },
            {
                path: '/archive/:id',
                element: <ArchiveView />
            },
            {
                path: '/archive/play/:id',
                element: <VideoPlayer />
            },
            {
                path: '/partituras',
                element: <OCRView />
            },
        ]
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />
            },
        ]
    }
])

export default router;