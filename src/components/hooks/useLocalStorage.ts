import { useState } from "react"
function useLocalStorage<Type>(key: string, initialValue: Type):[Type, (value: Type) => void]{

    const [storedValue, setStoredValue] = useState<Type>(() => {
        if (typeof window === "undefined")  {
            return initialValue
        }

        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.log(error)
            return initialValue
        }
    })

    const setValue = (value: unknown) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
            }
        } catch (error) {
            console.log(error)
        }
    }

    return [storedValue, setValue]
}
export default useLocalStorage
