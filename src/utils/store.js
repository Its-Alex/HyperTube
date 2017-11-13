import { observable, action, useStrict } from 'mobx'

useStrict(true)

class Store {
  @observable searchResult = []
  @observable pageSearchResult = 1
  @observable resultPopular = []
  @observable pageResultPopular = 1
  @observable resultTopRated = []
  @observable pageResultTopRated = 1
  @observable totalPages = ''
  @observable notif = ''
  @observable choicelangue = ''
  @observable movie = null
  @observable refresh = false

  @action
  addMovie (res) {
    this.movie = res
  }

	@action
	addResultSearch (res) {
    this.refresh = false
    this.totalPages = res.total_pages
    this.pageSearchResult = this.pageSearchResult + 1
    if (this.searchResult.length !== 0) {
      this.searchResult = this.searchResult.concat(res.results)
    } else {
      this.searchResult = res.results
    }
  }

  @action
  addResultPopular (res) {
    this.pageResultPopular = this.pageResultPopular + 1
    if (this.resultPopular.length !== 0) {
      this.resultPopular = this.resultPopular.concat(res)
    } else {
      this.resultPopular = res
    }
  }
  @action
  resetPopular () {
    this.pageResultPopular = 1
    this.resultPopular = []
  }

  @action
  resetTopRated () {
    this.pageResultTopRated = 1
    this.resultTopRated = []
  }

  @action
  addResultTopRated (res) {
    this.pageResultTopRated = this.pageResultTopRated + 1
    if (this.resultTopRated.length !== 0) {
      this.resultTopRated = this.resultTopRated.concat(res)
    } else {
      this.resultTopRated = res
    }    
  }

	@action
	resetSearch (res) {
    this.totalPages = res.total_pages
    this.pageSearchResult = 2
    this.searchResult = res.results
  }

  @action
	resetSearchRefresh () {
    this.refresh = true
    this.pageSearchResult = 1
    this.searchResult = []
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

  @action
  modifyLangue (langue) {
      this.resultPopular = []
      this.resultTopRated = []
      this.pageResultPopular = 1
      this.pageResultTopRated = 1
  }
}

let store = new Store()
export default store
export let newInst = new Store()
