import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import { useNavigate, useParams } from "react-router-dom";
import TButton from "../components/core/TButton";
import axiosClient from "../axios";
import { useStateContext } from "../contexts/ContextProvider";
import StudentLessonList from "../components/StudentLessonList";

export default function StudentView() {
  const { currentUser } = useStateContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState({ __html: '' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useStateContext();
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [sheets, setSheets] = useState([]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setError({ __html: '' })
    const payload = { sheets };
    let res = null;
    res = axiosClient.put(`/lesson/${id}`, payload);
    res.then((res) => {
      navigate('/students');
      showToast("Las lecciones del estudiante fueron exitosamente actualizadas.")
    })
      .catch((err) => {
        if (err.response) {
          const finalErrors = Object.values(err.response.data.errors).reduce((accum, next) => [...next, ...accum], [])
          setError({ __html: finalErrors.join('<br>') })
        }
        console.log(err, err.response);
      });
  }

  const getSheets = () => {
    axiosClient.get(`/lesson/${id}`).then(({ data }) => {
      setSheets(data);
    });
  }

  const getUser = () => {
    axiosClient.get(`/user/${id}`)
      .then(({ data }) => {
        setUser(data.data)
      })
  }

  function onCheckboxUpdate(sheet) {
    sheets.forEach(e => {
      if (e.id == sheet.id) {
        e.status = sheet.status
      }
    });
  }

  useEffect(() => {
    if (id) {
      setLoading(true)
      getUser();
      getSheets();
      setLoading(false);
    }
  }, [])

  return (
    <PageComponent
      title={"Alumno: " + user.name}>
      {loading && <div className="text-center text-lg">Cargando...</div>}
      {!loading && <form action="#" method="POST" onSubmit={onSubmit}>
        <div className="shadow sm:overflow-hidden sm:rounded-md">
          <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
            {error.__html && (
              <div className="bg-red-500 text-white py-3 px-3 rounded-lg"
                dangerouslySetInnerHTML={error}>
              </div>
            )}
            <div>
              <label htmlFor="full-name" className="block text-md font-medium leading-6 text-gray-900">
                <b>Nombre completo:</b> {user.name}
              </label>
            </div>
            <div>
              <label htmlFor="email-address" className="block text-md font-medium leading-6 text-gray-900">
                <b>Correo electronico:</b> {user.email}
              </label>
            </div>
            <div>
              <label htmlFor="lessons" className="block text-md font-medium leading-6 text-gray-900">
                <b>Lecciones</b>
              </label>
              <div>
                {sheets.map((sheet, idx) => (
                  <StudentLessonList
                    key={idx}
                    lesson={sheet}
                    onCheckboxUpdate={onCheckboxUpdate} />
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <TButton>
              Guardar
            </TButton>
          </div>
        </div>
      </form>}
    </PageComponent>
  )
}