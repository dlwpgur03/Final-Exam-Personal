// 방문자 카운트 (localStorage 사용)
let visitorCount =
  parseInt(localStorage.getItem('visitor-count') || '0', 10) + 1
localStorage.setItem('visitor-count', visitorCount)
document.getElementById('visitor-count').textContent = visitorCount

// QnA 데이터 저장
let qnaData = JSON.parse(localStorage.getItem('qna-list') || '[]')
function renderQna() {
  const list = document.getElementById('qna-list')
  if (!qnaData.length) {
    list.innerHTML =
      '<div style="color:#888; text-align:center;">아직 남겨진 질문/메시지가 없습니다.</div>'
    return
  }
  list.innerHTML = qnaData
    .map(
      (q, i) => `
      <div style="background:#181818; border-radius:15px; margin-bottom:1.5rem; padding:1.2rem 1.7rem;">
        <div style="font-size:1.15rem; color:#fff;">Q. ${q.question}</div>
        <div style="margin-top:0.7rem;">
          ${
            q.answer
              ? `<div style="color:#3ef58a; font-size:1.04rem; font-weight:500;">A. ${q.answer}</div>`
              : `
                <form data-idx="${i}" class="answer-form" style="margin-top:0.3rem;">
                  <input type="text" class="answer-input" placeholder="답변을 남겨보세요" style="padding:0.4rem 0.7rem; border-radius:8px; border:none; width:70%;"/>
                  <button type="submit" style="padding:0.45rem 1.4rem; border-radius:7px; background:#12c3ec; color:#fff; font-weight:bold; border:none; margin-left:0.6rem;">답변</button>
                </form>
              `
          }
        </div>
      </div>
      `
    )
    .join('')
  // 답변 폼 이벤트 등록
  document.querySelectorAll('.answer-form').forEach((form) => {
    form.onsubmit = (e) => {
      e.preventDefault()
      const idx = parseInt(form.dataset.idx, 10)
      const input = form.querySelector('.answer-input')
      if (input.value.trim()) {
        qnaData[idx].answer = input.value.trim()
        localStorage.setItem('qna-list', JSON.stringify(qnaData))
        renderQna()
      }
    }
  })
}

// 질문 등록
document.getElementById('qna-form').onsubmit = function (e) {
  e.preventDefault()
  const input = document.getElementById('question-input')
  const text = input.value.trim()
  if (text.length === 0) return
  qnaData.unshift({ question: text, answer: '' })
  localStorage.setItem('qna-list', JSON.stringify(qnaData))
  input.value = ''
  renderQna()
}

renderQna()

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const tgt = document.querySelector(link.getAttribute('href'))
    if (tgt) tgt.scrollIntoView({ behavior: 'smooth' })
  })
})

// Highlight nav link based on section visibility
const sections = document.querySelectorAll('section[id]')
const navLinks = document.querySelectorAll('nav ul li a')

const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 }

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.remove('active'))
      const id = entry.target.getAttribute('id')
      const activeLink = document.querySelector(`nav ul li a[href="#${id}"]`)
      if (activeLink) activeLink.classList.add('active')
    }
  })
}, observerOptions)

sections.forEach((section) => observer.observe(section))

// 버튼 랜덤 텍스트 애니메이션
document.querySelectorAll('.btn-primary').forEach((button) => {
  const originalText = button.textContent
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let intervalId

  // 랜덤 텍스트 생성 함수
  function startRandom() {
    intervalId = setInterval(() => {
      let scrambled = ''
      for (let i = 0; i < originalText.length; i++) {
        scrambled += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      button.textContent = scrambled
    }, 50)
  }

  // 버튼이 opacity 1로 나타나면 랜덤 시작
  const observer = new MutationObserver(() => {
    if (button.style.opacity === '1') {
      startRandom()
    } else {
      clearInterval(intervalId)
      button.textContent = originalText
    }
  })
  observer.observe(button, {
    attributes: true,
    attributeFilter: ['style'],
  })

  button.addEventListener('mouseenter', () => {
    clearInterval(intervalId)
    button.textContent = originalText
  })

  button.addEventListener('mouseleave', () => {
    startRandom()
  })
})

// HERO 애니메이션: 랜덤 → '안녕하세요!' → '이제혁의 PortFolio 홈페이지 입니다'
document.addEventListener('DOMContentLoaded', () => {
  const heroTextEl = document.getElementById('hero-text')
  const firstText = '안녕하세요!'
  const finalText = '이제혁의 PortFolio|홈페이지 입니다'
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const specials = '!@#$%^&*()_+-='

  function randomStr(length, isLastSpecial = false) {
    let s = ''
    for (let i = 0; i < length; i++) {
      if (isLastSpecial && i === length - 1) {
        s += specials.charAt(Math.floor(Math.random() * specials.length))
      } else {
        s += letters.charAt(Math.floor(Math.random() * letters.length))
      }
    }
    return s
  }

  function revealLeftToRight(str, callback) {
    let fixed = ''
    let idx = 0
    let frame = 0
    function next() {
      let rand = randomStr(str.length - fixed.length, true)
      heroTextEl.textContent = fixed + rand
      if (frame < 8) {
        frame++
        setTimeout(next, 35)
      } else if (fixed.length < str.length) {
        fixed += str[fixed.length]
        frame = 0
        setTimeout(next, 70)
      } else {
        callback && callback()
      }
    }
    next()
  }

  function revealAndExpand(from, to) {
    let fixed = ''
    let frame = 0
    let currentLength = from.length
    function step() {
      if (currentLength < to.length) {
        let rand = randomStr(currentLength - fixed.length, false)
        heroTextEl.innerHTML = (fixed + rand).replace('|', '<br>')
        if (frame < 6) {
          frame++
          setTimeout(step, 28)
        } else {
          fixed += to[fixed.length]
          frame = 0
          if (fixed.length === currentLength) {
            currentLength++
          }
          setTimeout(step, 55)
        }
      } else {
        if (fixed.length < to.length) {
          let rand = randomStr(to.length - fixed.length, false)
          heroTextEl.innerHTML = (fixed + rand).replace('|', '<br>')
          if (frame < 6) {
            frame++
            setTimeout(step, 28)
          } else {
            fixed += to[fixed.length]
            frame = 0
            setTimeout(step, 55)
          }
        } else {
          heroTextEl.innerHTML = to.replace('|', '<br>')
          document
            .querySelectorAll('.btn-primary')
            .forEach((btn) => (btn.style.opacity = '1'))
        }
      }
    }
    step()
  }

  function startAnimation() {
    let iterations = 0
    const maxIterations = 5
    function firstRand() {
      if (iterations < maxIterations) {
        heroTextEl.textContent = randomStr(6, true)
        iterations++
        setTimeout(firstRand, 40)
      } else {
        revealLeftToRight(firstText, () => {
          setTimeout(() => {
            revealAndExpand(firstText, finalText)
          }, 800)
        })
      }
    }
    firstRand()
  }

  startAnimation()
})

// 프로젝트 카드 등장 애니메이션
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.project-card')
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 등장 순서대로 딜레이 추가
          const idx = Array.from(cards).indexOf(entry.target)
          entry.target.style.transitionDelay = idx * 0.12 + 's'
          entry.target.classList.add('visible')
          obs.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.18 }
  )
  cards.forEach((card) => obs.observe(card))
})
