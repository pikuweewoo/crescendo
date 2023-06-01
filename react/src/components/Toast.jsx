import { useStateContext } from "../contexts/ContextProvider"

export default function Toast() {
    const { toast } = useStateContext();

    return (
        <>
            {toast.show && <div className="py-2 px-3 text-white rounded bg-emerald-500 fixed right-0 bottom-12 z-150
            animate-fade-in-down">
                {toast.message}
            </div>}
        </>
    )
}