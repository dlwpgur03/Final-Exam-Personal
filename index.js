document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('nav-container')
  const moreBtn = document.getElementById('more-btn')
  let navHidden = false

  // about 카드 순차 애니메이션
  window.addEventListener('scroll', function () {
    document.querySelectorAll('.about-card').forEach(function (card) {
      const rect = card.getBoundingClientRect()
      if (rect.top < window.innerHeight - 100) {
        card.classList.add('show')
      }
    })
  })

  // 스크롤 시 nav 숨기고 더보기 버튼 보이기
  window.addEventListener('scroll', function () {
    if (window.scrollY > 80) {
      nav.style.display = 'none'
      moreBtn.style.display = 'block'
      navHidden = true
    } else {
      nav.style.display = ''
      moreBtn.style.display = 'none'
      navHidden = false
      closeMoreMenu()
    }
  })

  // 더보기 버튼 클릭 시 메뉴 출력
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
})
