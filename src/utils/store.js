import { observable, action, useStrict } from 'mobx'

useStrict(true)

class Store {

  @observable searchResult = []
  @observable resultPopular = []
  @observable resultTopRated = []
  @observable totalPages = ''
  @observable notif = ''
  
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
    console.log(res)
    if (this.resultPopular.length !== 0) {
      this.resultPopular = this.resultPopular.concat(res)
    } else {
      this.resultPopular = res
    }
  }

  @action
  addResultTopRated (res) {
    if (this.resultTopRated.length !== 0) {
      this.resultTopRated = this.resultTopRated.concat(res)
    } else {
      this.resultTopRated = res
    }    
  }

  @action
  setTotalPages (res) {
    this.totalPages = res
  }

	@action
	resetSearch (res) {
		this.searchResult = res
  }
  
  @action
  addNotif (msg, type) {
    let notif = document.getElementById('notification')
    this.notif = msg
    notif.classList.add(type)
    setTimeout(() => {
      notif.className = ''
    }, 4000);
  }
}

let store = new Store()
export default store
export let newInst = new Store()
