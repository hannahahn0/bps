const getToken = () => localStorage.token || null

const setToken = (token) => { localStorage.token = token }

const hasToken = () => !!localStorage.token

const logOut = () => delete localStorage.token

export { getToken, setToken, hasToken, logOut }
