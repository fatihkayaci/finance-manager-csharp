import { createContext, useReducer } from 'react'

// 1. Context'i oluşturuyoruz
export const TransactionContext = createContext()

// 2. Reducer fonksiyonu: State'in nasıl değişeceğini belirler
// (Buna şimdilik sadece iskelet olarak bak, içini sonra dolduracağız)
export const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload }
    default:
      return state
  }
}

// 3. Provider Bileşeni: Tüm uygulamayı saracak olan kapsayıcı
export const TransactionProvider = ({ children }) => {
  // Başlangıç state'i (boş bir kullanıcı ve boş işlem listesi)
  const [state, dispatch] = useReducer(transactionReducer, {
    user: null,
    transactions: [],
    authIsReady: false
  })

  console.log('TransactionContext State:', state) // Konsoldan durumu takip etmek için

  return (
    // State'i ve dispatch fonksiyonunu tüm çocuklara (children) açıyoruz
    <TransactionContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  )
}