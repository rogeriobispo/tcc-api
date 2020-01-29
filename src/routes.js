import Router from 'express'

const routes = new Router()

routes.get('/', (req, res)=>{
    return res.json({"mensgam": "Estou vivo"})
})
export default routes