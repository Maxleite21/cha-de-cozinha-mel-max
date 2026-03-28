import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

interface Reservation {
  name: string
  quantity: number
}

interface GiftItem {
  id: number
  name: string
  category: string
  quantity_needed: number
  quantity_reserved: number
  reservations: Reservation[]
}

const INITIAL_GIFTS: Partial<GiftItem>[] = [
  // Eletrodomésticos
  { id: 1, name: 'Liquidificador (Oster)', category: 'Eletrodomésticos', quantity_needed: 1 },
  { id: 2, name: 'Sanduicheira (Oster)', category: 'Eletrodomésticos', quantity_needed: 1 },
  { id: 3, name: 'Espremedor de laranja elétrico', category: 'Eletrodomésticos', quantity_needed: 1 },
  { id: 4, name: 'Centrífuga de frutas e folhas', category: 'Eletrodomésticos', quantity_needed: 1 },
  { id: 5, name: 'Mini processador de alho/cebola', category: 'Eletrodomésticos', quantity_needed: 1 },
  { id: 6, name: 'Chaleira (com apito, elétrica ou comum)', category: 'Eletrodomésticos', quantity_needed: 1 },
  { id: 7, name: 'Garrafa de Café térmica', category: 'Eletrodomésticos', quantity_needed: 1 },
  { id: 8, name: 'Garrafa de Chá térmica', category: 'Eletrodomésticos', quantity_needed: 1 },
  
  // Utensílios de Cozinha
  { id: 9, name: 'Abridor de latas padrão', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 10, name: 'Descascador de legumes', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 11, name: 'Espremedor de limão', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 12, name: 'Amassador de batata', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 13, name: 'Pegador de macarrão', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 14, name: 'Pegador de salada', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 15, name: 'Tesoura de cozinha', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 16, name: 'Fouê', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 17, name: 'Pincel de silicone', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 18, name: 'Rolo para abrir massa', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 19, name: 'Colher de sorvete', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 20, name: 'Luva térmica', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 21, name: 'Avental de louça', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 22, name: 'Spray de azeite', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 23, name: 'Kit de funil', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 24, name: 'Colheres de medida', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 25, name: 'Copos medidores', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 26, name: 'Organizador de facas', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 27, name: 'Suporte de coador de café', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 28, name: 'Tábua de carne (vidro ou polietileno)', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 29, name: 'Jogo de peneiras inox', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 30, name: 'Talheres siliconados (por inteiro)', category: 'Utensílios de Cozinha', quantity_needed: 1 },
  { id: 31, name: 'Talheres inox', category: 'Utensílios de Cozinha', quantity_needed: 1 },

  // Panelas e Assadeiras
  { id: 32, name: 'Assadeiras (torta, fundo falso, pães, pudim)', category: 'Panelas e Assadeiras', quantity_needed: 1 },
  { id: 33, name: 'Forma de bolo com e sem furo', category: 'Panelas e Assadeiras', quantity_needed: 1 },
  { id: 34, name: 'Frigideiras (de indução)', category: 'Panelas e Assadeiras', quantity_needed: 1 },
  { id: 35, name: 'Panela pipoqueira indução', category: 'Panelas e Assadeiras', quantity_needed: 1 },
  { id: 36, name: 'Cuscuzeira indução', category: 'Panelas e Assadeiras', quantity_needed: 1 },
  { id: 37, name: 'Travessa e refratários de vidro ou porcelana branca', category: 'Panelas e Assadeiras', quantity_needed: 1 },

  // Louças, Copos e Itens de Mesa
  { id: 38, name: 'Jogo de xícaras (vidro, porcelana)', category: 'Louças e Mesa', quantity_needed: 1 },
  { id: 39, name: 'Pratos (brancos ou nas cores da paleta)', category: 'Louças e Mesa', quantity_needed: 1 },
  { id: 40, name: 'Jarras de vidro', category: 'Louças e Mesa', quantity_needed: 1 },
  { id: 41, name: 'Copos de vidro', category: 'Louças e Mesa', quantity_needed: 1 },
  { id: 42, name: 'Taça de sobremesa', category: 'Louças e Mesa', quantity_needed: 1 },
  { id: 43, name: 'Taças', category: 'Louças e Mesa', quantity_needed: 1 },
  { id: 44, name: 'Faqueiro', category: 'Louças e Mesa', quantity_needed: 1 },
  { id: 45, name: 'Potes (vários tamanhos)', category: 'Louças e Mesa', quantity_needed: 1 },
  { id: 46, name: 'Potes para mantimentos (herméticos)', category: 'Louças e Mesa', quantity_needed: 1 },
  { id: 47, name: 'Porta copos para mesa', category: 'Louças e Mesa', quantity_needed: 1 },
  { id: 48, name: 'Descanso de panela para mesa', category: 'Louças e Mesa', quantity_needed: 1 },

  // Limpeza e Organização
  { id: 49, name: 'Panos de prato', category: 'Limpeza e Organização', quantity_needed: 1 },
  { id: 50, name: 'Baldes de plástico (limpeza)', category: 'Limpeza e Organização', quantity_needed: 1 },
  { id: 51, name: 'Pá de lixo', category: 'Limpeza e Organização', quantity_needed: 1 },
  { id: 52, name: 'Pregadores de roupa (plásticos)', category: 'Limpeza e Organização', quantity_needed: 1 },
  { id: 53, name: 'Rodo', category: 'Limpeza e Organização', quantity_needed: 1 },
  { id: 54, name: 'Vassoura', category: 'Limpeza e Organização', quantity_needed: 1 },
  { id: 55, name: 'Panos de chão', category: 'Limpeza e Organização', quantity_needed: 1 },
  { id: 56, name: 'Escova para vaso sanitário', category: 'Limpeza e Organização', quantity_needed: 1 },
  { id: 57, name: 'Jogos de tapetes (banheiro)', category: 'Limpeza e Organização', quantity_needed: 1 },
  { id: 58, name: 'Tapete antiaderente (banheiro)', category: 'Limpeza e Organização', quantity_needed: 1 },
  { id: 59, name: 'Jogos de tapetes (cozinha)', category: 'Limpeza e Organização', quantity_needed: 1 },

  // Cama e Banho
  { id: 60, name: 'Toalha de banho (banhão)', category: 'Cama e Banho', quantity_needed: 1 },
  { id: 61, name: 'Toalha de rosto (kit banheiro)', category: 'Cama e Banho', quantity_needed: 1 },
  { id: 62, name: 'Jogo de toalha (casal banho e rosto)', category: 'Cama e Banho', quantity_needed: 1 },
  { id: 63, name: 'Jogo de lençol (cama casal comum)', category: 'Cama e Banho', quantity_needed: 1 },
  { id: 64, name: 'Lençol elástico (cama casal comum)', category: 'Cama e Banho', quantity_needed: 1 },
  { id: 65, name: 'Lençol cobre leito ou manta de cama', category: 'Cama e Banho', quantity_needed: 1 },
  { id: 66, name: 'Manta sofá (cores pastéis)', category: 'Cama e Banho', quantity_needed: 1 },
  { id: 67, name: 'Edredom (antialérgico)', category: 'Cama e Banho', quantity_needed: 1 },
  { id: 68, name: 'Cobertor (casal ou mantinha)', category: 'Cama e Banho', quantity_needed: 1 },
]

