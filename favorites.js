// 宣告變數
const friendList = document.querySelector('#friend-list')
const personalInfo = JSON.parse(localStorage.getItem('personalInfo'))
let favorites = []
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const dataPerPage = 15

// 建立favorites，為personalInfo 中 favorite = true的資料
favorites.push(...personalInfo.filter(item => item.favorite))
renderList(favorites)

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
        <button type="button" class="btn btn-danger remove" data-id=${item.id} data-index=${index}>Remove</button>
        <a href="#" class="btn btn-primary show-modal" data-bs-toggle="modal" data-bs-target="#friend-modal" data-id=${item.id} data-index=${index}>More</a>
      </div>
    </div>`
    index++
  })
  friendList.innerHTML = friendListHTML
}

// 設置監聽器，當照片被點擊會根據被點擊的ID生成modal
friendList.addEventListener('click', event => {
  if (event.target.matches('.show-modal')) {
    console.log(event.target.dataset)
    showModal(event.target.dataset)
  } else if (event.target.matches('.remove')) {
    removeFromFavorite(event.target, event.target.dataset.index)
  }
})

// 找出被點擊的ID在陣列中的完整資料
// 利用剛才生成的favorites陣列完善modal內容
function showModal(dataset) {
  const modalContent = document.querySelector('.modal-content')
  const modalInfo = favorites.find(info => info.id === Number(dataset.id))
  modalContent.innerHTML = `
      <div class="modal-header">
        <h5 class="modal-title" >${modalInfo.name} ${modalInfo.surname}</h5>
      </div>
      <div class="modal-body">
        <p class="modal-text-content"><img src=${modalInfo.avatar}> <br> email: ${modalInfo.email} <br> gender: ${modalInfo.gender} <br> age: ${modalInfo.age} <br> region: ${modalInfo.region} <br> birthday: ${modalInfo.birthday} </p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger remove" data-id=${modalInfo.id} data-index=${dataset.index} data-bs-dismiss="modal" id="remove-from-modal">Remove</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>`
  const removeFromModal = document.querySelector('#remove-from-modal')
  removeFromModal.addEventListener('click', event => {
    removeFromFavorite(event.target, event.target.dataset.index)
  })
}

// 搜尋功能
// 搜尋欄設置監聽器
searchForm.addEventListener('submit', event => {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  // 若未輸入則跳出警告
  if (!keyword.trim().length)
    alert('Please enter keywords')
  // 將符合條件的資料(object)push進resultList陣列
  const resultList = []
  favorites.filter(info => {
    const fullName = (info.name + info.surname).toLowerCase()
    if (fullName.includes(keyword))
      resultList.push(info)
  })
  // 印出resultList
  renderList(resultList)
})

// 刪除功能
function removeFromFavorite(target, index) {
  // 選擇卡片上按鈕的節點餅找出點選的是畫面上的第幾個，從favorites刪除
  favorites.splice(index, 1)
  // personalInfo中favorite = false  
  const indexOfAll = personalInfo.findIndex(item => item.id === Number(target.dataset.id))
  personalInfo[indexOfAll].favorite = false
  // 重新印出favorites
  renderList(favorites)
  // 更新後的personalInfo陣列傳入localStorage
  localStorage.setItem('personalInfo', JSON.stringify(personalInfo))
}