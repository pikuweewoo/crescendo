export default function PaginationLinks({ meta, onPageClick }) {
    function onClick(ev, link) {
        ev.preventDefault();
        if (!link.url) {
            return;
        }
        onPageClick(link)
    }

    return (
        <>
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-md mt-4">
                <div className="flex flex-1 justify-between sm:hidden">
                    <a
                        href="#"
                        onClick={ev => onClick(ev, meta.links[0])}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-purple-700 hover:bg-gray-50"
                    >
                        Anterior
                    </a>
                    <a
                        href="#"
                        onClick={ev => onClick(ev, meta.links[meta.links.length - 1])}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-purple-700 hover:bg-gray-50"
                    >
                        Siguiente
                    </a>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">{meta.from}</span> a <span className="font-medium">{meta.to}</span> de{' '}
                            <span className="font-medium">{meta.total}</span> resultados
                        </p>
                    </div>
                    <div>
                        {meta.total > meta.per_page &&
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                                {meta.links && meta.links.map((link, ind) => (
                                    <a
                                        href="#"
                                        onClick={ev => onClick(ev, link)}
                                        key={ind}
                                        aria-current="page"
                                        className={"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-purple-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                            + (ind === 0 ? 'rounded-l-md' : '')
                                            + (ind === (meta.links.length - 1) ? 'rounded-l-md' : '')
                                            + (link.active ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-300 text-gray-500')
                                        }
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    >
                                    </a>
                                ))}
                            </nav>}
                    </div>
                </div>
            </div>
        </>
    )
}
