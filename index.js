// 宣告變數
const friendList = document.querySelector('#friend-list')
const index_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'
let personalInfo = []
let resultList = []
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
let favoriteHTML = `<button type="button" class="btn btn-danger favorite" data-id= `
let notFavoriteHTML = `<button type="button" class="btn btn-outline-danger favorite" data-id= `
const dataPerPage = 20
const paginator = document.querySelector('#paginator')

// 串接API並用陣列提取資料
axios
  .get(index_URL)
  .then(response => {
    personalInfo.push(...response.data.results)
    // 在物件裡加入favorite，供後面參照
    personalInfo.forEach(item => item.favorite = false)
    everUsed()
  })
  .catch(err => console.log(err))

// 非首次使用(favorites有資料者)從localStorage提取並轉成JS資料
function everUsed() {
  if (Boolean(localStorage.getItem('personalInfo')))
    personalInfo = JSON.parse(localStorage.getItem('personalInfo'))
  renderList(getByPage(1))
  renderPaginator(personalInfo.length)
}
// 印出card(照片、姓名及按鈕)
function renderList(list) {
  let friendListHTML = ''
  let index = 0
  list.forEach(item => {
    friendListHTML += `
    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <img src=${item.avatar} class="card-img-top show-modal" data-bs-toggle="modal" data-bs-target="#friend-modal" data-id=${item.id} data-index=${index} alt="picture">
        <p class="card-text">${item.name} ${item.surname}</p>
      </div>
      <div class="card-footer">
        ${item.favorite ? favoriteHTML : notFavoriteHTML}${item.id} class="add-by-card" data-index=${index}>Favorite</button>
        <a href="#" class="btn btn-primary show-modal" data-bs-toggle="modal" data-bs-target="#friend-modal" data-id=${item.id}>More</a>
      </div>
    </div>`
    index++
  })
  friendList.innerHTML = friendListHTML
}

// 設置監聽器
friendList.addEventListener('click', event => {
  // 點擊照片或More按鈕都能產生Modal
  if (event.target.matches('.show-modal')) {
    showModal(event.target.dataset)
    // 點擊Favorite按鈕加入最愛
  } else if (event.target.matches('.favorite')) {
    addToFavorite(event.target, Number(event.target.dataset.index))
  }
})

// 找出被點擊的ID，利用剛才生成的personalInfo陣列完善modal內容
function showModal(dataset) {
  const modalContent = document.querySelector('.modal-content')
  const modalInfo = personalInfo.find(info => info.id === Number(dataset.id))
  modalContent.innerHTML = `
      <div class="modal-header">
        <h5 class="modal-title" >${modalInfo.name} ${modalInfo.surname}</h5>
      </div>
      <div class="modal-body">
        <p class="modal-text-content"><img src=${modalInfo.avatar}> <br> email: ${modalInfo.email} <br> gender: ${modalInfo.gender} <br> age: ${modalInfo.age} <br> region: ${modalInfo.region} <br> birthday: ${modalInfo.birthday} </p>
      </div>
      <div class="modal-footer">
        ${modalInfo.favorite ? favoriteHTML : notFavoriteHTML}${modalInfo.id} id="add-by-modal">Favorite</button>
        <bufatton type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>`
  const addByModal = document.querySelector('#add-by-modal')
  addByModal.addEventListener('click', event => {
    addToFavorite(event.target, Number(dataset.index))
  })
}

// 搜尋功能
// 搜尋欄設置監聽器
searchForm.addEventListener('submit', event => {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  // 若未輸入則跳出警告
  if (!keyword.trim().length) {
    alert('Please enter keywords')
  } else {
    // 將符合條件的資料(object)push進resultList陣列
    personalInfo.filter(info => {
      const fullName = (info.name + info.surname).toLowerCase()
      if (fullName.includes(keyword))
        resultList.push(info)
    })
    // 印出resultList及分頁器
    renderPaginator(resultList.length)
    renderList(getByPage(1))
  }
})

// 收藏功能
function addToFavorite(target, index) {
  // 選擇卡片上按鈕的節點餅找出點選的是畫面上的第幾個
  target.classList.toggle('btn-danger')
  target.classList.toggle('btn-outline-danger')
  // 被點選的人personalInfo陣列裡的favorite boolean改變  
  const changedItem = personalInfo.find(item =>
    item.id === Number(target.dataset.id))
  changedItem.favorite = !changedItem.favorite
  // 如果是從Modal加入最愛，除Modal上的Favorite按鈕，card按鈕樣式也要改變
  if (target.id === 'add-by-modal') {
    const changedButton = friendList.children[index].children[1].children[0]
    changedButton.classList.toggle('btn-danger')
    changedButton.classList.toggle('btn-outline-danger')
  }
  // 更新後的personalInfo陣列傳入localStorage
  localStorage.setItem('personalInfo', JSON.stringify(personalInfo))
}

// 計算分頁該顯示哪幾筆資料
function getByPage(page) {
  const list = resultList.length ? resultList : personalInfo
  return list.slice(dataPerPage * (page - 1), dataPerPage * page)
  // console.log(typeof(dataPerPage))
}

// 計算頁數並印出
function renderPaginator(length) {
  const pageAmount = Math.ceil(length / dataPerPage)
  let rawHTML = ''
  for (let page = 1; page <= pageAmount; page++) {
    // 有pill效果
    rawHTML += `<li class="page-item"><a class="page-link nav-link" data-bs-toggle="pill" href="#">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// 分頁器功能
paginator.addEventListener('click', event => {
  if (event.target.tagName !== 'A') return
  renderList(getByPage(event.target.textContent))
})