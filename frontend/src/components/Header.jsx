import react from 'react';

export default () => {
    const [name, setName] = react.useState("test");
    const [aviso, setAviso] = react.useState("test");
    return(
    <header className="header bg-gray-500 rounded-xl m-5 p-2  justify-between items-center flex-row flex ">
        <div className="left">
            <h1 className="text-2xl text-teal-300 p-2">SafeEvent</h1>
        </div>
        <div className="mid">
            <h1 className='text-bold text-3xl bg-gray-600 shadow-2xl rounded-xl shadow-black p-2 text-red-500'>{aviso}</h1>
        </div>
        <div className="right">
            {
                name ? 
                <><h1 className='text-bold text-3xl p-2 text-pink-300'>{name}</h1></> 
                : 
                <><button className="bg-teal-300 shadow-2xl shadow-black text-gray-800 font-bold py-2 px-4 rounded">Iniciar Sesión</button>
                <button className="bg-yellow-400 shadow-2xl shadow-black text-gray-800 font-bold py-2 px-4 rounded ml-2">Registrarse</button></>
            }

        </div>
    </header>)
}