export default function App() {
  const [gifts, setGifts] = useState<GiftItem[]>([])
  const [reservingId, setReservingId] = useState<number | null>(null)
  const [userName, setUserName] = useState('')
  const [reserveQty, setReserveQty] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | 'Todos'>('Todos')
  const [loading, setLoading] = useState(true)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customItem, setCustomItem] = useState('')

  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchGifts()
    } else {
      const demoGifts = INITIAL_GIFTS.map(g => ({
        ...g,
        quantity_reserved: 0,
        reservations: []
      })) as GiftItem[]
      setGifts(demoGifts)
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
      const seedData = INITIAL_GIFTS.map(g => ({
        ...g,
        quantity_reserved: 0,
        reservations: []
      }))
      const { error } = await supabase.from('gifts').insert(seedData)
      if (error) throw error
      await fetchGifts()
    } catch (error) {
      console.error('Error seeding gifts:', error)
    }
  }

  const handleReserve = async (id: number) => {
    if (!userName.trim()) {
      alert('Por favor, digite seu nome.')
      return
    }

    const gift = gifts.find(g => g.id === id)
    if (!gift) return

    const available = gift.quantity_needed - gift.quantity_reserved
    if (reserveQty > available) {
      alert(`Desculpe, só restam ${available} unidades deste item.`)
      return
    }

    const newReservation = { name: userName, quantity: reserveQty }
    const updatedReservations = [...(gift.reservations || []), newReservation]
    const updatedQtyReserved = gift.quantity_reserved + reserveQty

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('gifts')
          .update({ 
            quantity_reserved: updatedQtyReserved, 
            reservations: updatedReservations 
          })
          .eq('id', id)

        if (error) throw error
        await fetchGifts()
      } catch (error) {
        alert('Erro ao reservar.')
        console.error(error)
      }
    } else {
      setGifts(prev => prev.map(g => g.id === id ? { 
        ...g, 
        quantity_reserved: updatedQtyReserved, 
        reservations: updatedReservations 
      } : g))
    }

    setReservingId(null)
    setUserName('')
    setReserveQty(1)
  }

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customItem.trim() || !userName.trim()) {
      alert('Preencha os campos.')
      return
    }

    const newItem = {
      id: Date.now(),
      name: customItem,
      category: 'Sugerido por Convidado',
      quantity_needed: reserveQty,
      quantity_reserved: reserveQty,
      reservations: [{ name: userName, quantity: reserveQty }]
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('gifts').insert([newItem])
        if (error) throw error
        await fetchGifts()
      } catch (error) {
        alert('Erro ao sugerir.')
        console.error(error)
      }
    } else {
      setGifts([newItem as GiftItem, ...gifts])
    }

    setCustomItem('')
    setUserName('')
    setReserveQty(1)
    setShowCustomForm(false)
  }

  const categories = Array.from(new Set(gifts.map(g => g.category)))
  const filteredGifts = selectedCategory === 'Todos' ? gifts : gifts.filter(g => g.category === selectedCategory)

  if (loading) return (
    <div className="min-h-screen bg-[#f4f7f1] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#556b2f]"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f4f7f1] text-[#3c4a3e] font-sans selection:bg-[#869477] selection:text-white pb-12">
      <header className="bg-[#556b2f] text-white py-16 px-6 text-center shadow-md">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-tight">Lista de Presentes</h1>
        <p className="text-xl font-light opacity-90 italic">Mel & Max • Chá de Cozinha</p>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-6">
        <section className="mb-12 text-center bg-white p-8 rounded-3xl shadow-sm border border-[#d8e0d1]">
          <div className="text-3xl mb-4">😘</div>
          <p className="text-xl text-[#556b2f] font-medium mb-4 leading-relaxed">
            Olá pessoal, estamos organizando a lista do chá de cozinha, vamos enviar várias sugestões!
          </p>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Escolha um item da lista e indique a quantidade que deseja presentear. Se preferir algo diferente, use o botão abaixo!
          </p>
          
          <button onClick={() => setShowCustomForm(!showCustomForm)} className="mt-8 bg-[#869477] text-white px-6 py-2 rounded-full hover:bg-[#556b2f] transition-colors shadow-sm font-medium">
            {showCustomForm ? 'Fechar Sugestão' : 'Sugerir outro item 🎁'}
          </button>

          {showCustomForm && (
            <form onSubmit={handleAddCustom} className="mt-8 p-6 bg-[#f4f7f1] rounded-2xl max-w-md mx-auto space-y-4 text-left">
              <h3 className="font-serif text-lg text-[#556b2f] text-center">Sugerir e Reservar Item</h3>
              <div>
                <label className="text-xs font-bold text-[#869477] uppercase">Nome do Item</label>
                <input type="text" placeholder="Ex: Air Fryer" className="w-full px-4 py-2 rounded-lg border border-[#d8e0d1] outline-none mt-1" value={customItem} onChange={(e) => setCustomItem(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#869477] uppercase">Seu Nome</label>
                  <input type="text" placeholder="Seu nome" className="w-full px-4 py-2 rounded-lg border border-[#d8e0d1] outline-none mt-1" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#869477] uppercase">Quantidade</label>
                  <input type="number" min="1" className="w-full px-4 py-2 rounded-lg border border-[#d8e0d1] outline-none mt-1" value={reserveQty} onChange={(e) => setReserveQty(parseInt(e.target.value))} required />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#556b2f] text-white py-3 rounded-lg font-medium hover:bg-[#3d4d22] transition-colors">Confirmar Sugestão</button>
            </form>
          )}
        </section>

        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <button onClick={() => setSelectedCategory('Todos')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === 'Todos' ? 'bg-[#556b2f] text-white' : 'bg-white text-[#556b2f] border border-[#d8e0d1]'}`}>Todos</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-[#556b2f] text-white' : 'bg-white text-[#556b2f] border border-[#d8e0d1]'}`}>{cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGifts.map((gift) => {
            const isCompleted = gift.quantity_reserved >= gift.quantity_needed;
            return (
              <div key={gift.id} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all duration-300 ${isCompleted ? 'border-stone-200 opacity-80 bg-stone-50' : 'border-[#d8e0d1] hover:shadow-lg'}`}>
                <div className="flex flex-col h-full">
                  <span className="text-[10px] uppercase tracking-widest text-[#869477] font-bold mb-1">{gift.category}</span>
                  <h3 className={`text-lg font-semibold leading-tight mb-2 ${isCompleted ? 'text-stone-400 line-through' : 'text-[#3c4a3e]'}`}>{gift.name}</h3>
                  
                  <div className="text-xs font-medium text-[#556b2f] mb-4">
                    {gift.quantity_reserved} de {gift.quantity_needed} reservados
                  </div>

                  <div className="mt-auto space-y-2">
                    {gift.reservations?.map((res, i) => (
                      <div key={i} className="text-[11px] text-stone-500 italic bg-white/50 py-1 px-2 rounded border border-stone-100 flex justify-between">
                        <span>{res.name}</span>
                        <span className="font-bold">+{res.quantity}</span>
                      </div>
                    ))}

                    {!isCompleted && (
                      <>
                        {reservingId === gift.id ? (
                          <div className="p-3 bg-[#f4f7f1] rounded-xl space-y-2 animate-in fade-in zoom-in-95">
                            <input type="text" placeholder="Seu nome" className="w-full px-3 py-1.5 border border-[#869477] rounded-lg outline-none text-xs" value={userName} onChange={(e) => setUserName(e.target.value)} autoFocus />
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-[#869477]">QTD:</span>
                              <input type="number" min="1" max={gift.quantity_needed - gift.quantity_reserved} className="w-16 px-2 py-1 border border-[#869477] rounded-lg outline-none text-xs" value={reserveQty} onChange={(e) => setReserveQty(parseInt(e.target.value))} />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleReserve(gift.id)} className="flex-1 bg-[#556b2f] text-white py-1.5 rounded-lg text-xs font-bold">Confirmar</button>
                              <button onClick={() => {setReservingId(null); setUserName(''); setReserveQty(1);}} className="px-2 py-1.5 text-stone-500 text-xs">Sair</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setReservingId(gift.id)} className="w-full bg-[#f4f7f1] text-[#556b2f] border border-[#556b2f]/30 py-2 rounded-lg text-xs font-bold hover:bg-[#556b2f] hover:text-white transition-all">Reservar Item</button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <footer className="py-16 text-center border-t border-[#d8e0d1] bg-white mt-12">
        <p className="text-[#869477] text-sm uppercase tracking-widest mb-2">Com carinho,</p>
        <p className="text-3xl font-serif text-[#556b2f]">Mel & Max</p>
        <p className="text-stone-400 text-xs mt-8 italic">© 2026 • Chá de Cozinha</p>
      </footer>
    </div>
  )
}
