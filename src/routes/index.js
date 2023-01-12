import expresss from "express"

import userRouter from "./userRouter.js"
import listRouter from "./ListRouter.js"

const routes = app => {
    app.route('/').get((req, res) => {
        res
        .status(200)
        .send({msg: 'Home page'})
    })

    app.use(
        expresss.json(),
        userRouter,
        listRouter
    )
}

export default routes
