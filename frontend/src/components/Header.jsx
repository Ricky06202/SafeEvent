import react from 'react';

export default () => {
    const [name, setName] = react.useState("");
    const [aviso, setAviso] = react.useState(["hola", "a"]);
    const toggleTheme = () => {window._toggleTheme()}

    const irAEvento = (e) => {
        console.log(e); //Pendiente; Hacer pasarela directa al QR.
    }

    return(
    <header className="header divMain rounded-xl m-5 p-2  border-gray-500 border-1 shadow-xs shadow-black justify-between items-center flex-row flex ">
        <div className="left">
            <h1 className="text-2xl title p-2">SafeEvent</h1>
        </div>
        <div className="mid">
            {aviso[0] && name && <button className='text-bold text-3xl bg-gray-600 shadow-2xl rounded-xl shadow-black p-2 text-red-500' onClick={() => irAEvento(aviso[1])}>{aviso[0]}</button>}
        </div>
        <div className="right  flex-row flex items-center gap-3">
            <button className="bt-def rounded-xs" onClick={toggleTheme}>🌓</button> 
            {
                name ? 
                <><h1 className='text-bold rounded-xl div2 text-3xl p-2'>{name}</h1></> 
                : 
                <><button className="bg-teal-300 shadow-2xl shadow-black text-gray-800 font-bold py-2 px-4 rounded">Iniciar Sesión</button>
                <button className="bg-yellow-400 shadow-2xl shadow-black text-gray-800 font-bold py-2 px-4 rounded ml-2">Registrarse</button></>
            }

        </div>
    </header>)
}
