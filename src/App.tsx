import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

interface GiftItem {
  id: number
  name: string
  category: string
  reserved: boolean
  reservedBy?: string
  reserved_by?: string
}

const INITIAL_GIFTS: GiftItem[] = [
  // Eletrodomésticos
  { id: 1, name: 'Liquidificador (Oster)', category: 'Eletrodomésticos', reserved: false },
  { id: 2, name: 'Sanduicheira (Oster)', category: 'Eletrodomésticos', reserved: false },
  { id: 3, name: 'Espremedor de laranja elétrico', category: 'Eletrodomésticos', reserved: false },
  { id: 4, name: 'Centrífuga de frutas e folhas', category: 'Eletrodomésticos', reserved: false },
  { id: 5, name: 'Mini processador de alho/cebola', category: 'Eletrodomésticos', reserved: false },
  { id: 6, name: 'Chaleira (com apito, elétrica ou comum)', category: 'Eletrodomésticos', reserved: false },
  { id: 7, name: 'Garrafa de Café térmica', category: 'Eletrodomésticos', reserved: false },
  { id: 8, name: 'Garrafa de Chá térmica', category: 'Eletrodomésticos', reserved: false },
  
  // Utensílios de Cozinha
  { id: 9, name: 'Abridor de latas padrão', category: 'Utensílios de Cozinha', reserved: false },
  { id: 10, name: 'Descascador de legumes', category: 'Utensílios de Cozinha', reserved: false },
  { id: 11, name: 'Espremedor de limão', category: 'Utensílios de Cozinha', reserved: false },
  { id: 12, name: 'Amassador de batata', category: 'Utensílios de Cozinha', reserved: false },
  { id: 13, name: 'Pegador de macarrão', category: 'Utensílios de Cozinha', reserved: false },
  { id: 14, name: 'Pegador de salada', category: 'Utensílios de Cozinha', reserved: false },
  { id: 15, name: 'Tesoura de cozinha', category: 'Utensílios de Cozinha', reserved: false },
  { id: 16, name: 'Fouê', category: 'Utensílios de Cozinha', reserved: false },
  { id: 17, name: 'Pincel de silicone', category: 'Utensílios de Cozinha', reserved: false },
  { id: 18, name: 'Rolo para abrir massa', category: 'Utensílios de Cozinha', reserved: false },
  { id: 19, name: 'Colher de sorvete', category: 'Utensílios de Cozinha', reserved: false },
  { id: 20, name: 'Luva térmica', category: 'Utensílios de Cozinha', reserved: false },
  { id: 21, name: 'Avental de louça', category: 'Utensílios de Cozinha', reserved: false },
  { id: 22, name: 'Spray de azeite', category: 'Utensílios de Cozinha', reserved: false },
  { id: 23, name: 'Kit de funil', category: 'Utensílios de Cozinha', reserved: false },
  { id: 24, name: 'Colheres de medida', category: 'Utensílios de Cozinha', reserved: false },
  { id: 25, name: 'Copos medidores', category: 'Utensílios de Cozinha', reserved: false },
  { id: 26, name: 'Organizador de facas', category: 'Utensílios de Cozinha', reserved: false },
  { id: 27, name: 'Suporte de coador de café', category: 'Utensílios de Cozinha', reserved: false },
  { id: 28, name: 'Tábua de carne (vidro ou polietileno)', category: 'Utensílios de Cozinha', reserved: false },
  { id: 29, name: 'Jogo de peneiras inox', category: 'Utensílios de Cozinha', reserved: false },
  { id: 30, name: 'Talheres siliconados (por inteiro)', category: 'Utensílios de Cozinha', reserved: false },
  { id: 31, name: 'Talheres inox', category: 'Utensílios de Cozinha', reserved: false },

  // Panelas e Assadeiras
  { id: 32, name: 'Assadeiras (torta, fundo falso, pães, pudim)', category: 'Panelas e Assadeiras', reserved: false },
  { id: 33, name: 'Forma de bolo com e sem furo', category: 'Panelas e Assadeiras', reserved: false },
  { id: 34, name: 'Frigideiras (de indução)', category: 'Panelas e Assadeiras', reserved: false },
  { id: 35, name: 'Panela pipoqueira indução', category: 'Panelas e Assadeiras', reserved: false },
  { id: 36, name: 'Cuscuzeira indução', category: 'Panelas e Assadeiras', reserved: false },
  { id: 37, name: 'Travessa e refratários de vidro ou porcelana branca', category: 'Panelas e Assadeiras', reserved: false },

  // Louças, Copos e Itens de Mesa
  { id: 38, name: 'Jogo de xícaras (vidro, porcelana)', category: 'Louças e Mesa', reserved: false },
  { id: 39, name: 'Pratos (brancos ou nas cores da paleta)', category: 'Louças e Mesa', reserved: false },
  { id: 40, name: 'Jarras de vidro', category: 'Louças e Mesa', reserved: false },
  { id: 41, name: 'Copos de vidro', category: 'Louças e Mesa', reserved: false },
  { id: 42, name: 'Taça de sobremesa', category: 'Louças e Mesa', reserved: false },
  { id: 43, name: 'Taças', category: 'Louças e Mesa', reserved: false },
  { id: 44, name: 'Faqueiro', category: 'Louças e Mesa', reserved: false },
  { id: 45, name: 'Potes (vários tamanhos)', category: 'Louças e Mesa', reserved: false },
  { id: 46, name: 'Potes para mantimentos (herméticos)', category: 'Louças e Mesa', reserved: false },
  { id: 47, name: 'Porta copos para mesa', category: 'Louças e Mesa', reserved: false },
  { id: 48, name: 'Descanso de panela para mesa', category: 'Louças e Mesa', reserved: false },

  // Limpeza e Organização
  { id: 49, name: 'Panos de prato', category: 'Limpeza e Organização', reserved: false },
  { id: 50, name: 'Baldes de plástico (limpeza)', category: 'Limpeza e Organização', reserved: false },
  { id: 51, name: 'Pá de lixo', category: 'Limpeza e Organização', reserved: false },
  { id: 52, name: 'Pregadores de roupa (plásticos)', category: 'Limpeza e Organização', reserved: false },
  { id: 53, name: 'Rodo', category: 'Limpeza e Organização', reserved: false },
  { id: 54, name: 'Vassoura', category: 'Limpeza e Organização', reserved: false },
  { id: 55, name: 'Panos de chão', category: 'Limpeza e Organização', reserved: false },
  { id: 56, name: 'Escova para vaso sanitário', category: 'Limpeza e Organização', reserved: false },
  { id: 57, name: 'Jogos de tapetes (banheiro)', category: 'Limpeza e Organização', reserved: false },
  { id: 58, name: 'Tapete antiaderente (banheiro)', category: 'Limpeza e Organização', reserved: false },
  { id: 59, name: 'Jogos de tapetes (cozinha)', category: 'Limpeza e Organização', reserved: false },

  // Cama e Banho
  { id: 60, name: 'Toalha de banho (banhão)', category: 'Cama e Banho', reserved: false },
  { id: 61, name: 'Toalha de rosto (kit banheiro)', category: 'Cama e Banho', reserved: false },
  { id: 62, name: 'Jogo de toalha (casal banho e rosto)', category: 'Cama e Banho', reserved: false },
  { id: 63, name: 'Jogo de lençol (cama casal comum)', category: 'Cama e Banho', reserved: false },
  { id: 64, name: 'Lençol elástico (cama casal comum)', category: 'Cama e Banho', reserved: false },
  { id: 65, name: 'Lençol cobre leito ou manta de cama', category: 'Cama e Banho', reserved: false },
  { id: 66, name: 'Manta sofá (cores pastéis)', category: 'Cama e Banho', reserved: false },
  { id: 67, name: 'Edredom (antialérgico)', category: 'Cama e Banho', reserved: false },
  { id: 68, name: 'Cobertor (casal ou mantinha)', category: 'Cama e Banho', reserved: false },
]

