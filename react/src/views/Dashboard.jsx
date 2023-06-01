import { useState, useEffect } from "react";
import PageComponent from "../components/PageComponent";
import { useStateContext } from "../contexts/ContextProvider";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const { currentUser } = useStateContext();

    useEffect(() => {
        setLoading(true);
        setLoading(false);
    }, []);

    return (
        <PageComponent title={"Crescendo " + (currentUser.user_role_id == 1 ? 'Docente' : 'Alumno')}>
            {loading && <div className="flex justify-center">Cargando...</div>}
            {!loading &&
                <div>
                    <div className="flex text-center justify-center px-2 py-10">
                        <h2 className="text-2xl md:text-3xl">
                            Bienvenido/a a Crescendo, <br></br><b className="text-purple-700">{' '}{currentUser.name}</b>
                        </h2>
                    </div>
                    <div className="flex justify-center px-2 ">

                    </div>
                    <div className="flex justify-center py-10 px-2" >
                        <img type="image/svg+xml" src="/src/assets/images/logobig.png" style={{
                            minWidth: '45%',
                            maxWidth: '45%',
                            heigth: '40%',
                        }} />
                    </div>
                    {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700" style={{
                        display: 'none'
                    }}>
                        <DashboardCard
                            title="Total Lessons"
                            className="order-1 lg:order-2"
                            style={{ animationDelay: '0.1s' }}>
                            <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                                {data.totalSurveys}
                            </div>
                        </DashboardCard>

                        <DashboardCard
                            title="Total Students"
                            className="order-2 lg:order-4"
                            style={{ animationDelay: '0.2s' }}>
                            <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                                {data.totalAnswers}
                            </div>
                        </DashboardCard>

                        <DashboardCard
                            title="Latest Lesson"
                            className="order-3 lg:order-1 row-span-2"
                            style={{ animationDelay: '0.2s' }}>
                            {data.latestSurvey &&
                                <div>
                                    <img
                                        src={data.latestSurvey.image_url}
                                        className="w-[240px] mx-auto" />
                                    <h3 className="font-bold text-xl mb-3">
                                        {data.latestSurvey.title}
                                    </h3>
                                    <div className="flex justify-between text-sm mb-1">
                                        <div>Create Date:</div>
                                        <div>{data.latestSurvey.created_at}</div>
                                    </div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <div>Expire Date:</div>
                                        <div>{data.latestSurvey.expire_date}</div>
                                    </div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <div>Status:</div>
                                        <div>{data.latestSurvey.status ? "Active" : "Draft"}</div>
                                    </div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <div>Questions:</div>
                                        <div>{data.latestSurvey.questions}</div>
                                    </div>
                                    <div className="flex justify-between text-sm mb-3">
                                        <div>Answers:</div>
                                        <div>{data.latestSurvey.answers}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <TButton to={`/surveys/${data.latestSurvey.id}`} link>
                                            <PencilIcon className="w-5 h-5 mr-2" />
                                            Edit Survey
                                        </TButton>

                                        <TButton link>
                                            <EyeIcon className="w-5 h-5 mr-2" />
                                            View Answers
                                        </TButton>
                                    </div>
                                </div>
                            }
                            {!data.latestSurvey &&
                                <div className="text-gray-600 text-center py-16">
                                    You don't have any surveys yet.
                                </div>
                            }
                        </DashboardCard>

                        <DashboardCard
                            title="Latest Students"
                            className="order-4 lg:order-3 row-span-2"
                            style={{ animationDelay: '0.3s' }}>
                            {data.latestAnswers.length > 0 &&
                                <div className="text-left">
                                    {data.latestAnswers.map((answer) => (
                                        <a
                                            href="#"
                                            key={answer.id}
                                            className="block p-2 hover:bg-gray-100/90">
                                            <div className="font-semibold">{answer.survey.title}</div>
                                            <small>
                                                Answer made at: {' '}
                                                <i className="font-semibold">{answer.end_date}</i>
                                            </small>
                                        </a>
                                    ))}
                                </div>
                            }
                            {!data.latestAnswers.length &&
                                <div className="text-gray-600 text-center py-16">
                                    You don't have any students yet.
                                </div>
                            }
                        </DashboardCard>
                        </div>*/}
                </div>
            }
        </PageComponent>
    )
}