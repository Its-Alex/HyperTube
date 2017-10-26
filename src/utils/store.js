import { observable, action, useStrict } from 'mobx'

useStrict(true)

class Store {
	toast = null
  @observable searchResult = []
  @observable resultPopular = []
  @observable resultTopRated = []
  
	@action
	addResultSearch (res) {
    if (this.searchResult.length !== 0) {
      this.searchResult = this.searchResult.concat(res)
    } else {
      this.searchResult = res
    }
  }

  @action
  addResultPopular (res) {
    if (this.resultPopular) {
      this.resultPopular = this.resultPopular.concat(res)
    } else {
      this.resultPopular = res
    }
  }

  @action
  addResultTopRated (res) {
    if (this.resultTopRated) {
      this.resultTopRated = this.resultTopRated.concat(res)
    } else {
      this.resultTopRated = res
    }    
  }

	@action
	setSearch (res) {
		this.searchResult = res
	}
}

let store = new Store()
export default store
