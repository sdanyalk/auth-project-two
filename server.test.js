const rewire = require("rewire")
const server = rewire("./server")
const startServer = server.__get__("startServer")
// @ponicode
describe("startServer", () => {
    test("0", async () => {
        await startServer()
    })
})
