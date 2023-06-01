import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios";

export default function PageComponent({ title, buttons = '', children }) {
    const { currentUser, userToken, setCurrentUser, setUserToken } = useStateContext();
    const logout = (ev) => {
        ev.preventDefault();
        axiosClient.post('/logout').then(res => {
            setCurrentUser({});
            setUserToken(null);
        })
    };
    return (
        <>
            <header className="bg-white shadow px-5">
                <div className="flex justify-between items-center mx-auto max-w-7xl px-1 py-5 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                        {title}
                    </h1>   
                    <ArrowLeftOnRectangleIcon className='md:hidden text-purple-900 innericon h-5 w-5'
                        href='#'
                        onClick={(ev) => logout(ev)}
                    />
                    {buttons}
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            <p className="py-5"></p>
        </>
    )
}