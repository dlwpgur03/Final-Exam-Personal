// 네비게이션 더보기 버튼 및 메뉴 동작
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('nav-container')
  const moreBtn = document.getElementById('more-btn')
  let navHidden = false

  window.addEventListener('scroll', function () {
    if (window.scrollY > 80) {
      nav.style.display = 'none'
      moreBtn.style.display = 'block'
      navHidden = true
    } else {
      nav.style.display = ''
      moreBtn.style.display = 'none'
      closeMoreMenu()
      navHidden = false
    }
  })

  moreBtn.addEventListener('click', function (e) {
    showMoreMenu()
    moreBtn.style.display = 'none'
    e.stopPropagation()
  })

  // 바깥 클릭 시 메뉴 닫기
  document.addEventListener('click', function (e) {
    closeMoreMenu()
  })

  // 메뉴 클릭 시 닫기
  document.body.addEventListener('click', function (e) {
    if (e.target.classList.contains('more-menu-link')) {
      closeMoreMenu()
    }
  })

  function showMoreMenu() {
    if (document.getElementById('more-menu')) return
    const menu = document.createElement('div')
    menu.id = 'more-menu'
    menu.style.position = 'fixed'
    menu.style.top = '60px'
    menu.style.left = '24px'
    menu.style.background = '#232323'
    menu.style.color = '#fff'
    menu.style.borderRadius = '10px'
    menu.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)'
    menu.style.padding = '24px 36px'
    menu.style.zIndex = '2000'
    menu.innerHTML = `
      <a href="index.html" class="more-menu-link" style="display:block; font-size:1.3rem; margin-bottom:18px; color:#fff; text-decoration:none;">HOME</a>
      <a href="team.html" class="more-menu-link" style="display:block; font-size:1.3rem; margin-bottom:18px; color:#fff; text-decoration:none;">Team</a>
      <a href="project.html" class="more-menu-link" style="display:block; font-size:1.3rem; color:#fff; text-decoration:none;">Project</a>
    `
    document.body.appendChild(menu)
  }

  function closeMoreMenu() {
    const menu = document.getElementById('more-menu')
    if (menu) menu.remove()
    moreBtn.style.display = window.scrollY > 80 ? 'block' : 'none'
  }

  // 고정 버튼 기능: 뒷면 상태로 고정 & 회전 막기
  document.querySelectorAll('.pin-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation()
      const card = btn.closest('.team-card')
      card.classList.toggle('pinned')
      btn.classList.toggle('pinned')
      // 카드가 고정되면 항상 뒷면 상태로 유지
      if (card.classList.contains('pinned')) {
        card.querySelector('.card-inner').style.transform = 'rotateY(180deg)'
        card.classList.add('no-hover')
      } else {
        card.querySelector('.card-inner').style.transform = ''
        card.classList.remove('no-hover')
      }
    })
  })

  // team.js 등 원하는 위치에 추가
  const cards = document.querySelectorAll('.team-card')
  cards.forEach((card, idx) => {
    setTimeout(() => {
      card.classList.add('show')
    }, 200 * idx) // 0.2초 간격으로 등장
  })
})
