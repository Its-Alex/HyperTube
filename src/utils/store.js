import { observable, action, useStrict } from 'mobx'

useStrict(true)

class Store {
	toast = null
}

let store = new Store()
export default store