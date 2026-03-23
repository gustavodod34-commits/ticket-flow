import { useEffect, useState } from 'react'

function App() {
  // 1. Iniciando o estado buscando o localStorage
  const [chamados, setChamados] = useState(() => {
    const chamadosSalvos = localStorage.getItem('ticketflow-chamados')
    // Se tiver dados salvos, transforma de texto para array. Se não, começa vázio [].
    return chamadosSalvos ? JSON.parse(chamadosSalvos) : []
  })
  
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  
  // Toda vez que a váriavel 'chamados' mudar, salva no localStorage
  useEffect(() => {
    localStorage.setItem('ticketflow-chamados', JSON.stringify(chamados))
  }, [chamados]) // Essa array é o gatilho  
  // 2. Função que roda quando clicamos "Abrir Chamado"
  const adicionarChamado = (e) => {
    e.preventDefault() 

    if (!titulo || !descricao) return 

    const novoChamado = {
      id: Date.now(), 
      titulo: titulo,
      descricao: descricao,
      status: 'Aberto'
    } 
    
    setChamados([...chamados, novoChamado])
    setTitulo('')
    setDescricao('')
  }

  /* --- A FUNÇÃO DE RESOLVER --- */
  const resolverChamado = (idClicado) => {
    const chamadosAtualizados = chamados.map(chamado => {
      if (chamado.id === idClicado) {
        return {...chamado, status: 'Resolvido' } 
      }
      return chamado
    })
    
    setChamados(chamadosAtualizados)
  }

  /* --- FUNÇÃO DE EXCLUIR --- */
  const deletarChamado =(idClicado) => {
    // O filter vai criar uma nova lista contendo os chamados que NÃO são o clicado
    const chamadosFiltrados = chamados.filter(chamado => chamado.id !== idClicado)

    // Atualiza a memória com essa nova lista (sem os chamados deletados)
    setChamados(chamadosFiltrados)
  }

  const chamadosFiltradosExibicao = chamados.filter(chamado => {
    if (filtro === 'Abertos') return chamado.status === 'Aberto';
    if (filtro === 'Resolvidos') return chamado.status === 'Resolvido';
    return true;
  })

  // 3. O visual 
  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          🎫 TicketFlow HelpDesk
        </h1>

        {/* --- CAIXA DO FORMULÁRIO --- */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">Abrir Novo Chamado</h2>

          <form onSubmit={adicionarChamado} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Título do problema (ex: Sistema de vendas travou)"
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)} 
            />
            <textarea
              placeholder="Descreva o problema com detalhes..."
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)} 
            ></textarea>

            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition"
            >
              Abrir Chamado
            </button>
          </form>
        </div>

        {/* --- CAIXA DA LISTA DE CHAMADOS --- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">
            {/* O título vai atualizar dependendo do filtro*/}
            Chamados {filtro} ({chamadosFiltradosExibicao.length})
          </h2>

          {/* --- BOTÕES DE FILTRO --- */}
          <div className="flex gap-2 mb-6">
            <button
            onClick={() => setFiltro('Todos')}
           className={`px-4 py-2 rounded font-semibold transition ${filtro === 'Todos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Todos
            </button>
            <button
            onClick={() => setFiltro('Abertos')}
            className={`px-4 py-2 rounded font-semibold transition ${filtro === 'Abertos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Abertos
            </button>
            <button onClick={() => setFiltro('Resolvidos')}
              className={`px-4 py-2 rounded font-semibold transition ${filtro === 'Resolvidos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Resolvidos
              </button> 
          </div>
        
        {chamadosFiltradosExibicao.length === 0 ? (
          <p className="text-gray-500 italic">Nenhum chamado aberto no momento. Tudo tranquilo! ☕</p>
        ) : (
          chamadosFiltradosExibicao.map(chamado => (
            
            /* A div principal do cartão agora envolve TUDO, incluindo o botão */
            <div key={chamado.id} className={`border-l-4 bg-slate-50 p-4 mb-4 rounded shadow-sm flex justify-between items-start ${chamado.status === 'Aberto' ? 'border-red-500' : 'border-emerald-500'}`}>
              
              <div>
                <h3 className="font-bold text-lg text-slate-800">{chamado.titulo}</h3>
                <p className="text-gray-600 mt-2">{chamado.descricao}</p>
                <span className={`inline-block mt-3 px-2 py-1 text-xs font-bold rounded ${chamado.status === 'Aberto' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {chamado.status}
                </span>
              </div>

              {/* --- AGRUPAMENTO DOS BOTÕES --- */}
              <div className="flex gap-2 ml-4">
                {/* O Botão de resolver (só aparece quando ele tá aberto) */}
                {chamado.status === 'Aberto' && (
                  <button 
                  onClick={() => resolverChamado(chamado.id)}
                  className="bg-emerald-500 text-white font-bold py-2 px-4 rounded hover:bg-emerald-600 transition"
                  >
                    Resolver
                  </button> 
                )}

                {/* --- Botão de Excluir --- */}
                {/* Esse botão só aparece, para poder apagar os chamados abertos ou resolvidos */}
                <button 
                onClick={() => deletarChamado(chamado.id)}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition"
                >
                  Excluir
                </button>
                
                </div> {/* <-- Essa div fecha o grupo de botões */}
            </div> //E essa div fecha o cartão inteiro! (Era essa que faltava) 

          ))
        )}
        </div>
        
      </div>
    </div>
  )
}

export default App