const CATEGORIES = Array.from(new Set(INITIAL_GIFTS.map(g => g.category)))

export default function App() {
  const [gifts, setGifts] = useState<GiftItem[]>(INITIAL_GIFTS)
  const [reservingId, setReservingId] = useState<number | null>(null)
  const [userName, setUserName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | 'Todos'>('Todos')
  const [loading, setLoading] = useState(true)
  
  // Custom suggestion states
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customItem, setCustomItem] = useState('')

  // Check if Supabase keys are configured
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchGifts()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error

      if (data && data.length > 0) {
        setGifts(data)
      } else {
        // If table is empty, seed with initial gifts
        await seedGifts()
      }
    } catch (error) {
      console.error('Error fetching gifts:', error)
    } finally {
      setLoading(false)
    }
  }

  const seedGifts = async () => {
    try {
      const { error } = await supabase.from('gifts').insert(INITIAL_GIFTS)
      if (error) throw error
    } catch (error) {
      console.error('Error seeding gifts:', error)
    }
  }

  const handleReserve = async (id: number) => {
    if (!userName.trim()) {
      alert('Por favor, digite seu nome para reservar.')
      return
    }

    const updatedGift = gifts.find(g => g.id === id)
    if (!updatedGift) return

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('gifts')
          .update({ reserved: true, reserved_by: userName })
          .eq('id', id)

        if (error) throw error
        
        await fetchGifts()
      } catch (error) {
        alert('Erro ao reservar item. Tente novamente.')
        console.error(error)
      }
    } else {
      // Fallback to local state if no Supabase
      setGifts(prevGifts =>
        prevGifts.map(gift =>
          gift.id === id ? { ...gift, reserved: true, reservedBy: userName } : gift
        )
      )
    }

    setReservingId(null)
    setUserName('')
  }

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customItem.trim() || !userName.trim()) {
      alert('Por favor, preencha seu nome e o item.')
      return
    }

    const newItem = {
      id: Date.now(),
      name: customItem,
      category: 'Sugerido por Convidado',
      reserved: true,
      reserved_by: userName
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('gifts').insert([newItem])
        if (error) throw error
        await fetchGifts()
      } catch (error) {
        alert('Erro ao sugerir item.')
        console.error(error)
      }
    } else {
      setGifts([{ ...newItem, reservedBy: userName }, ...gifts])
    }

    setCustomItem('')
    setUserName('')
    setShowCustomForm(false)
    alert('Obrigado pela sugestão! O item foi reservado em seu nome.')
  }

  const filteredGifts = selectedCategory === 'Todos' 
    ? gifts 
    : gifts.filter(g => g.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#556b2f]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f7f1] text-[#3c4a3e] font-sans selection:bg-[#869477] selection:text-white">
      {/* Configuration Warning for Owner */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-100 text-amber-800 p-2 text-center text-xs font-bold border-b border-amber-200">
          ⚠️ MODO DE DEMONSTRAÇÃO: As reservas não serão salvas permanentemente. Configure o Supabase no arquivo .env para ativar o banco de dados.
        </div>
      )}

      {/* Header */}
      <header className="bg-[#556b2f] text-white py-16 px-6 text-center shadow-md">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-tight">Lista de Presentes</h1>
        <p className="text-xl font-light opacity-90 max-w-2xl mx-auto italic">
          Mel & Max • Chá de Panela
        </p>
        <div className="mt-6 w-24 h-1 bg-[#869477] mx-auto rounded-full"></div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-6">
        <section className="mb-12 text-center bg-white p-8 rounded-3xl shadow-sm border border-[#d8e0d1]">
          <div className="text-3xl mb-4">😘</div>
          <p className="text-xl text-[#556b2f] font-medium mb-4 leading-relaxed">
            Olá pessoal, estamos organizando a lista do chá de cozinha, vamos enviar várias sugestões!
          </p>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Façam suas escolhas, podendo ser da lista ou não, mas informem o item escolhido por favor! Fiquem à vontade para escolher.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="bg-[#869477] text-white px-6 py-2 rounded-full hover:bg-[#556b2f] transition-colors shadow-sm font-medium"
            >
              {showCustomForm ? 'Fechar Sugestão' : 'Sugerir outro item 🎁'}
            </button>
          </div>

          {showCustomForm && (
            <form onSubmit={handleAddCustom} className="mt-8 p-6 bg-[#f4f7f1] rounded-2xl max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="font-serif text-lg mb-4 text-[#556b2f]">Sugerir e Reservar Item</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Nome do item (ex: Air Fryer)"
                  className="w-full px-4 py-2 rounded-lg border border-[#d8e0d1] focus:ring-2 focus:ring-[#556b2f]/20 outline-none"
                  value={customItem}
                  onChange={(e) => setCustomItem(e.target.value)}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Seu nome"
                  className="w-full px-4 py-2 rounded-lg border border-[#d8e0d1] focus:ring-2 focus:ring-[#556b2f]/20 outline-none"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
                <button type="submit" className="w-full bg-[#556b2f] text-white py-2 rounded-lg font-medium hover:bg-[#3d4d22] transition-colors">
                  Enviar Sugestão
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <button 
            onClick={() => setSelectedCategory('Todos')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'Todos' ? 'bg-[#556b2f] text-white' : 'bg-white text-[#556b2f] border border-[#d8e0d1]'
            }`}
          >
            Todos
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat ? 'bg-[#556b2f] text-white' : 'bg-white text-[#556b2f] border border-[#d8e0d1]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gift Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGifts.map((gift) => (
            <div 
              key={gift.id} 
              className={`relative bg-white rounded-2xl p-5 shadow-sm border transition-all duration-300 ${
                gift.reserved 
                  ? 'border-stone-200 opacity-80 bg-stone-50' 
                  : 'border-[#d8e0d1] hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#869477] font-bold block mb-1">
                    {gift.category}
                  </span>
                  <h3 className={`text-lg font-semibold leading-tight ${gift.reserved ? 'text-stone-400 line-through' : 'text-[#3c4a3e]'}`}>
                    {gift.name}
                  </h3>
                </div>

                <div className="mt-auto">
                  {gift.reserved ? (
                    <div className="text-xs text-stone-500 italic bg-white/50 py-2 px-3 rounded-lg text-center border border-stone-100">
                      Reservado por {gift.reserved_by || gift.reservedBy}
                    </div>
                  ) : (
                    <>
                      {reservingId === gift.id ? (
                        <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                          <input 
                            type="text" 
                            placeholder="Seu nome"
                            className="w-full px-3 py-1.5 border border-[#869477] rounded-lg outline-none focus:ring-2 focus:ring-[#556b2f]/20 text-sm"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleReserve(gift.id)}
                              className="flex-1 bg-[#556b2f] text-white py-1.5 rounded-lg text-xs font-medium hover:bg-[#3d4d22]"
                            >
                              Confirmar
                            </button>
                            <button 
                              onClick={() => {
                                setReservingId(null)
                                setUserName('')
                              }}
                              className="px-2 py-1.5 text-stone-500 hover:text-stone-700 text-xs font-medium"
                            >
                              Sair
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setReservingId(gift.id)}
                          className="w-full bg-[#f4f7f1] text-[#556b2f] border border-[#556b2f]/30 py-2 rounded-lg text-xs font-bold hover:bg-[#556b2f] hover:text-white transition-all duration-300"
                        >
                          Reservar
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-16 text-center border-t border-[#d8e0d1] bg-white mt-12">
        <p className="text-[#869477] text-sm uppercase tracking-widest mb-2">Com carinho,</p>
        <p className="text-3xl font-serif text-[#556b2f]">Mel & Max</p>
        <p className="text-stone-400 text-xs mt-8 italic">© 2026 • Chá de Cozinha</p>
      </footer>
    </div>
  )
}
